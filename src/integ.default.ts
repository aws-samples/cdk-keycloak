import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { KeyCloak } from './index';

export class IntegTesting {
  readonly stack: cdk.Stack[];
  constructor() {
    const app = new cdk.App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new cdk.Stack(app, 'keycloak-demo', { env });

    // create a default keycloak workload with minimal required props
    new KeyCloak(stack, 'KeyCloak', {
      certificateArn: stack.node.tryGetContext('ACM_CERT_ARN') || 'MOCK_ARN',
    });

    this.stack = [stack];
  }
}


export class IntegTestingExistingVpcSubnets {
  readonly stack: cdk.Stack[];
  constructor() {
    const app = new cdk.App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new cdk.Stack(app, 'keycloak-demo', { env });

    new KeyCloak(stack, 'KeyCloak', {
      certificateArn: stack.node.tryGetContext('ACM_CERT_ARN') || 'MOCK_ARN',
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
    this.stack = [stack];
  }
}

new IntegTesting();

// new IntegTestingExistingVpcSubnets();

