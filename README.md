[![NPM version](https://badge.fury.io/js/cdk-keycloak.svg)](https://badge.fury.io/js/cdk-keycloak)
[![PyPI version](https://badge.fury.io/py/cdk-keycloak.svg)](https://badge.fury.io/py/cdk-keycloak)
![Release](https://github.com/pahud/cdk-keycloak/workflows/Release/badge.svg?branch=main)

# `cdk-keycloak`

CDK construct library that allows you to create KeyCloak service on AWS in TypeScript or Python

# Sample

```ts
import { KeyCloak } from 'cdk-keycloak';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'keycloak-demo', { env });
new KeyCloak(stack, 'KeyCloak', {
  certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/293cf875-ca98-4c2e-a797-e1cf6df2553c',
});
```


# Deploy in existing Vpc Subnets

You can deploy the workload in the existing Vpc and subnets. The `publicSubnets` are for the ALB, `privateSubnets` for the keycloak container tasks and `databaseSubnets` for the database.

The best practice is to specify isolated subnets for `databaseSubnets`, however, in some cases might have no existing isolates subnets then the private subnets are also acceptable.

Consider the sample below:

```ts
new KeyCloak(stack, 'KeyCloak', {
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
