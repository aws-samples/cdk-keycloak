import { App, Stack } from '@aws-cdk/core';
import * as kc from '../src';
import '@aws-cdk/assert/jest';
test('create the default cluster', () => {

  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'testing-stack');

  // WHEN
  new kc.KeyCloak(stack, 'KeyCloak', {
    certificateArn: 'MOCK_ARN',
  });

  // THEN
  expect(stack).toHaveResource('AWS::RDS::DBCluster', {
    Engine: 'aurora-mysql',
    DBClusterParameterGroupName: 'default.aurora-mysql5.7',
    DBSubnetGroupName: {
      Ref: 'KeyCloakDatabaseDBClusterSubnetsE36F1B1B',
    },
    EngineVersion: '5.7.mysql_aurora.2.09.1',
    MasterUsername: 'admin',
    MasterUserPassword: {
      'Fn::Join': [
        '',
        [
          '{{resolve:secretsmanager:',
          {
            Ref: 'testingstackKeyCloakDatabaseDBClusterSecret754146743fdaad7efa858a3daf9490cf0a702aeb',
          },
          ':SecretString:password::}}',
        ],
      ],
    },
    VpcSecurityGroupIds: [
      {
        'Fn::GetAtt': [
          'KeyCloakDatabaseDBClusterSecurityGroup843B4392',
          'GroupId',
        ],
      },
    ],
  });
  // we should have 2 db instances in the cluster
  expect(stack).toCountResources('AWS::RDS::DBInstance', 2);
  // we should have 2 secrets
  expect(stack).toCountResources('AWS::SecretsManager::Secret', 2);
  // we should have ecs service
  expect(stack).toHaveResource('AWS::ECS::Service', {
    Cluster: {
      Ref: 'KeyCloakKeyCloakContainerSerivceClusterA18E44FF',
    },
    DeploymentConfiguration: {
      MaximumPercent: 200,
      MinimumHealthyPercent: 50,
    },
    DesiredCount: 2,
    EnableECSManagedTags: false,
    HealthCheckGracePeriodSeconds: 120,
    LaunchType: 'FARGATE',
    LoadBalancers: [
      {
        ContainerName: 'keycloak',
        ContainerPort: 8443,
        TargetGroupArn: {
          Ref: 'KeyCloakKeyCloakContainerSerivceALBHttpsListenerECSTargetGroupCE3EF52C',
        },
      },
    ],
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'DISABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'KeyCloakKeyCloakContainerSerivceServiceSecurityGroup4C80023D',
              'GroupId',
            ],
          },
        ],
        Subnets: [
          {
            Ref: 'KeyCloakVpcPrivateSubnet1SubnetA692DFFF',
          },
          {
            Ref: 'KeyCloakVpcPrivateSubnet2SubnetC8682D75',
          },
        ],
      },
    },
    TaskDefinition: {
      Ref: 'KeyCloakKeyCloakContainerSerivceTaskDef30C9533A',
    },
  });
});

test('with aurora serverless', () => {

  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'testing-stack');

  // WHEN
  new kc.KeyCloak(stack, 'KeyCloak', {
    certificateArn: 'MOCK_ARN',
    auroraServerless: true,
  });

  // THEN
  expect(stack).toHaveResource('AWS::RDS::DBCluster', {
    Engine: 'aurora-mysql',
    DBClusterParameterGroupName: 'default.aurora-mysql5.7',
    EngineMode: 'serverless',
  });
  // we should have 0 db instance in the cluster
  expect(stack).toCountResources('AWS::RDS::DBInstance', 0);
  // we should have 2 secrets
  expect(stack).toCountResources('AWS::SecretsManager::Secret', 2);
  // we should have ecs service
  expect(stack).toHaveResource('AWS::ECS::Service', {
    Cluster: {
      Ref: 'KeyCloakKeyCloakContainerSerivceClusterA18E44FF',
    },
    DeploymentConfiguration: {
      MaximumPercent: 200,
      MinimumHealthyPercent: 50,
    },
    DesiredCount: 2,
    EnableECSManagedTags: false,
    HealthCheckGracePeriodSeconds: 120,
    LaunchType: 'FARGATE',
    LoadBalancers: [
      {
        ContainerName: 'keycloak',
        ContainerPort: 8443,
        TargetGroupArn: {
          Ref: 'KeyCloakKeyCloakContainerSerivceALBHttpsListenerECSTargetGroupCE3EF52C',
        },
      },
    ],
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'DISABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'KeyCloakKeyCloakContainerSerivceServiceSecurityGroup4C80023D',
              'GroupId',
            ],
          },
        ],
        Subnets: [
          {
            Ref: 'KeyCloakVpcPrivateSubnet1SubnetA692DFFF',
          },
          {
            Ref: 'KeyCloakVpcPrivateSubnet2SubnetC8682D75',
          },
        ],
      },
    },
    TaskDefinition: {
      Ref: 'KeyCloakKeyCloakContainerSerivceTaskDef30C9533A',
    },
  });
});

