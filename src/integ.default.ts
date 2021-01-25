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
    new KeyCloak(stack, 'KeyCloak');
    this.stack = [stack];
  }
}

new IntegTesting();

