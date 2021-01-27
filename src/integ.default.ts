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

    const stack = new cdk.Stack(app, 'keycloak-demo2', { env });
    new KeyCloak(stack, 'KeyCloak', {
      certificateArn: stack.node.tryGetContext('ACM_CERT_ARN') || 'MOCK_ARN',
    });
    this.stack = [stack];
  }
}

new IntegTesting();

