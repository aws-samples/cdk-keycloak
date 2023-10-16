import * as cdk from 'aws-cdk-lib';
import {
  aws_certificatemanager as certmgr,
  aws_ec2 as ec2, aws_ecs as ecs, aws_elasticloadbalancingv2 as elbv2,
  aws_iam as iam,
  aws_logs as logs,
  aws_rds as rds,
  aws_secretsmanager as secretsmanager,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

// regional availibility for aurora serverless
// see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraFeaturesRegionsDBEngines.grids.html
const AURORA_SERVERLESS_SUPPORTED_REGIONS = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ap-south-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'ca-central-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'cn-northwest-1',
];

/**
 * Keycloak  version
 */
export class KeycloakVersion {
  /**
   * Keycloak version 12.0.4
   */
  public static readonly V12_0_4 = KeycloakVersion.of('12.0.4');

  /**
   * Keycloak version 15.0.0
   */
  public static readonly V15_0_0 = KeycloakVersion.of('15.0.0');

  /**
   * Keycloak version 15.0.1
   */
  public static readonly V15_0_1 = KeycloakVersion.of('15.0.1');

  /**
   * Keycloak version 15.0.2
   */
  public static readonly V15_0_2 = KeycloakVersion.of('15.0.2');

  /**
   * Keycloak version 16.1.1
   */
  public static readonly V16_1_1 = KeycloakVersion.of('16.1.1');

  /**
   * Keycloak version 17.0.1
   */
  public static readonly V17_0_1 = KeycloakVersion.of('17.0.1');

  /**
   * Keycloak version 18.0.2
   */
  public static readonly V18_0_2 = KeycloakVersion.of('18.0.2');

  /**
   * Keycloak version 19.0.3
   */
  public static readonly V19_0_3 = KeycloakVersion.of('19.0.3');

  /**
   * Keycloak version 20.0.5
   */
  public static readonly V20_0_5 = KeycloakVersion.of('20.0.5');

  /**
   * Keycloak version 21.0.0
   */
  public static readonly V21_0_0 = KeycloakVersion.of('21.0.0');

  /**
   * Keycloak version 21.0.1
   */
  public static readonly V21_0_1 = KeycloakVersion.of('21.0.1');

  /**
   * Keycloak version 22.0.4
   */
  public static readonly V22_0_4 = KeycloakVersion.of('22.0.4');

  /**
   * Custom cluster version
   * @param version custom version number
   */
  public static of(version: string) { return new KeycloakVersion(version); }
  /**
   *
   * @param version cluster version number
   */
  private constructor(public readonly version: string) { }
}

interface dockerImageMap {
  'aws': string;
  'aws-cn': string;
}

const KEYCLOAK_DOCKER_IMAGE_URI_MAP: dockerImageMap = {
  'aws': 'quay.io/keycloak/keycloak:',
  'aws-cn': '048912060910.dkr.ecr.cn-northwest-1.amazonaws.com.cn/quay/keycloak/keycloak:',
};

/**
 * The ECS task autoscaling definition
 */
export interface AutoScaleTask {
  /**
   * The minimal count of the task number
   *
   * @default - nodeCount
   */
  readonly min?: number;
  /**
   * The maximal count of the task number
   *
   * @default - min + 5
   */
  readonly max?: number;
  /**
   * The target cpu utilization for the service autoscaling
   *
   * @default 75
   */
  readonly targetCpuUtilization?: number;
}