test('with single rds instance', () => {

  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'testing-stack');

  // WHEN
  new kc.KeyCloak(stack, 'KeyCloak', {
    certificateArn: 'MOCK_ARN',
    singleDbInstance: true,
  });

  // THEN
  // we should have no cluster
  expect(stack).toCountResources('AWS::RDS::DBCluster', 0);
  // we should have 1 db instance in the cluster
  expect(stack).toCountResources('AWS::RDS::DBInstance', 1);
  expect(stack).toHaveResource('AWS::RDS::DBInstance', {
    DBInstanceClass: 'db.r5.large',
    AllocatedStorage: '100',
    CopyTagsToSnapshot: true,
    DBParameterGroupName: 'default.mysql8.0',
    DBSubnetGroupName: {
      Ref: 'KeyCloakDatabaseDBInstanceSubnetGroup71BF616F',
    },
    Engine: 'mysql',
    EngineVersion: '8.0.21',
    MasterUsername: 'admin',
    MasterUserPassword: {
      'Fn::Join': [
        '',
        [
          '{{resolve:secretsmanager:',
          {
            Ref: 'testingstackKeyCloakDatabaseDBInstanceSecretA1C7CB093fdaad7efa858a3daf9490cf0a702aeb',
          },
          ':SecretString:password::}}',
        ],
      ],
    },
    StorageType: 'gp2',
    VPCSecurityGroups: [
      {
        'Fn::GetAtt': [
          'KeyCloakDatabaseDBInstanceSecurityGroupC897947D',
          'GroupId',
        ],
      },
    ],
  });
  // we should have 2 secrets
  expect(stack).toCountResources('AWS::SecretsManager::Secret', 2);
  // we should have ecs service
  expect(stack).toHaveResource('AWS::ECS::Service', {
    Cluster: {
      Ref: 'KeyCloakKeyCloakContainerSerivceClusterA18E44FF',
    },
    DeploymentConfiguration: {
      MaximumPercent: 200,
      MinimumHealthyPercent: 50,
    },
    DesiredCount: 2,
    EnableECSManagedTags: false,
    HealthCheckGracePeriodSeconds: 120,
    LaunchType: 'FARGATE',
    LoadBalancers: [
      {
        ContainerName: 'keycloak',
        ContainerPort: 8443,
        TargetGroupArn: {
          Ref: 'KeyCloakKeyCloakContainerSerivceALBHttpsListenerECSTargetGroupCE3EF52C',
        },
      },
    ],
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'DISABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'KeyCloakKeyCloakContainerSerivceServiceSecurityGroup4C80023D',
              'GroupId',
            ],
          },
        ],
        Subnets: [
          {
            Ref: 'KeyCloakVpcPrivateSubnet1SubnetA692DFFF',
          },
          {
            Ref: 'KeyCloakVpcPrivateSubnet2SubnetC8682D75',
          },
        ],
      },
    },
    TaskDefinition: {
      Ref: 'KeyCloakKeyCloakContainerSerivceTaskDef30C9533A',
    },
  });
});
