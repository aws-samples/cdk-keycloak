[![NPM version](https://badge.fury.io/js/cdk-keycloak.svg)](https://badge.fury.io/js/cdk-keycloak)
[![PyPI version](https://badge.fury.io/py/cdk-keycloak.svg)](https://badge.fury.io/py/cdk-keycloak)
[![release](https://github.com/aws-samples/cdk-keycloak/actions/workflows/release.yml/badge.svg)](https://github.com/aws-samples/cdk-keycloak/actions/workflows/release.yml)

# `cdk-keycloak`

CDK construct library that allows you to create [KeyCloak](https://www.keycloak.org/) on AWS in TypeScript or Python

> **Note**
> 
> This project has been migrated to CDK v2.
> 
> CDK v1 compatible version is deprecated now.

# Sample

For Keycloak 17+ versions, please specify hostname for the Keycloak server.

```ts
import { KeyCloak } from 'cdk-keycloak';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'keycloak-demo', { env });
new KeyCloak(stack, 'KeyCloak', {
  hostname: 'keycloak.example.com',
  certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/293cf875-ca98-4c2e-a797-e1cf6df2553c',
  keycloakVersion: KeycloakVersion.V22_0_4,
});
```

# Keycloak version pinning

Use `keycloakVersion` to specify the version.

```ts
new KeyCloak(stack, 'KeyCloak', {
  hostname,
  certificateArn,
  keycloakVersion: KeycloakVersion.V22_0_4,
});
```

To specify any other verion not defined in the construct, use `KeycloakVersion.of('x.x.x')`. This allows you to specify any new version as soon as it's available. However, as new versions will not always be tested and validated with this construct library, make sure you fully backup and test before you use any new version in the production environment.


# Aurora Serverless support

The `KeyCloak` construct provisions the **Amaozn RDS cluster for MySQL** with **2** database instances under the hood, to opt in **Amazon Aurora Serverless**, use `auroraServerless` to opt in Amazon Aurora Serverless cluster. Please note only some regions are supported, check [Supported features in Amazon Aurora by AWS Region and Aurora DB engine](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraFeaturesRegionsDBEngines.grids.html) for availability.

```ts
// Aurora Serverless v1
new KeyCloak(stack, 'KeyCloak', {
  hostname,
  certificateArn,
  keycloakVersion,
  auroraServerless: true,
});

// Aurora Serverless v2
new KeyCloak(stack, 'KeyCloak', {
  hostname,
  certificateArn,
  keycloakVersion,
  auroraServerlessV2: true,
});
```

Behind the scene, a default RDS cluster for MySQL with 2 database instances will be created.

# Opt-in for Single RDS instance

To create single RDS instance for your testing or development environment, use `singleDbInstance` to turn on the
single db instance deployment.

Plesae note this is not recommended for production environment.

```ts
new KeyCloak(stack, 'KeyCloak', {
  hostname,
  certificateArn,
  keycloakVersion,
  singleDbInstance: true,
});

```

# Service Auto Scaling

Define `autoScaleTask` for the ecs service task autoscaling. For example:

```ts
new KeyCloak(stack, 'KeyCloak', {
  hostname,
  certificateArn,
  keycloakVersion,
  auroraServerlessV2: true,
  nodeCount: 2,
  autoScaleTask: {
    min: 2,
    max: 10,
    targetCpuUtilization: 60,
  },
});

```


# Customize fargate task settings

Define `taskCpu` or `taskMemory` for overriding the defaults for the ecs service task. 
Could be useful for development environments. For example:

```ts
new KeyCloak(stack, 'KeyCloak', {
  hostname,
  certificateArn,
  keycloakVersion,
  nodeCount: 1, 
  taskCpu: 512,
  taskMemory: 2048,
});

```

# Deploy in existing Vpc Subnets

You can deploy the workload in the existing Vpc and subnets. The `publicSubnets` are for the ALB, `privateSubnets` for the keycloak container tasks and `databaseSubnets` for the database.

The best practice is to specify isolated subnets for `databaseSubnets`, however, in some cases might have no existing isolates subnets then the private subnets are also acceptable.

Consider the sample below:

```ts
new KeyCloak(stack, 'KeyCloak', {
  hostname: 'keycloak.example.com',
  keycloakVersion: KeycloakVersion.V22_0_4,
  certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/293cf875-ca98-4c2e-a797-e1cf6df2553c',
  vpc: ec2.Vpc.fromLookup(stack, 'Vpc', { vpcId: 'vpc-0417e46d' }),
  publicSubnets: {
    subnets: [
      ec2.Subnet.fromSubnetId(stack, 'pub-1a', 'subnet-5bbe7b32'),
      ec2.Subnet.fromSubnetId(stack, 'pub-1b', 'subnet-0428367c'),
      ec2.Subnet.fromSubnetId(stack, 'pub-1c', 'subnet-1586a75f'),
    ],
  },
  privateSubnets: {
    subnets: [
      ec2.Subnet.fromSubnetId(stack, 'priv-1a', 'subnet-0e9460dbcfc4cf6ee'),
      ec2.Subnet.fromSubnetId(stack, 'priv-1b', 'subnet-0562f666bdf5c29af'),
      ec2.Subnet.fromSubnetId(stack, 'priv-1c', 'subnet-00ab15c0022872f06'),
    ],
  },
  databaseSubnets: {
    subnets: [
      ec2.Subnet.fromSubnetId(stack, 'db-1a', 'subnet-0e9460dbcfc4cf6ee'),
      ec2.Subnet.fromSubnetId(stack, 'db-1b', 'subnet-0562f666bdf5c29af'),
      ec2.Subnet.fromSubnetId(stack, 'db-1c', 'subnet-00ab15c0022872f06'),
    ],
  },
});
```

# AWS China Regions

This library support AWS China regions `cn-north-1` and `cn-northwest-1` and will auto select local docker image mirror to accelerate the image pulling. You don't have to do anything.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
