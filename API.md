# API Reference

**Classes**

Name|Description
----|-----------
[ContainerService](#cdk-keycloak-containerservice)|*No description*
[Database](#cdk-keycloak-database)|*No description*
[KeyCloak](#cdk-keycloak-keycloak)|*No description*


**Structs**

Name|Description
----|-----------
[ContainerServiceProps](#cdk-keycloak-containerserviceprops)|*No description*
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
  * **bastion** (<code>boolean</code>)  Whether to create the bastion host. __*Default*__: false
  * **circuitBreaker** (<code>boolean</code>)  Whether to enable the ECS service deployment circuit breaker. __*Default*__: false
  * **nodeCount** (<code>number</code>)  Number of keycloak node in the cluster. __*Default*__: 1
  * **privateSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC subnets for keycloak service. __*Optional*__
  * **publicSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC public subnets for ALB. __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**service** | <code>[FargateService](#aws-cdk-aws-ecs-fargateservice)</code> | <span></span>



## class Database  <a id="cdk-keycloak-database"></a>



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
  * **databaseSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC subnets for database. __*Optional*__
  * **engine** (<code>[IInstanceEngine](#aws-cdk-aws-rds-iinstanceengine)</code>)  The database instance engine. __*Default*__: MySQL 8.0.21
  * **instanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  The database instance type. __*Default*__: r5.large



### Properties


Name | Type | Description 
-----|------|-------------
**clusterEndpointHostname** | <code>string</code> | <span></span>
**clusterIdentifier** | <code>string</code> | <span></span>
**dbinstance** | <code>[DatabaseInstance](#aws-cdk-aws-rds-databaseinstance)</code> | <span></span>
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
  * **bastion** (<code>boolean</code>)  Create a bastion host for debugging or trouble-shooting. __*Default*__: false
  * **databaseInstanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  Database instance type. __*Default*__: r5.large
  * **databaseSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC subnets for database. __*Default*__: VPC isolated subnets
  * **engine** (<code>[IInstanceEngine](#aws-cdk-aws-rds-iinstanceengine)</code>)  The database instance engine. __*Default*__: MySQL 8.0.21
  * **nodeCount** (<code>number</code>)  Number of keycloak node in the cluster. __*Default*__: 2
  * **privateSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC private subnets for keycloak service. __*Default*__: VPC private subnets
  * **publicSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC public subnets for ALB. __*Default*__: VPC public subnets
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
  * **databaseSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC subnets for database. __*Optional*__
  * **engine** (<code>[IInstanceEngine](#aws-cdk-aws-rds-iinstanceengine)</code>)  The database instance engine. __*Default*__: MySQL 8.0.21
  * **instanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  The database instance type. __*Default*__: r5.large

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
  * **bastion** (<code>boolean</code>)  Whether to create the bastion host. __*Default*__: false
  * **circuitBreaker** (<code>boolean</code>)  Whether to enable the ECS service deployment circuit breaker. __*Default*__: false
  * **nodeCount** (<code>number</code>)  Number of keycloak node in the cluster. __*Default*__: 1
  * **privateSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC subnets for keycloak service. __*Optional*__
  * **publicSubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  VPC public subnets for ALB. __*Optional*__

__Returns__:
* <code>[ContainerService](#cdk-keycloak-containerservice)</code>



## struct ContainerServiceProps  <a id="cdk-keycloak-containerserviceprops"></a>






Name | Type | Description 
-----|------|-------------
**certificate** | <code>[ICertificate](#aws-cdk-aws-certificatemanager-icertificate)</code> | The ACM certificate.
**database** | <code>[Database](#cdk-keycloak-database)</code> | The RDS database for the service.
**keycloakSecret** | <code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code> | The secrets manager secret for the keycloak.
**vpc** | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | The VPC for the service.
**bastion**? | <code>boolean</code> | Whether to create the bastion host.<br/>__*Default*__: false
**circuitBreaker**? | <code>boolean</code> | Whether to enable the ECS service deployment circuit breaker.<br/>__*Default*__: false
**nodeCount**? | <code>number</code> | Number of keycloak node in the cluster.<br/>__*Default*__: 1
**privateSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC subnets for keycloak service.<br/>__*Optional*__
**publicSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC public subnets for ALB.<br/>__*Optional*__



## struct DatabaseProps  <a id="cdk-keycloak-databaseprops"></a>






Name | Type | Description 
-----|------|-------------
**vpc** | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | The VPC for the database.
**databaseSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC subnets for database.<br/>__*Optional*__
**engine**? | <code>[IInstanceEngine](#aws-cdk-aws-rds-iinstanceengine)</code> | The database instance engine.<br/>__*Default*__: MySQL 8.0.21
**instanceType**? | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | The database instance type.<br/>__*Default*__: r5.large



## struct KeyCloadProps  <a id="cdk-keycloak-keycloadprops"></a>






Name | Type | Description 
-----|------|-------------
**certificateArn** | <code>string</code> | ACM certificate ARN to import.
**bastion**? | <code>boolean</code> | Create a bastion host for debugging or trouble-shooting.<br/>__*Default*__: false
**databaseInstanceType**? | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | Database instance type.<br/>__*Default*__: r5.large
**databaseSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC subnets for database.<br/>__*Default*__: VPC isolated subnets
**engine**? | <code>[IInstanceEngine](#aws-cdk-aws-rds-iinstanceengine)</code> | The database instance engine.<br/>__*Default*__: MySQL 8.0.21
**nodeCount**? | <code>number</code> | Number of keycloak node in the cluster.<br/>__*Default*__: 2
**privateSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC private subnets for keycloak service.<br/>__*Default*__: VPC private subnets
**publicSubnets**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | VPC public subnets for ALB.<br/>__*Default*__: VPC public subnets
**vpc**? | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | VPC for the workload.<br/>__*Optional*__



