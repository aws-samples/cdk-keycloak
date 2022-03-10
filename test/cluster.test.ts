import { stringLike } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';
import '@aws-cdk/assert/jest';

import * as kc from '../src';
import { KeycloakVersion } from '../src';

test('create the default cluster', () => {

  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'testing-stack');

  // WHEN
  new kc.KeyCloak(stack, 'KeyCloak', {
    certificateArn: 'MOCK_ARN',
    keycloakVersion: KeycloakVersion.V15_0_2,
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
          stringLike('KeyCloakDatabaseDBClusterSecurityGroup*'),
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
      Ref: stringLike('KeyCloakKeyCloakContainerServiceCluster*'),
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
          Ref: stringLike('KeyCloakKeyCloakContainerServiceALBHttpsListenerECSTargetGroup*'),
        },
      },
    ],
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'DISABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              stringLike('KeyCloakKeyCloakContainerServiceSecurityGroup*'),
              'GroupId',
            ],
          },
        ],
        Subnets: [
          {
            Ref: stringLike('KeyCloakVpcPrivateSubnet1Subnet*'),
          },
          {
            Ref: stringLike('KeyCloakVpcPrivateSubnet2Subnet*'),
          },
        ],
      },
    },
    TaskDefinition: {
      Ref: stringLike('KeyCloakKeyCloakContainerServiceTaskDef*'),
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
    keycloakVersion: KeycloakVersion.V15_0_2,
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
      Ref: stringLike('KeyCloakKeyCloakContainerServiceCluster*'),
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
          Ref: stringLike('KeyCloakKeyCloakContainerServiceALBHttpsListenerECSTargetGroup*'),
        },
      },
    ],
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'DISABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              stringLike('KeyCloakKeyCloakContainerServiceSecurityGroup*'),
              'GroupId',
            ],
          },
        ],
        Subnets: [
          {
            Ref: stringLike('KeyCloakVpcPrivateSubnet1Subnet*'),
          },
          {
            Ref: stringLike('KeyCloakVpcPrivateSubnet2Subnet*'),
          },
        ],
      },
    },
    TaskDefinition: {
      Ref: stringLike('KeyCloakKeyCloakContainerServiceTaskDef*'),
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
    keycloakVersion: KeycloakVersion.V15_0_2,
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
      Ref: stringLike('KeyCloakDatabaseDBInstanceSubnetGroup*'),
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
          stringLike('KeyCloakDatabaseDBInstanceSecurityGroup*'),
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
      Ref: stringLike('KeyCloakKeyCloakContainerServiceCluster*'),
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
          Ref: stringLike('KeyCloakKeyCloakContainerServiceALBHttpsListenerECSTargetGroup*'),
        },
      },
    ],
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'DISABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              stringLike('KeyCloakKeyCloakContainerServiceSecurityGroup*'),
              'GroupId',
            ],
          },
        ],
        Subnets: [
          {
            Ref: stringLike('KeyCloakVpcPrivateSubnet1Subnet*'),
          },
          {
            Ref: stringLike('KeyCloakVpcPrivateSubnet2Subnet*'),
          },
        ],
      },
    },
    TaskDefinition: {
      Ref: stringLike('KeyCloakKeyCloakContainerServiceTaskDef*'),
    },
  });
});

test('with env', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'testing-stack');

  // WHEN
  new kc.KeyCloak(stack, 'KeyCloak', {
    keycloakVersion: KeycloakVersion.V15_0_2,
    certificateArn: 'MOCK_ARN',
    env: {
      JAVA_OPTS: '-DHelloWorld',
    },
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {

    ContainerDefinitions: [
      {
        Environment: [
          {
            Name: 'DB_ADDR',
            Value: {
              'Fn::GetAtt': [
                stringLike('KeyCloakDatabaseDBCluster*'),
                'Endpoint.Address',
              ],
            },
          },
          {
            Name: 'DB_DATABASE',
            Value: 'keycloak',
          },
          {
            Name: 'DB_PORT',
            Value: '3306',
          },
          {
            Name: 'DB_USER',
            Value: 'admin',
          },
          {
            Name: 'DB_VENDOR',
            Value: 'mysql',
          },
          {
            Name: 'JDBC_PARAMS',
            Value: 'useSSL=false',
          },
          {
            Name: 'JGROUPS_DISCOVERY_PROTOCOL',
            Value: 'JDBC_PING',
          },
          {
            Name: 'JAVA_OPTS',
            Value: '-DHelloWorld',
          },
        ],
        Essential: true,
        Image: {
          'Fn::FindInMap': [
            stringLike('KeyCloakKeyCloakContainerServiceKeycloakImageMap*'),
            {
              Ref: 'AWS::Partition',
            },
            'uri',
          ],
        },
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': {
              Ref: stringLike('KeyCloakKeyCloakContainerServiceLogGroup*'),
            },
            'awslogs-stream-prefix': 'keycloak',
            'awslogs-region': {
              Ref: 'AWS::Region',
            },
          },
        },
        Name: 'keycloak',
        PortMappings: [
          {
            ContainerPort: 8443,
            Protocol: 'tcp',
          },
          {
            ContainerPort: 7600,
            Protocol: 'tcp',
          },
          {
            ContainerPort: 57600,
            Protocol: 'tcp',
          },
          {
            ContainerPort: 55200,
            Protocol: 'udp',
          },
          {
            ContainerPort: 54200,
            Protocol: 'udp',
          },
        ],
        Secrets: [
          {
            Name: 'DB_PASSWORD',
            ValueFrom: {
              'Fn::Join': [
                '',
                [
                  {
                    Ref: stringLike('KeyCloakDatabaseDBClusterSecretAttachment*'),
                  },
                  ':password::',
                ],
              ],
            },
          },
          {
            Name: 'KEYCLOAK_USER',
            ValueFrom: {
              'Fn::Join': [
                '',
                [
                  {
                    Ref: stringLike('KeyCloakKCSecret*'),
                  },
                  ':username::',
                ],
              ],
            },
          },
          {
            Name: 'KEYCLOAK_PASSWORD',
            ValueFrom: {
              'Fn::Join': [
                '',
                [
                  {
                    Ref: stringLike('KeyCloakKCSecret*'),
                  },
                  ':password::',
                ],
              ],
            },
          },
        ],
      },
    ],
    Cpu: '4096',
    ExecutionRoleArn: {
      'Fn::GetAtt': [
        stringLike('KeyCloakKeyCloakContainerServiceTaskRole*'),
        'Arn',
      ],
    },
    Family: stringLike('testingstackKeyCloakKeyCloakContainerServiceTaskDef*'),
    Memory: '30720',
    NetworkMode: 'awsvpc',
    RequiresCompatibilities: [
      'FARGATE',
    ],
    TaskRoleArn: {
      'Fn::GetAtt': [
        stringLike('KeyCloakKeyCloakContainerServiceTaskDefTaskRole*'),
        'Arn',
      ],
    },
  });
});