export interface KeyCloakProps {
  /**
   * The Keycloak version for the cluster.
   */
  readonly keycloakVersion: KeycloakVersion;
  /**
   * The environment variables to pass to the keycloak container
   */
  readonly env?: { [key: string]: string };
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
   * @default 2
   */
  readonly nodeCount?: number;
  /**
   * VPC public subnets for ALB
   *
   * @default - VPC public subnets
   */
  readonly publicSubnets?: ec2.SubnetSelection;
  /**
   * VPC private subnets for keycloak service
   *
   * @default - VPC private subnets
   */
  readonly privateSubnets?: ec2.SubnetSelection;
  /**
   * VPC subnets for database
   *
   * @default - VPC isolated subnets
   */
  readonly databaseSubnets?: ec2.SubnetSelection;
  /**
   * Database instance type
   *
   * @default r5.large
   */
  readonly databaseInstanceType?: ec2.InstanceType;
  /**
   * The database instance engine
   *
   * @default - MySQL 8.0.34
   */
  readonly instanceEngine?: rds.IInstanceEngine;
  /**
   * The database cluster engine
   *
   * @default rds.AuroraMysqlEngineVersion.VER_3_04_0
   */
  readonly clusterEngine?: rds.IClusterEngine;
  /**
   * Whether to use aurora serverless. When enabled, the `databaseInstanceType` and
   * `engine` will be ignored. The `rds.DatabaseClusterEngine.AURORA_MYSQL` will be used as
   * the default cluster engine instead.
   *
   * @default false
   */
  readonly auroraServerless?: boolean;
  /**
   * Whether to use aurora serverless v2. When enabled, the `databaseInstanceType` will be ignored.
   *
   * @default false
   */
  readonly auroraServerlessV2?: boolean;
  /**
   * Whether to use single RDS instance rather than RDS cluster. Not recommended for production.
   *
   * @default false
   */
  readonly singleDbInstance?: boolean;
  /**
   * database backup retension
   *
   * @default - 7 days
   */
  readonly backupRetention?: cdk.Duration;
  /**
   * The sticky session duration for the keycloak workload with ALB.
   *
   * @default - one day
   */
  readonly stickinessCookieDuration?: cdk.Duration;
  /**
   * Autoscaling for the ECS Service
   *
   * @default - no ecs service autoscaling
   */
  readonly autoScaleTask?: AutoScaleTask;

  /**
   * Whether to put the load balancer in the public or private subnets
   *
   * @default true
   */
  readonly internetFacing?: boolean;

  /**
   * The hostname to use for the keycloak server
   */
  readonly hostname?: string;

  /**
   * The minimum number of Aurora Serverless V2 capacity units.
   *
   * @default 0.5
  */
  readonly databaseMinCapacity?: number;

  /**
  * The maximum number of Aurora Serverless V2 capacity units.
  *
   * @default 10
   */
  readonly databaseMaxCapacity?: number;

  /**
   * Controls what happens to the database if it stops being managed by CloudFormation
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly databaseRemovalPolicy?: cdk.RemovalPolicy;

  /**
   * Overrides the default image
   *
   * @default quay.io/keycloak/keycloak:${KEYCLOAK_VERSION}
   */
  readonly containerImage?: ecs.ContainerImage;

  /**
   * The number of cpu units used by the keycloak task.
   *
   * @default 4096
   * @see FargateTaskDefinitionProps
   */
  readonly taskCpu?: number;

  /**
   * The amount (in MiB) of memory used by the keycloak task.
   *
   * @default 8192
   * @see FargateTaskDefinitionProps
   */
  readonly taskMemory?: number;

}

