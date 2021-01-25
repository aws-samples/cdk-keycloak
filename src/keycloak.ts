import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as rds from '@aws-cdk/aws-rds';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
// import * as certmgr from '@aws-cdk/aws-certificatemanager';

export interface KeyCloadProps {
  readonly vpc?: ec2.IVpc;
}

export class KeyCloak extends cdk.Construct {
  readonly vpc: ec2.IVpc;
  readonly db?: Database;
  constructor(scope: cdk.Construct, id: string, props: KeyCloadProps = {}) {
    super(scope, id);

    this.vpc = props.vpc ?? getOrCreateVpc(this);
    this.db = this.addDatabase();
    this.addKeyCloakContainerService({
      database: this.db,
      // dbSecret: this.db.secret,
      // dbHost: this.db.clusterEndpointHostname,
      // dbUser: this.db.databaseUsername,
      vpc: this.vpc,
      keycloakSecret: this._generateKeycloakSecret(),
    });
  }
  public addDatabase(): Database {
    return new Database(this, 'Database', {
      vpc: this.vpc,
    });
  }
  public addKeyCloakContainerService(props: ContainerServiceProps) {
    return new ContainerService(this, 'KeyCloakContainerSerivce', props );
  }
  private _generateKeycloakSecret(): secretsmanager.ISecret {
    return new secretsmanager.Secret(this, 'KCSecret', {
      generateSecretString: {
        generateStringKey: 'password',
        secretStringTemplate: JSON.stringify({ username: 'keycloak' }),
      },
    });
  }
}

export interface DatabaseProps {
  readonly vpc: ec2.IVpc;
  readonly instanceType?: ec2.InstanceType;
  readonly engine?: rds.IClusterEngine;
  /**
   * database user name
   *
   * @default admin
   */
  readonly databaseUsername?: string;
}

export class Database extends cdk.Construct {
  readonly dbcluster: rds.DatabaseCluster;
  readonly databaseUsername: string;
  readonly vpc: ec2.IVpc;
  readonly clusterEndpointHostname: string;
  readonly clusterReadEndpointHostname: string;
  readonly clusterIdentifier: string;
  readonly secret: secretsmanager.ISecret;
  private readonly _autoraListenerPort: number = 3306;


  constructor(scope: cdk.Construct, id: string, props: DatabaseProps) {
    super(scope, id);
    this.databaseUsername = props.databaseUsername ?? 'admin';
    const dbcluster = new rds.DatabaseCluster(this, 'Database', {
      engine: props.engine ?? rds.DatabaseClusterEngine.AURORA_MYSQL,
      credentials: {
        username: this.databaseUsername,
      },
      instanceProps: {
        instanceType: props.instanceType ?? new ec2.InstanceType('r5.large'),
        vpc: props.vpc,
      },
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-mysql5.7'),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.secret = dbcluster.secret!;


    // allow internally from the same security group
    dbcluster.connections.allowInternally(ec2.Port.tcp(this._autoraListenerPort));
    // allow from the whole vpc cidr
    dbcluster.connections.allowFrom(ec2.Peer.ipv4(props.vpc.vpcCidrBlock), ec2.Port.tcp(this._autoraListenerPort));

    this.dbcluster = dbcluster;
    this.vpc = props.vpc;
    this.clusterEndpointHostname = dbcluster.clusterEndpoint.hostname;
    this.clusterReadEndpointHostname = dbcluster.clusterReadEndpoint.hostname;
    this.clusterIdentifier = dbcluster.clusterIdentifier;

    printOutput(this, 'clusterEndpointHostname', this.clusterEndpointHostname);
    printOutput(this, 'clusterReadEndpointHostname', this.clusterReadEndpointHostname);
    printOutput(this, 'clusterIdentifier', this.clusterIdentifier);

    if (dbcluster.secret) {
      printOutput(this, 'DBSecretArn', dbcluster.secret.secretArn);
    }
  }
}

export interface ContainerServiceProps {
  readonly vpc: ec2.IVpc;
  readonly database: Database;
  // readonly dbHost: string;
  // readonly dbUser: string;
  // readonly dbSecret: secretsmanager.ISecret;
  readonly keycloakSecret: secretsmanager.ISecret;
}

export class ContainerService extends cdk.Construct {
  readonly service: ecs.FargateService;
  constructor(scope: cdk.Construct, id: string, props: ContainerServiceProps) {
    super(scope, id);

    const vpc = props.vpc;
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    const taskRole = new iam.Role(this, 'TaskRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('ecs.amazonaws.com'),
        new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      ),
    });
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 4096,
      memoryLimitMiB: 30720,
      executionRole: taskRole,
    });
    const kc = taskDefinition.addContainer('keycloak', {
      image: ecs.ContainerImage.fromRegistry('jboss/keycloak:12.0.2'),
      environment: {
        DB_ADDR: props.database.clusterEndpointHostname,
        DB_DATABASE: 'keycloak',
        DB_PORT: '3306',
        DB_USER: props.database.databaseUsername,
        DB_VENDOR: 'mysql',
        JDBC_PARAMS: 'useSSL=false',
      },
      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(props.database.secret, 'password'),
        KEYCLOAK_PASSWORD: ecs.Secret.fromSecretsManager(props.keycloakSecret, 'password'),
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'KeyCloak',
        logGroup: new logs.LogGroup(this, 'LogGroup', {
          logGroupName: `KeyCloak${id}`,
          retention: logs.RetentionDays.ONE_MONTH,
        }),
      }),
    });
    kc.addPortMappings({
      containerPort: 8080,
    });

    this.service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
      circuitBreaker: {
        rollback: true,
      },
    });

    // allow task execution role to read the secrets
    props.database.secret.grantRead(taskDefinition.executionRole!);
    props.keycloakSecret.grantRead(taskDefinition.executionRole!);

    // allow ecs task connect to database
    props.database.dbcluster.connections.allowDefaultPortFrom(this.service)
    

  }
}


function getOrCreateVpc(scope: cdk.Construct): ec2.IVpc {
  // use an existing vpc or create a new one
  return scope.node.tryGetContext('use_default_vpc') === '1' ?
    ec2.Vpc.fromLookup(scope, 'Vpc', { isDefault: true }) :
    scope.node.tryGetContext('use_vpc_id') ?
      ec2.Vpc.fromLookup(scope, 'Vpc', { vpcId: scope.node.tryGetContext('use_vpc_id') }) :
      new ec2.Vpc(scope, 'Vpc', { maxAzs: 3, natGateways: 1 });
}

function printOutput(scope: cdk.Construct, id: string, key: string | number) {
  new cdk.CfnOutput(scope, id, { value: String(key) });
}

