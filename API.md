# API Reference

**Classes**

Name|Description
----|-----------
[ContainerService](#cdk-keycloak-containerservice)|*No description*
[Database](#cdk-keycloak-database)|Represents the database instance or database cluster.
[KeyCloak](#cdk-keycloak-keycloak)|*No description*


**Structs**

Name|Description
----|-----------
[AutoScaleTask](#cdk-keycloak-autoscaletask)|The ECS task autoscaling definition.
[ContainerServiceProps](#cdk-keycloak-containerserviceprops)|*No description*
[DatabaseCofig](#cdk-keycloak-databasecofig)|Database configuration.
[DatabaseProps](#cdk-keycloak-databaseprops)|*No description*
[KeyCloadProps](#cdk-keycloak-keycloadprops)|*No description*



## class ContainerService  <a id="cdk-keycloak-containerservice"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new ContainerService(scope: Construct, id: string, props: ContainerServiceProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[ContainerServiceProps](#cdk-keycloak-containerserviceprops)</code>)  *No description*
  * **certificate** (<code>[ICertificate](#aws-cdk-aws-certificatemanager-icertificate)</code>)  The ACM certificate. 
  * **database** (<code>[Database](#cdk-keycloak-database)</code>)  The RDS database for the service. 
  * **keycloakSecret** (<code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code>)  The secrets manager secret for the keycloak. 
  * **vpc** (<code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code>)  The VPC for the service. 
  * **autoScaleTask** (<code>[AutoScaleTask](#cdk-keycloak-autoscaletask)</code>)  Autoscaling for the ECS Service. __*Default*__: no ecs service autoscaling
  * **bastion** (<code>boolean</code>)  Whether to create the bastion host. __*Default*__: false
  * **circuitBreaker** (<code>boolean</code>)  Whether to enable the ECS service deployment circuit breaker. __*Default*__: false
  * **nodeCount** (<code>number</code>)  Number of keycloak node in the cluster. __*Default*__: 1
  * **privateSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC subnets for keycloak service. __*Optional*__
  * **publicSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC public subnets for ALB. __*Optional*__
  * **stickinessCookieDuration** (<code>[Duration](#aws-cdk-core-duration)</code>)  The sticky session duration for the keycloak workload with ALB. __*Default*__: one day



### Properties


Name | Type | Description 
-----|------|-------------
**service** | <code>[FargateService](#aws-cdk-aws-ecs-fargateservice)</code> | <span></span>



## class Database  <a id="cdk-keycloak-database"></a>

Represents the database instance or database cluster.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new Database(scope: Construct, id: string, props: DatabaseProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[DatabaseProps](#cdk-keycloak-databaseprops)</code>)  *No description*
  * **vpc** (<code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code>)  The VPC for the database. 
  * **auroraServerless** (<code>boolean</code>)  enable aurora serverless. __*Default*__: false
  * **clusterEngine** (<code>[IClusterEngine](#aws-cdk-aws-rds-iclusterengine)</code>)  The database cluster engine. __*Default*__: rds.AuroraMysqlEngineVersion.VER_2_09_1
  * **databaseSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC subnets for database. __*Optional*__
  * **instanceEngine** (<code>[IInstanceEngine](#aws-cdk-aws-rds-iinstanceengine)</code>)  The database instance engine. __*Default*__: MySQL 8.0.21
  * **instanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  The database instance type. __*Default*__: r5.large
  * **singleDbInstance** (<code>boolean</code>)  Whether to use single RDS instance rather than RDS cluster. __*Default*__: false



### Properties


Name | Type | Description 
-----|------|-------------
**clusterEndpointHostname** | <code>string</code> | <span></span>
**clusterIdentifier** | <code>string</code> | <span></span>
**connections** | <code>[Connections](#aws-cdk-aws-ec2-connections)</code> | <span></span>
**secret** | <code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code> | <span></span>
**vpc** | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | <span></span>



## class KeyCloak  <a id="cdk-keycloak-keycloak"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new KeyCloak(scope: Construct, id: string, props: KeyCloadProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[KeyCloadProps](#cdk-keycloak-keycloadprops)</code>)  *No description*
  * **certificateArn** (<code>string</code>)  ACM certificate ARN to import. 
  * **auroraServerless** (<code>boolean</code>)  Whether to use aurora serverless. __*Default*__: false
  * **autoScaleTask** (<code>[AutoScaleTask](#cdk-keycloak-autoscaletask)</code>)  Autoscaling for the ECS Service. __*Default*__: no ecs service autoscaling
  * **bastion** (<code>boolean</code>)  Create a bastion host for debugging or trouble-shooting. __*Default*__: false
  * **clusterEngine** (<code>[IClusterEngine](#aws-cdk-aws-rds-iclusterengine)</code>)  The database cluster engine. __*Default*__: rds.AuroraMysqlEngineVersion.VER_2_09_1
  * **databaseInstanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  Database instance type. __*Default*__: r5.large
  * **databaseSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC subnets for database. __*Default*__: VPC isolated subnets
  * **instanceEngine** (<code>[IInstanceEngine](#aws-cdk-aws-rds-iinstanceengine)</code>)  The database instance engine. __*Default*__: MySQL 8.0.21
  * **nodeCount** (<code>number</code>)  Number of keycloak node in the cluster. __*Default*__: 2
  * **privateSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC private subnets for keycloak service. __*Default*__: VPC private subnets
  * **publicSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC public subnets for ALB. __*Default*__: VPC public subnets
  * **singleDbInstance** (<code>boolean</code>)  Whether to use single RDS instance rather than RDS cluster. __*Default*__: false
  * **stickinessCookieDuration** (<code>[Duration](#aws-cdk-core-duration)</code>)  The sticky session duration for the keycloak workload with ALB. __*Default*__: one day
  * **vpc** (<code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code>)  VPC for the workload. __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**vpc** | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | <span></span>
**db**? | <code>[Database](#cdk-keycloak-database)</code> | __*Optional*__

### Methods


#### addDatabase(props) <a id="cdk-keycloak-keycloak-adddatabase"></a>



```ts
addDatabase(props: DatabaseProps): Database
```

* **props** (<code>[DatabaseProps](#cdk-keycloak-databaseprops)</code>)  *No description*
  * **vpc** (<code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code>)  The VPC for the database. 
  * **auroraServerless** (<code>boolean</code>)  enable aurora serverless. __*Default*__: false
  * **clusterEngine** (<code>[IClusterEngine](#aws-cdk-aws-rds-iclusterengine)</code>)  The database cluster engine. __*Default*__: rds.AuroraMysqlEngineVersion.VER_2_09_1
  * **databaseSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC subnets for database. __*Optional*__
  * **instanceEngine** (<code>[IInstanceEngine](#aws-cdk-aws-rds-iinstanceengine)</code>)  The database instance engine. __*Default*__: MySQL 8.0.21
  * **instanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  The database instance type. __*Default*__: r5.large
  * **singleDbInstance** (<code>boolean</code>)  Whether to use single RDS instance rather than RDS cluster. __*Default*__: false

__Returns__:
* <code>[Database](#cdk-keycloak-database)</code>

#### addKeyCloakContainerService(props) <a id="cdk-keycloak-keycloak-addkeycloakcontainerservice"></a>



```ts
addKeyCloakContainerService(props: ContainerServiceProps): ContainerService
```

* **props** (<code>[ContainerServiceProps](#cdk-keycloak-containerserviceprops)</code>)  *No description*
  * **certificate** (<code>[ICertificate](#aws-cdk-aws-certificatemanager-icertificate)</code>)  The ACM certificate. 
  * **database** (<code>[Database](#cdk-keycloak-database)</code>)  The RDS database for the service. 
  * **keycloakSecret** (<code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code>)  The secrets manager secret for the keycloak. 
  * **vpc** (<code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code>)  The VPC for the service. 
  * **autoScaleTask** (<code>[AutoScaleTask](#cdk-keycloak-autoscaletask)</code>)  Autoscaling for the ECS Service. __*Default*__: no ecs service autoscaling
  * **bastion** (<code>boolean</code>)  Whether to create the bastion host. __*Default*__: false
  * **circuitBreaker** (<code>boolean</code>)  Whether to enable the ECS service deployment circuit breaker. __*Default*__: false
  * **nodeCount** (<code>number</code>)  Number of keycloak node in the cluster. __*Default*__: 1
  * **privateSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC subnets for keycloak service. __*Optional*__
  * **publicSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC public subnets for ALB. __*Optional*__
  * **stickinessCookieDuration** (<code>[Duration](#aws-cdk-core-duration)</code>)  The sticky session duration for the keycloak workload with ALB. __*Default*__: one day

__Returns__:
* <code>[ContainerService](#cdk-keycloak-containerservice)</code>



## struct AutoScaleTask  <a id="cdk-keycloak-autoscaletask"></a>


The ECS task autoscaling definition.



Name | Type | Description 
-----|------|-------------
**max**? | <code>number</code> | The maximal count of the task number.<br/>__*Default*__: min + 5
**min**? | <code>number</code> | The minimal count of the task number.<br/>__*Default*__: nodeCount
**targetCpuUtilization**? | <code>number</code> | The target cpu utilization for the service autoscaling.<br/>__*Default*__: 75



## struct ContainerServiceProps  <a id="cdk-keycloak-containerserviceprops"></a>






Name | Type | Description 
-----|------|-------------
**certificate** | <code>[ICertificate](#aws-cdk-aws-certificatemanager-icertificate)</code> | The ACM certificate.
**database** | <code>[Database](#cdk-keycloak-database)</code> | The RDS database for the service.
**keycloakSecret** | <code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code> | The secrets manager secret for the keycloak.
**vpc** | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | The VPC for the service.
**autoScaleTask**? | <code>[AutoScaleTask](#cdk-keycloak-autoscaletask)</code> | Autoscaling for the ECS Service.<br/>__*Default*__: no ecs service autoscaling
**bastion**? | <code>boolean</code> | Whether to create the bastion host.<br/>__*Default*__: false
**circuitBreaker**? | <code>boolean</code> | Whether to enable the ECS service deployment circuit breaker.<br/>__*Default*__: false
**nodeCount**? | <code>number</code> | Number of keycloak node in the cluster.<br/>__*Default*__: 1
**privateSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC subnets for keycloak service.<br/>__*Optional*__
**publicSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC public subnets for ALB.<br/>__*Optional*__
**stickinessCookieDuration**? | <code>[Duration](#aws-cdk-core-duration)</code> | The sticky session duration for the keycloak workload with ALB.<br/>__*Default*__: one day



## struct DatabaseCofig  <a id="cdk-keycloak-databasecofig"></a>


Database configuration.



Name | Type | Description 
-----|------|-------------
**connections** | <code>[Connections](#aws-cdk-aws-ec2-connections)</code> | The database connnections.
**endpoint** | <code>string</code> | The endpoint address for the database.
**identifier** | <code>string</code> | The databasae identifier.
**secret** | <code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code> | The database secret.



## struct DatabaseProps  <a id="cdk-keycloak-databaseprops"></a>






Name | Type | Description 
-----|------|-------------
**vpc** | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | The VPC for the database.
**auroraServerless**? | <code>boolean</code> | enable aurora serverless.<br/>__*Default*__: false
**clusterEngine**? | <code>[IClusterEngine](#aws-cdk-aws-rds-iclusterengine)</code> | The database cluster engine.<br/>__*Default*__: rds.AuroraMysqlEngineVersion.VER_2_09_1
**databaseSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC subnets for database.<br/>__*Optional*__
**instanceEngine**? | <code>[IInstanceEngine](#aws-cdk-aws-rds-iinstanceengine)</code> | The database instance engine.<br/>__*Default*__: MySQL 8.0.21
**instanceType**? | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | The database instance type.<br/>__*Default*__: r5.large
**singleDbInstance**? | <code>boolean</code> | Whether to use single RDS instance rather than RDS cluster.<br/>__*Default*__: false



## struct KeyCloadProps  <a id="cdk-keycloak-keycloadprops"></a>






Name | Type | Description 
-----|------|-------------
**certificateArn** | <code>string</code> | ACM certificate ARN to import.
**auroraServerless**? | <code>boolean</code> | Whether to use aurora serverless.<br/>__*Default*__: false
**autoScaleTask**? | <code>[AutoScaleTask](#cdk-keycloak-autoscaletask)</code> | Autoscaling for the ECS Service.<br/>__*Default*__: no ecs service autoscaling
**bastion**? | <code>boolean</code> | Create a bastion host for debugging or trouble-shooting.<br/>__*Default*__: false
**clusterEngine**? | <code>[IClusterEngine](#aws-cdk-aws-rds-iclusterengine)</code> | The database cluster engine.<br/>__*Default*__: rds.AuroraMysqlEngineVersion.VER_2_09_1
**databaseInstanceType**? | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | Database instance type.<br/>__*Default*__: r5.large
**databaseSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC subnets for database.<br/>__*Default*__: VPC isolated subnets
**instanceEngine**? | <code>[IInstanceEngine](#aws-cdk-aws-rds-iinstanceengine)</code> | The database instance engine.<br/>__*Default*__: MySQL 8.0.21
**nodeCount**? | <code>number</code> | Number of keycloak node in the cluster.<br/>__*Default*__: 2
**privateSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC private subnets for keycloak service.<br/>__*Default*__: VPC private subnets
**publicSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC public subnets for ALB.<br/>__*Default*__: VPC public subnets
**singleDbInstance**? | <code>boolean</code> | Whether to use single RDS instance rather than RDS cluster.<br/>__*Default*__: false
**stickinessCookieDuration**? | <code>[Duration](#aws-cdk-core-duration)</code> | The sticky session duration for the keycloak workload with ALB.<br/>__*Default*__: one day
**vpc**? | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | VPC for the workload.<br/>__*Optional*__