export class KeyCloak extends Construct {
  readonly vpc: ec2.IVpc;
  readonly db?: Database;
  readonly applicationLoadBalancer: elbv2.ApplicationLoadBalancer;
  readonly keycloakSecret: secretsmanager.ISecret;
  constructor(scope: Construct, id: string, props: KeyCloakProps) {
    super(scope, id);

    const region = cdk.Stack.of(this).region;
    const regionIsResolved = !cdk.Token.isUnresolved(region);

    if (props.auroraServerless && regionIsResolved && !AURORA_SERVERLESS_SUPPORTED_REGIONS.includes(region)) {
      throw new Error(`Aurora serverless is not supported in ${region}`);
    }

    this.keycloakSecret = this._generateKeycloakSecret();
    this.vpc = props.vpc ?? getOrCreateVpc(this);

    this.db = this.addDatabase({
      vpc: this.vpc,
      databaseSubnets: props.databaseSubnets,
      instanceType: props.databaseInstanceType,
      instanceEngine: props.instanceEngine,
      clusterEngine: props.clusterEngine,
      auroraServerless: props.auroraServerless,
      auroraServerlessV2: props.auroraServerlessV2,
      singleDbInstance: props.singleDbInstance,
      backupRetention: props.backupRetention,
      maxCapacity: props.databaseMaxCapacity,
      minCapacity: props.databaseMinCapacity,
      removalPolicy: props.databaseRemovalPolicy,
    });
    const keycloakContainerService = this.addKeyCloakContainerService({
      database: this.db,
      vpc: this.vpc,
      keycloakVersion: props.keycloakVersion,
      publicSubnets: props.publicSubnets,
      privateSubnets: props.privateSubnets,
      keycloakSecret: this.keycloakSecret,
      certificate: certmgr.Certificate.fromCertificateArn(this, 'ACMCert', props.certificateArn),
      bastion: props.bastion,
      nodeCount: props.nodeCount,
      stickinessCookieDuration: props.stickinessCookieDuration,
      autoScaleTask: props.autoScaleTask,
      env: props.env,
      internetFacing: props.internetFacing ?? true,
      hostname: props.hostname,
      containerImage: props.containerImage,
      taskCpu: props.taskCpu,
      taskMemory: props.taskMemory,
    });

    this.applicationLoadBalancer = keycloakContainerService.applicationLoadBalancer;
    if (!cdk.Stack.of(this).templateOptions.description) {
      cdk.Stack.of(this).templateOptions.description = '(SO8021) - Deploy keycloak on AWS with cdk-keycloak construct library';
    }
  }
  public addDatabase(props: DatabaseProps): Database {
    return new Database(this, 'Database', props);
  }
  public addKeyCloakContainerService(props: ContainerServiceProps) {
    return new ContainerService(this, 'KeyCloakContainerService', props);
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
   * VPC subnets for database
   */
  readonly databaseSubnets?: ec2.SubnetSelection;
  /**
   * The database instance type
   *
   * @default r5.large
   */
  readonly instanceType?: ec2.InstanceType;
  /**
   * The database instance engine
   *
   * @default - MySQL 8.0.34
   */
  readonly instanceEngine?: rds.IInstanceEngine;
  /**
   * The database cluster engine
   *
   * @default rds.AuroraMysqlEngineVersion.VER_3_04_0
   */
  readonly clusterEngine?: rds.IClusterEngine;
  /**
   * enable aurora serverless
   *
   * @default false
   */
  readonly auroraServerless?: boolean;
  /**
   * enable aurora serverless v2
   *
   * @default false
   */
  readonly auroraServerlessV2?: boolean;

  /**
   * Whether to use single RDS instance rather than RDS cluster. Not recommended for production.
   *
   * @default false
   */
  readonly singleDbInstance?: boolean;
  /**
   * database backup retension
   *
   * @default - 7 days
   */
  readonly backupRetention?: cdk.Duration;
  /**
   * The minimum number of Aurora Serverless V2 capacity units.
   *
   * @default 0.5
  */
  readonly minCapacity?: number;
  /**
   * The maximum number of Aurora Serverless V2 capacity units.
   *
   * @default 10
   */
  readonly maxCapacity?: number;

  /**
   * Controls what happens to the database if it stops being managed by CloudFormation
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: cdk.RemovalPolicy;
}

/**
 * Database configuration
 */
export interface DatabaseConfig {
  /**
   * The database secret.
   */
  readonly secret: secretsmanager.ISecret;
  /**
   * The database connnections.
   */
  readonly connections: ec2.Connections;
  /**
   * The endpoint address for the database.
   */
  readonly endpoint: string;
  /**
   * The databasae identifier.
   */
  readonly identifier: string;
}

/**
 * Represents the database instance or database cluster
 */
export class Database extends Construct {
  readonly vpc: ec2.IVpc;
  readonly clusterEndpointHostname: string;
  readonly clusterIdentifier: string;
  readonly secret: secretsmanager.ISecret;
  readonly connections: ec2.Connections;
  private readonly _mysqlListenerPort: number = 3306;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id);
    this.vpc = props.vpc;
    let config;
    if (props.auroraServerless) {
      config = this._createServerlessCluster(props);
    } else if (props.auroraServerlessV2) {
      config = this._createServerlessV2Cluster(props);
    } else if (props.singleDbInstance) {
      config = this._createRdsInstance(props);
    } else {
      config = this._createRdsCluster(props);
    }
    this.secret = config.secret;
    // allow internally from the same security group
    config.connections.allowInternally(ec2.Port.tcp(this._mysqlListenerPort));
    // allow from the whole vpc cidr
    config.connections.allowFrom(ec2.Peer.ipv4(props.vpc.vpcCidrBlock), ec2.Port.tcp(this._mysqlListenerPort));
    this.clusterEndpointHostname = config.endpoint;
    this.clusterIdentifier = config.identifier;
    this.connections = config.connections;
    printOutput(this, 'DBSecretArn', config.secret.secretArn);
    printOutput(this, 'clusterEndpointHostname', this.clusterEndpointHostname);
    printOutput(this, 'clusterIdentifier', this.clusterIdentifier);
  }
  private _createRdsInstance(props: DatabaseProps): DatabaseConfig {
    const dbInstance = new rds.DatabaseInstance(this, 'DBInstance', {
      vpc: props.vpc,
      databaseName: 'keycloak',
      vpcSubnets: props.databaseSubnets,
      engine: props.instanceEngine ?? rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_34,
      }),
      storageEncrypted: true,
      backupRetention: props.backupRetention ?? cdk.Duration.days(7),
      credentials: rds.Credentials.fromGeneratedSecret('admin'),
      instanceType: props.instanceType ?? new ec2.InstanceType('r5.large'),
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.mysql8.0'),
      deletionProtection: true,
      removalPolicy: props.removalPolicy ?? cdk.RemovalPolicy.RETAIN,
    });
    return {
      connections: dbInstance.connections,
      endpoint: dbInstance.dbInstanceEndpointAddress,
      identifier: dbInstance.instanceIdentifier,
      secret: dbInstance.secret!,
    };
  }
  // create a RDS for MySQL DB cluster
  private _createRdsCluster(props: DatabaseProps): DatabaseConfig {
    const instanceProps = {
      instanceType: props.instanceType ?? new ec2.InstanceType('r5.large'),
      isFromLegacyInstanceProps: true,
    };
    const dbCluster = new rds.DatabaseCluster(this, 'DBCluster', {
      engine: props.clusterEngine ?? rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_3_04_0,
      }),
      defaultDatabaseName: 'keycloak',
      deletionProtection: true,
      credentials: rds.Credentials.fromGeneratedSecret('admin'),
      vpc: props.vpc,
      vpcSubnets: props.databaseSubnets,
      writer: rds.ClusterInstance.provisioned('Writer', {
        instanceType: instanceProps.instanceType,
        isFromLegacyInstanceProps: instanceProps.isFromLegacyInstanceProps,
      }),
      readers: [
        rds.ClusterInstance.provisioned('Reader', {
          instanceType: instanceProps.instanceType,
          isFromLegacyInstanceProps: instanceProps.isFromLegacyInstanceProps,
        }),
      ],
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-mysql8.0'),
      backup: {
        retention: props.backupRetention ?? cdk.Duration.days(7),
      },
      storageEncrypted: true,
      removalPolicy: props.removalPolicy ?? cdk.RemovalPolicy.RETAIN,
    });
    return {
      connections: dbCluster.connections,
      endpoint: dbCluster.clusterEndpoint.hostname,
      identifier: dbCluster.clusterIdentifier,
      secret: dbCluster.secret!,
    };
  }
  private _createServerlessCluster(props: DatabaseProps): DatabaseConfig {
    const dbCluster = new rds.ServerlessCluster(this, 'AuroraServerlessCluster', {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      vpc: props.vpc,
      defaultDatabaseName: 'keycloak',
      vpcSubnets: props.databaseSubnets,
      credentials: rds.Credentials.fromGeneratedSecret('admin'),
      backupRetention: props.backupRetention ?? cdk.Duration.days(7),
      deletionProtection: true,
      removalPolicy: props.removalPolicy ?? cdk.RemovalPolicy.RETAIN,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-mysql5.7'),
    });
    return {
      connections: dbCluster.connections,
      endpoint: dbCluster.clusterEndpoint.hostname,
      identifier: dbCluster.clusterIdentifier,
      secret: dbCluster.secret!,
    };
  }
  // create a RDS for MySQL DB cluster with Aurora Serverless v2
  private _createServerlessV2Cluster(props: DatabaseProps): DatabaseConfig {
    const instanceProps = {
      // Specify serverless Instance Type
      instanceType: new ec2.InstanceType('serverless'),
      isFromLegacyInstanceProps: true,
    };
    const dbCluster = new rds.DatabaseCluster(this, 'DBCluster', {
      engine: props.clusterEngine ?? rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_3_04_0,
      }),
      defaultDatabaseName: 'keycloak',
      deletionProtection: true,
      credentials: rds.Credentials.fromGeneratedSecret('admin'),
      vpc: props.vpc,
      vpcSubnets: props.databaseSubnets,
      writer: rds.ClusterInstance.provisioned('Writer', {
        instanceType: instanceProps.instanceType,
        isFromLegacyInstanceProps: instanceProps.isFromLegacyInstanceProps,
      }),
      readers: [
        rds.ClusterInstance.provisioned('Reader', {
          instanceType: instanceProps.instanceType,
          isFromLegacyInstanceProps: instanceProps.isFromLegacyInstanceProps,
        }),
      ],
      // Set default parameter group for Aurora MySQL 8.0
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-mysql8.0'),
      backup: {
        retention: props.backupRetention ?? cdk.Duration.days(7),
      },
      storageEncrypted: true,
      removalPolicy: props.removalPolicy ?? cdk.RemovalPolicy.RETAIN,
    });
    // Set Serverless V2 Scaling Configuration
    // TODO: Use cleaner way to set scaling configuration.
    // https://github.com/aws/aws-cdk/issues/20197
    (
      dbCluster.node.findChild('Resource') as rds.CfnDBCluster
    ).serverlessV2ScalingConfiguration = {
      minCapacity: props.minCapacity ?? 0.5,
      maxCapacity: props.maxCapacity ?? 10,
    };
    return {
      connections: dbCluster.connections,
      endpoint: dbCluster.clusterEndpoint.hostname,
      identifier: dbCluster.clusterIdentifier,
      secret: dbCluster.secret!,
    };
  }
}

