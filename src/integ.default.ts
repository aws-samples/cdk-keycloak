import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';

import { KeyCloak } from './index';

export class IntegTesting {
  readonly stack: cdk.Stack[];
  constructor() {
    const app = new cdk.App();

    const env = {
      region: 'ap-east-1',
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stackvpc = new cdk.Stack(app, 'vpc-stack', { env });

    new ec2.Vpc(stackvpc, 'MyVPC', {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'application',
          subnetType: ec2.SubnetType.PRIVATE,
        },
        {
          cidrMask: 28,
          name: 'rds',
          subnetType: ec2.SubnetType.ISOLATED,
        },
      ],
    });

    const stack = new cdk.Stack(app, 'keycloak-demo', { env });

    const kcbAsset = new DockerImageAsset(stack, 'KeycloakBenchmarkImage', {
      directory: path.join(__dirname, 'docker'),
    });

    // create a default keycloak workload with minimal required props
    new KeyCloak(stack, 'KeyCloak', {
      certificateArn: '*****',
      auroraServerless: false,
      nodeCount: 1,
      autoScaleTask: {
        min: 1,
        max: 1,
        targetCpuUtilization: 50,
      },
      vpc: ec2.Vpc.fromLookup(stack, 'Vpc', { vpcId: 'vpc-0b453730c7b902e87' }),
      image: ecs.ContainerImage.fromDockerImageAsset(kcbAsset),
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

