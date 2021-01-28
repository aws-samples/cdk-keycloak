import * as certmgr from '@aws-cdk/aws-certificatemanager';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as rds from '@aws-cdk/aws-rds';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';

export interface KeyCloadProps {
  /**
   * VPC for the workload
   */
  readonly vpc?: ec2.IVpc;
  /**
   * ACM certificate ARN to import
   */
  readonly certificateArn: string;
  /**
   * Create a bastion host for debugging or trouble-shooting
   *
   * @default false
   */
  readonly bastion?: boolean;
  /**
   * Number of keycloak node in the cluster
   *
   * @default 1
   */
  readonly nodeCount?: number;
}

export class KeyCloak extends cdk.Construct {
  readonly vpc: ec2.IVpc;
  readonly db?: Database;
  constructor(scope: cdk.Construct, id: string, props: KeyCloadProps) {
    super(scope, id);

    this.vpc = props.vpc ?? getOrCreateVpc(this);
    this.db = this.addDatabase();
    this.addKeyCloakContainerService({
      database: this.db,
      vpc: this.vpc,
      keycloakSecret: this._generateKeycloakSecret(),
      certificate: certmgr.Certificate.fromCertificateArn(this, 'ACMCert', props.certificateArn),
      bastion: props.bastion,
      nodeCount: props.nodeCount,
    });
  }
  public addDatabase(): Database {
    return new Database(this, 'Database', {
      vpc: this.vpc,
    });
  }
  public addKeyCloakContainerService(props: ContainerServiceProps) {
    return new ContainerService(this, 'KeyCloakContainerSerivce', props);
  }
  private _generateKeycloakSecret(): secretsmanager.ISecret {
    return new secretsmanager.Secret(this, 'KCSecret', {
      generateSecretString: {
        generateStringKey: 'password',
        excludePunctuation: true,
        passwordLength: 12,
        secretStringTemplate: JSON.stringify({ username: 'keycloak' }),
      },
    });
  }
}

export interface DatabaseProps {
  /**
   * The VPC for the database
   */
  readonly vpc: ec2.IVpc;
  /**
   * The database instance type
   */
  readonly instanceType?: ec2.InstanceType;
  /**
   * The database instance engine
   */
  readonly engine?: rds.IInstanceEngine;
}

export class Database extends cdk.Construct {
  readonly dbinstance: rds.DatabaseInstance;
  readonly vpc: ec2.IVpc;
  readonly clusterEndpointHostname: string;
  readonly clusterIdentifier: string;
  readonly secret: secretsmanager.ISecret;
  private readonly _mysqlListenerPort: number = 3306;


  constructor(scope: cdk.Construct, id: string, props: DatabaseProps) {
    super(scope, id);
    const dbInstance = new rds.DatabaseInstance(this, 'DBInstance', {
      vpc: props.vpc,
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_21,
      }),
      credentials: rds.Credentials.fromGeneratedSecret('admin'),
      instanceType: props.instanceType ?? new ec2.InstanceType('r5.large'),
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.mysql8.0'),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.secret = dbInstance.secret!;

    // allow internally from the same security group
    dbInstance.connections.allowInternally(ec2.Port.tcp(this._mysqlListenerPort));
    // allow from the whole vpc cidr
    dbInstance.connections.allowFrom(ec2.Peer.ipv4(props.vpc.vpcCidrBlock), ec2.Port.tcp(this._mysqlListenerPort));

    this.dbinstance = dbInstance;
    this.vpc = props.vpc;
    this.clusterEndpointHostname = dbInstance.dbInstanceEndpointAddress;
    this.clusterIdentifier = dbInstance.instanceIdentifier;

    printOutput(this, 'clusterEndpointHostname', this.clusterEndpointHostname);
    printOutput(this, 'clusterIdentifier', this.clusterIdentifier);

    if (this.dbinstance.secret) {
      printOutput(this, 'DBSecretArn', this.dbinstance.secret.secretArn);
    }
  }
}