export interface ContainerServiceProps {
  /**
   * The environment variables to pass to the keycloak container
   */
  readonly env?: { [key: string]: string };
  /**
   * Keycloak version for the container image
   */
  readonly keycloakVersion: KeycloakVersion;
  /**
   * The VPC for the service
   */
  readonly vpc: ec2.IVpc;
  /**
   * VPC subnets for keycloak service
   */
  readonly privateSubnets?: ec2.SubnetSelection;
  /**
   * VPC public subnets for ALB
   */
  readonly publicSubnets?: ec2.SubnetSelection;
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
  /**
   * The sticky session duration for the keycloak workload with ALB.
   *
   * @default - one day
   */
  readonly stickinessCookieDuration?: cdk.Duration;

  /**
   * Autoscaling for the ECS Service
   *
   * @default - no ecs service autoscaling
   */
  readonly autoScaleTask?: AutoScaleTask;

  /**
   * Whether to put the put the load balancer in the public or private subnets
   *
   * @default true
   */
  readonly internetFacing?: boolean;

  /**
   * The hostname to use for the keycloak server
   */
  readonly hostname?: string;

  /**
   * Overrides the default image
   *
   * @default quay.io/keycloak/keycloak:${KEYCLOAK_VERSION}
   */
  readonly containerImage?: ecs.ContainerImage;

