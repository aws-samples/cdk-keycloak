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
  * **certificate** (<code>[ICertificate](#aws-cdk-aws-certificatemanager-icertificate)</code>)  *No description* 
  * **database** (<code>[Database](#cdk-keycloak-database)</code>)  *No description* 
  * **keycloakSecret** (<code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code>)  *No description* 
  * **vpc** (<code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code>)  *No description* 



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
  * **vpc** (<code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code>)  *No description* 
  * **databaseUsername** (<code>string</code>)  database user name. __*Default*__: admin
  * **engine** (<code>[IClusterEngine](#aws-cdk-aws-rds-iclusterengine)</code>)  *No description* __*Optional*__
  * **instanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  *No description* __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**clusterEndpointHostname** | <code>string</code> | <span></span>
**clusterIdentifier** | <code>string</code> | <span></span>
**clusterReadEndpointHostname** | <code>string</code> | <span></span>
**databaseUsername** | <code>string</code> | <span></span>
**dbcluster** | <code>[DatabaseCluster](#aws-cdk-aws-rds-databasecluster)</code> | <span></span>
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
  * **vpc** (<code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code>)  VPC for the workload. __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**vpc** | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | <span></span>
**db**? | <code>[Database](#cdk-keycloak-database)</code> | __*Optional*__

### Methods


#### addDatabase() <a id="cdk-keycloak-keycloak-adddatabase"></a>



```ts
addDatabase(): Database
```


__Returns__:
* <code>[Database](#cdk-keycloak-database)</code>

#### addKeyCloakContainerService(props) <a id="cdk-keycloak-keycloak-addkeycloakcontainerservice"></a>



```ts
addKeyCloakContainerService(props: ContainerServiceProps): ContainerService
```

* **props** (<code>[ContainerServiceProps](#cdk-keycloak-containerserviceprops)</code>)  *No description*
  * **certificate** (<code>[ICertificate](#aws-cdk-aws-certificatemanager-icertificate)</code>)  *No description* 
  * **database** (<code>[Database](#cdk-keycloak-database)</code>)  *No description* 
  * **keycloakSecret** (<code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code>)  *No description* 
  * **vpc** (<code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code>)  *No description* 

__Returns__:
* <code>[ContainerService](#cdk-keycloak-containerservice)</code>



## struct ContainerServiceProps  <a id="cdk-keycloak-containerserviceprops"></a>






Name | Type | Description 
-----|------|-------------
**certificate** | <code>[ICertificate](#aws-cdk-aws-certificatemanager-icertificate)</code> | <span></span>
**database** | <code>[Database](#cdk-keycloak-database)</code> | <span></span>
**keycloakSecret** | <code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code> | <span></span>
**vpc** | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | <span></span>



## struct DatabaseProps  <a id="cdk-keycloak-databaseprops"></a>






Name | Type | Description 
-----|------|-------------
**vpc** | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | <span></span>
**databaseUsername**? | <code>string</code> | database user name.<br/>__*Default*__: admin
**engine**? | <code>[IClusterEngine](#aws-cdk-aws-rds-iclusterengine)</code> | __*Optional*__
**instanceType**? | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | __*Optional*__



## struct KeyCloadProps  <a id="cdk-keycloak-keycloadprops"></a>






Name | Type | Description 
-----|------|-------------
**certificateArn** | <code>string</code> | ACM certificate ARN to import.
**vpc**? | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | VPC for the workload.<br/>__*Optional*__