export interface ContainerServiceProps {
  /**
   * The VPC for the service
   */
  readonly vpc: ec2.IVpc;
  /**
   * The RDS database for the service
   */
  readonly database: Database;
  /**
   * The secrets manager secret for the keycloak
   */
  readonly keycloakSecret: secretsmanager.ISecret;
  /**
   * The ACM certificate
   */
  readonly certificate: certmgr.ICertificate;
  /**
   * Whether to create the bastion host
   * @default false
   */
  readonly bastion?: boolean;
  /**
   * Whether to enable the ECS service deployment circuit breaker
   * @default false
   */
  readonly circuitBreaker?: boolean;
  /**
   * Number of keycloak node in the cluster
   *
   * @default 1
   */
  readonly nodeCount?: number;
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

    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // bootstrap container that creates the database if not exist
    const bootstrap = taskDefinition.addContainer('bootstrap', {
      essential: false,
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ubuntu/mysql:latest'),
      environment: {
        DB_NAME: 'keycloak',
        DB_USER: 'admin',
        DB_ADDR: props.database.clusterEndpointHostname,
      },
      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(props.database.secret, 'password'),
      },
      command: [
        'sh', '-c',
        'mysql -u$DB_USER -p$DB_PASSWORD -h$DB_ADDR -e "CREATE DATABASE IF NOT EXISTS $DB_NAME"',
      ],
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'bootstrap',
        logGroup,
      }),
    });
    const kc = taskDefinition.addContainer('keycloak', {
      image: ecs.ContainerImage.fromRegistry('jboss/keycloak:12.0.2'),
      environment: {
        DB_ADDR: props.database.clusterEndpointHostname,
        DB_DATABASE: 'keycloak',
        DB_PORT: '3306',
        DB_USER: 'admin',
        DB_VENDOR: 'mysql',
        JDBC_PARAMS: 'useSSL=false',
      },
      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(props.database.secret, 'password'),
        KEYCLOAK_PASSWORD: ecs.Secret.fromSecretsManager(props.keycloakSecret, 'password'),
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'keycloak',
        logGroup,
      }),
    });
    kc.addPortMappings({
      containerPort: 8080,
    });

    kc.addContainerDependencies({
      container: bootstrap,
      condition: ecs.ContainerDependencyCondition.SUCCESS,
    });

    this.service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
      circuitBreaker: props.circuitBreaker ? { rollback: true } : undefined,
      desiredCount: props.nodeCount ?? 1,
      healthCheckGracePeriod: cdk.Duration.seconds(120),
    });

    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: true,
    });
    printOutput(this, 'EndpointURL', alb.loadBalancerDnsName);

    const listener = alb.addListener('HttpListener', {
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [{ certificateArn: props.certificate.certificateArn }],
    });

    listener.addTargets('ECSTarget', {
      targets: [this.service],
      // set slow_start.duration_seconds to 60
      // see https://docs.aws.amazon.com/cli/latest/reference/elbv2/modify-target-group-attributes.html
      slowStart: cdk.Duration.seconds(60),
      stickinessCookieDuration: cdk.Duration.days(1),
      port: 8080,
      protocol: elbv2.ApplicationProtocol.HTTP,
    });

    // allow task execution role to read the secrets
    props.database.secret.grantRead(taskDefinition.executionRole!);
    props.keycloakSecret.grantRead(taskDefinition.executionRole!);

    // allow ecs task connect to database
    props.database.dbinstance.connections.allowDefaultPortFrom(this.service);

    // create a bastion host
    if (props.bastion === true) {
      const bast = new ec2.BastionHostLinux(this, 'Bast', {
        vpc,
        instanceType: new ec2.InstanceType('m5.large'),
      });
      props.database.dbinstance.connections.allowDefaultPortFrom(bast);
    }
  }
}

/**
 * Create or import VPC
 * @param scope the cdk scope
 */
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