  /**
   * The number of cpu units used by the keycloak task.
   *
   * @default 4096
   * @see FargateTaskDefinitionProps
   */
  readonly taskCpu?: number;

  /**
   * The amount (in MiB) of memory used by the keycloak task.
   *
   * @default 8192
   * @see FargateTaskDefinitionProps
   */
  readonly taskMemory?: number;
}

export class ContainerService extends Construct {
  readonly service: ecs.FargateService;
  readonly applicationLoadBalancer: elbv2.ApplicationLoadBalancer;
  constructor(scope: Construct, id: string, props: ContainerServiceProps) {
    super(scope, id);

    let containerPort = 8443;
    let protocol = elbv2.ApplicationProtocol.HTTPS;
    let entryPoint = undefined;
    let workingDirectory = undefined;
    const image = props.containerImage ?? ecs.ContainerImage.fromRegistry(this.getKeyCloakDockerImageUri(props.keycloakVersion.version));
    const isQuarkusDistribution = parseInt(props.keycloakVersion.version.split('.')[0]) > 16;
    let environment: {[key: string]: string} = {
      DB_ADDR: props.database.clusterEndpointHostname,
      DB_DATABASE: 'keycloak',
      DB_PORT: '3306',
      DB_USER: 'admin',
      DB_VENDOR: 'mysql',
      JDBC_PARAMS: 'useSSL=false',
      JGROUPS_DISCOVERY_PROTOCOL: 'JDBC_PING',
      // We don't need to specify `initialize_sql` string into `JGROUPS_DISCOVERY_PROPERTIES` property,
      // because the default `initialize_sql` is compatible with MySQL. (See: https://github.com/belaban/JGroups/blob/master/src/org/jgroups/protocols/JDBC_PING.java#L55-L60)
      // But you need to specify `initialize_sql` for PostgreSQL, because `varbinary` schema is not supported. (See: https://github.com/keycloak/keycloak-containers/blob/d4ce446dde3026f89f66fa86b58c2d0d6132ce4d/docker-compose-examples/keycloak-postgres-jdbc-ping.yml#L49)
      // JGROUPS_DISCOVERY_PROPERTIES: '',
      // KEYCLOAK_LOGLEVEL: 'DEBUG',
      PROXY_ADDRESS_FORWARDING: 'true',
    };
    let secrets: {[key: string]: cdk.aws_ecs.Secret} = {
      DB_PASSWORD: ecs.Secret.fromSecretsManager(props.database.secret, 'password'),
      KEYCLOAK_USER: ecs.Secret.fromSecretsManager(props.keycloakSecret, 'username'),
      KEYCLOAK_PASSWORD: ecs.Secret.fromSecretsManager(props.keycloakSecret, 'password'),
    };
    let portMappings: ecs.PortMapping[] = [
      { containerPort: containerPort }, // HTTPS web port
      { containerPort: 7600 }, // jgroups-tcp
      { containerPort: 57600 }, // jgroups-tcp-fd
      { containerPort: 55200, protocol: ecs.Protocol.UDP }, // jgroups-udp
      { containerPort: 54200, protocol: ecs.Protocol.UDP }, // jgroups-udp-fd
    ];

    // if this is a quarkus distribution
    if (isQuarkusDistribution) {
      containerPort = 8080;
      protocol = elbv2.ApplicationProtocol.HTTP;
      entryPoint = 'sh,-c,touch cache-ispn-jdbc-ping.xml && echo "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?> <infinispan    xmlns:xsi=\\"http://www.w3.org/2001/XMLSchema-instance\\"    xsi:schemaLocation=\\"urn:infinispan:config:11.0 http://www.infinispan.org/schemas/infinispan-config-11.0.xsd\\"    xmlns=\\"urn:infinispan:config:11.0\\">  <jgroups>    <stack name=\\"jdbc-ping-tcp\\" extends=\\"tcp\\">      <JDBC_PING connection_driver=\\"com.mysql.cj.jdbc.Driver\\"                 connection_username=\\"\\\${env.KC_DB_USERNAME}\\"                  connection_password=\\"\\\${env.KC_DB_PASSWORD}\\"                 connection_url=\\"jdbc:mysql://\\\${env.KC_DB_URL_HOST}/\\\${env.KC_DB_URL_DATABASE}\\"                                  info_writer_sleep_time=\\"500\\"                 remove_all_data_on_view_change=\\"true\\"                 stack.combine=\\"REPLACE\\"                 stack.position=\\"MPING\\" />    </stack>  </jgroups>  <cache-container name=\\"keycloak\\">    <transport lock-timeout=\\"60000\\" stack=\\"jdbc-ping-tcp\\"/>    <local-cache name=\\"realms\\">      <encoding>        <key media-type=\\"application/x-java-object\\"/>        <value media-type=\\"application/x-java-object\\"/>      </encoding>      <memory max-count=\\"10000\\"/>    </local-cache>    <local-cache name=\\"users\\">      <encoding>        <key media-type=\\"application/x-java-object\\"/>        <value media-type=\\"application/x-java-object\\"/>      </encoding>      <memory max-count=\\"10000\\"/>    </local-cache>    <distributed-cache name=\\"sessions\\" owners=\\"3\\">      <expiration lifespan=\\"-1\\"/>    </distributed-cache>    <distributed-cache name=\\"authenticationSessions\\" owners=\\"3\\">      <expiration lifespan=\\"-1\\"/>    </distributed-cache>    <distributed-cache name=\\"offlineSessions\\" owners=\\"3\\">      <expiration lifespan=\\"-1\\"/>    </distributed-cache>    <distributed-cache name=\\"clientSessions\\" owners=\\"3\\">      <expiration lifespan=\\"-1\\"/>    </distributed-cache>    <distributed-cache name=\\"offlineClientSessions\\" owners=\\"3\\">      <expiration lifespan=\\"-1\\"/>    </distributed-cache>    <distributed-cache name=\\"loginFailures\\" owners=\\"3\\">      <expiration lifespan=\\"-1\\"/>    </distributed-cache>    <local-cache name=\\"authorization\\">      <encoding>        <key media-type=\\"application/x-java-object\\"/>        <value media-type=\\"application/x-java-object\\"/>      </encoding>      <memory max-count=\\"10000\\"/>    </local-cache>    <replicated-cache name=\\"work\\">      <expiration lifespan=\\"-1\\"/>    </replicated-cache>    <local-cache name=\\"keys\\">      <encoding>        <key media-type=\\"application/x-java-object\\"/>        <value media-type=\\"application/x-java-object\\"/>      </encoding>      <expiration max-idle=\\"3600000\\"/>      <memory max-count=\\"1000\\"/>    </local-cache>    <distributed-cache name=\\"actionTokens\\" owners=\\"3\\">      <encoding>        <key media-type=\\"application/x-java-object\\"/>        <value media-type=\\"application/x-java-object\\"/>      </encoding>      <expiration max-idle=\\"-1\\" lifespan=\\"-1\\" interval=\\"300000\\"/>     <memory max-count=\\"-1\\"/>    </distributed-cache>  </cache-container></infinispan>" > cache-ispn-jdbc-ping.xml && cp cache-ispn-jdbc-ping.xml /opt/keycloak/conf/cache-ispn-jdbc-ping.xml && /opt/keycloak/bin/kc.sh build && /opt/keycloak/bin/kc.sh start'.split(',');
      workingDirectory = '/opt/keycloak';
      environment = {
        KC_DB: 'mysql',
        KC_DB_URL_DATABASE: 'keycloak',
        KC_DB_URL_HOST: props.database.clusterEndpointHostname,
        KC_DB_URL_PORT: '3306',
        KC_DB_USERNAME: 'admin',
        KC_HOSTNAME: props.hostname!,
        KC_HOSTNAME_STRICT_BACKCHANNEL: 'true',
        KC_PROXY: 'edge',
        KC_CACHE_CONFIG_FILE: 'cache-ispn-jdbc-ping.xml',
      };
      secrets = {
        KC_DB_PASSWORD: ecs.Secret.fromSecretsManager(props.database.secret, 'password'),
        KEYCLOAK_ADMIN: ecs.Secret.fromSecretsManager(props.keycloakSecret, 'username'),
        KEYCLOAK_ADMIN_PASSWORD: ecs.Secret.fromSecretsManager(props.keycloakSecret, 'password'),
      };
      portMappings = [
        { containerPort: containerPort }, // web port
        { containerPort: 7800 }, // jgroups-tcp
        { containerPort: 57800 }, // jgroups-tcp-fd
      ];
    }

    const vpc = props.vpc;
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc, containerInsights: true });
    cluster.node.addDependency(props.database);
    const executionRole = new iam.Role(this, 'TaskRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('ecs.amazonaws.com'),
        new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      ),
    });
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: props.taskCpu ?? 4096,
      memoryLimitMiB: props.taskMemory ?? 8192,
      executionRole,
    });

    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const kc = taskDefinition.addContainer('keycloak', {
      image,
      entryPoint,
      workingDirectory,
      environment: Object.assign(environment, props.env),
      secrets,
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'keycloak',
        logGroup,
      }),
    });
    kc.addPortMappings(...portMappings);

    // we need extra privileges to fetch keycloak docker images from China mirror site
    taskDefinition.executionRole?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));

    this.service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
      circuitBreaker: props.circuitBreaker ? { rollback: true } : undefined,
      desiredCount: props.nodeCount ?? 2,
      healthCheckGracePeriod: cdk.Duration.seconds(120),
    });
    // we need to allow traffic from the same secret group for keycloak cluster with jdbc_ping
    if (isQuarkusDistribution) {
      this.service.connections.allowFrom(this.service.connections, ec2.Port.tcp(7800), 'kc jgroups-tcp');
      this.service.connections.allowFrom(this.service.connections, ec2.Port.tcp(57800), 'kc jgroups-tcp-fd');
    } else {
      this.service.connections.allowFrom(this.service.connections, ec2.Port.tcp(7600), 'kc jgroups-tcp');
      this.service.connections.allowFrom(this.service.connections, ec2.Port.tcp(57600), 'kc jgroups-tcp-fd');
      this.service.connections.allowFrom(this.service.connections, ec2.Port.udp(55200), 'kc jgroups-udp');
      this.service.connections.allowFrom(this.service.connections, ec2.Port.udp(54200), 'kc jgroups-udp-fd');
    }

    if (props.autoScaleTask) {
      const minCapacity = props.autoScaleTask.min ?? props.nodeCount ?? 2;
      const scaling = this.service.autoScaleTaskCount({
        minCapacity,
        maxCapacity: props.autoScaleTask.max ?? minCapacity + 5,
      });
      scaling.scaleOnCpuUtilization('CpuScaling', {
        targetUtilizationPercent: props.autoScaleTask.targetCpuUtilization ?? 75,
      });
    };

    this.applicationLoadBalancer = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      vpcSubnets: props.internetFacing ? props.publicSubnets : props.privateSubnets,
      internetFacing: props.internetFacing,
    });
    printOutput(this, 'EndpointURL', `https://${this.applicationLoadBalancer.loadBalancerDnsName}`);

    const listener = this.applicationLoadBalancer.addListener('HttpsListener', {
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [{ certificateArn: props.certificate.certificateArn }],
    });
    listener.addTargets('ECSTarget', {
      targets: [this.service],
      healthCheck: {
        healthyThresholdCount: 3,
      },
      // set slow_start.duration_seconds to 60
      // see https://docs.aws.amazon.com/cli/latest/reference/elbv2/modify-target-group-attributes.html
      slowStart: cdk.Duration.seconds(60),
      stickinessCookieDuration: props.stickinessCookieDuration ?? cdk.Duration.days(1),
      port: containerPort,
      protocol,
    });

    // allow task execution role to read the secrets
    props.database.secret.grantRead(taskDefinition.executionRole!);
    props.keycloakSecret.grantRead(taskDefinition.executionRole!);

    // allow ecs task connect to database
    props.database.connections.allowDefaultPortFrom(this.service);


    // create a bastion host
    if (props.bastion === true) {
      const bast = new ec2.BastionHostLinux(this, 'Bast', {
        vpc,
        instanceType: new ec2.InstanceType('m5.large'),
      });
      props.database.connections.allowDefaultPortFrom(bast);
    }
  }
  private getImageUriFromMap(map: dockerImageMap, version: string, id: string): string {
    const stack = cdk.Stack.of(this);
    if (cdk.Token.isUnresolved(stack.region)) {
      const mapping: { [k1: string]: { [k2: string]: any } } = {};
      for (let [partition, uri] of Object.entries(map)) {
        uri += version;
        mapping[partition] = { uri };
      }
      const imageMap = new cdk.CfnMapping(this, id, { mapping });
      return imageMap.findInMap(cdk.Aws.PARTITION, 'uri');
    } else {
      if (stack.region.startsWith('cn-')) {
        return map['aws-cn'] += version;
      } else {
        return map.aws += version;
      }
    }
  }
  private getKeyCloakDockerImageUri(version: string): string {
    return this.getImageUriFromMap(KEYCLOAK_DOCKER_IMAGE_URI_MAP, version, 'KeycloakImageMap');
  }
}

/**
 * Create or import VPC
 * @param scope the cdk scope
 */
function getOrCreateVpc(scope: Construct): ec2.IVpc {
  // use an existing vpc or create a new one
  return scope.node.tryGetContext('use_default_vpc') === '1' ?
    ec2.Vpc.fromLookup(scope, 'Vpc', { isDefault: true }) :
    scope.node.tryGetContext('use_vpc_id') ?
      ec2.Vpc.fromLookup(scope, 'Vpc', { vpcId: scope.node.tryGetContext('use_vpc_id') }) :
      new ec2.Vpc(scope, 'Vpc', { maxAzs: 3, natGateways: 1 });
}

function printOutput(scope: Construct, id: string, key: string | number) {
  new cdk.CfnOutput(scope, id, { value: String(key) });
}
