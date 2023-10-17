import { App, assertions, Stack } from 'aws-cdk-lib';
import * as kc from '../src';
// import '@aws-cdk/assert/jest';
import { KeycloakVersion } from '../src';
test('create the default cluster', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'testing-stack');

  // WHEN
  new kc.KeyCloak(stack, 'KeyCloak', {
    certificateArn: 'MOCK_ARN',
    keycloakVersion: KeycloakVersion.V22_0_4,
  });

  // THEN
  const t = assertions.Template.fromStack(stack);
  t.hasResourceProperties('AWS::RDS::DBCluster', {
    Engine: 'aurora-mysql',
    DBClusterParameterGroupName: 'default.aurora-mysql8.0',
    DBSubnetGroupName: {
      Ref: 'KeyCloakDatabaseDBClusterSubnetsE36F1B1B',
    },
    EngineVersion: '8.0.mysql_aurora.3.04.0',
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
        'Fn::GetAtt': ['KeyCloakDatabaseDBClusterSecurityGroup843B4392', 'GroupId'],
      },
    ],
  });
  // we should have 2 db instances in the cluster
  t.resourceCountIs('AWS::RDS::DBInstance', 2);
  // we should have 2 secrets
  t.resourceCountIs('AWS::SecretsManager::Secret', 2);
  // we should have ecs service
  t.hasResourceProperties('AWS::ECS::Service', {
    Cluster: {
      Ref: 'KeyCloakKeyCloakContainerServiceCluster4583BCAE',
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
        ContainerPort: 8080,
        TargetGroupArn: {
          Ref: 'KeyCloakKeyCloakContainerServiceALBHttpsListenerECSTargetGroup65B43774',
        },
      },
    ],
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'DISABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'KeyCloakKeyCloakContainerServiceSecurityGroup7433DA3A',
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
      Ref: 'KeyCloakKeyCloakContainerServiceTaskDef6AD61714',
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
    keycloakVersion: KeycloakVersion.V22_0_4,
  });

  // THEN
  const t = assertions.Template.fromStack(stack);
  t.hasResourceProperties('AWS::RDS::DBCluster', {
    Engine: 'aurora-mysql',
    DBClusterParameterGroupName: 'default.aurora-mysql5.7',
    EngineMode: 'serverless',
  });
  // we should have 0 db instance in the cluster
  t.resourceCountIs('AWS::RDS::DBInstance', 0);
  // we should have 2 secrets
  t.resourceCountIs('AWS::SecretsManager::Secret', 2);
  // we should have ecs service
  t.hasResourceProperties('AWS::ECS::Service', {
    Cluster: {
      Ref: 'KeyCloakKeyCloakContainerServiceCluster4583BCAE',
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
        ContainerPort: 8080,
        TargetGroupArn: {
          Ref: 'KeyCloakKeyCloakContainerServiceALBHttpsListenerECSTargetGroup65B43774',
        },
      },
    ],
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'DISABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'KeyCloakKeyCloakContainerServiceSecurityGroup7433DA3A',
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
      Ref: 'KeyCloakKeyCloakContainerServiceTaskDef6AD61714',
    },
  });
});

test('with aurora serverless v2', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'testing-stack');

  // WHEN
  new kc.KeyCloak(stack, 'KeyCloak', {
    certificateArn: 'MOCK_ARN',
    auroraServerlessV2: true,
    keycloakVersion: KeycloakVersion.V22_0_4,
  });

  // THEN
  const t = assertions.Template.fromStack(stack);
  t.hasResourceProperties('AWS::RDS::DBCluster', {
    Engine: 'aurora-mysql',
    DBClusterParameterGroupName: 'default.aurora-mysql8.0',
    DBSubnetGroupName: {
      Ref: 'KeyCloakDatabaseDBClusterSubnetsE36F1B1B',
    },
    EngineVersion: '8.0.mysql_aurora.3.04.0',
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
    ServerlessV2ScalingConfiguration: {
      MaxCapacity: 10,
      MinCapacity: 0.5,
    },
    VpcSecurityGroupIds: [
      {
        'Fn::GetAtt': ['KeyCloakDatabaseDBClusterSecurityGroup843B4392', 'GroupId'],
      },
    ],
  });
  // we should have 2 db instances in the cluster
  t.resourceCountIs('AWS::RDS::DBInstance', 2);
  // we should have db instance with db.serverless instance class
  t.hasResourceProperties('AWS::RDS::DBInstance', {
    DBInstanceClass: 'db.serverless',
  });
  // we should have 2 secrets
  t.resourceCountIs('AWS::SecretsManager::Secret', 2);
  // we should have ecs service
  t.hasResourceProperties('AWS::ECS::Service', {
    Cluster: {
      Ref: 'KeyCloakKeyCloakContainerServiceCluster4583BCAE',
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
        ContainerPort: 8080,
        TargetGroupArn: {
          Ref: 'KeyCloakKeyCloakContainerServiceALBHttpsListenerECSTargetGroup65B43774',
        },
      },
    ],
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'DISABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'KeyCloakKeyCloakContainerServiceSecurityGroup7433DA3A',
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
      Ref: 'KeyCloakKeyCloakContainerServiceTaskDef6AD61714',
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
    keycloakVersion: KeycloakVersion.V22_0_4,
  });

  // THEN
  const t = assertions.Template.fromStack(stack);
  // we should have no cluster
  t.resourceCountIs('AWS::RDS::DBCluster', 0);
  // we should have 1 db instance in the cluster
  t.resourceCountIs('AWS::RDS::DBInstance', 1);
  t.hasResourceProperties('AWS::RDS::DBInstance', {
    DBInstanceClass: 'db.r5.large',
    AllocatedStorage: '100',
    CopyTagsToSnapshot: true,
    DBParameterGroupName: 'default.mysql8.0',
    DBSubnetGroupName: {
      Ref: 'KeyCloakDatabaseDBInstanceSubnetGroup71BF616F',
    },
    Engine: 'mysql',
    EngineVersion: '8.0.34',
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
        'Fn::GetAtt': ['KeyCloakDatabaseDBInstanceSecurityGroupC897947D', 'GroupId'],
      },
    ],
  });
  // we should have 2 secrets
  t.resourceCountIs('AWS::SecretsManager::Secret', 2);
  // we should have ecs service
  t.hasResourceProperties('AWS::ECS::Service', {
    Cluster: {
      Ref: 'KeyCloakKeyCloakContainerServiceCluster4583BCAE',
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
        ContainerPort: 8080,
        TargetGroupArn: {
          Ref: 'KeyCloakKeyCloakContainerServiceALBHttpsListenerECSTargetGroup65B43774',
        },
      },
    ],
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'DISABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'KeyCloakKeyCloakContainerServiceSecurityGroup7433DA3A',
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
      Ref: 'KeyCloakKeyCloakContainerServiceTaskDef6AD61714',
    },
  });
});

test('with env', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'testing-stack');

  // WHEN
  new kc.KeyCloak(stack, 'KeyCloak', {
    keycloakVersion: KeycloakVersion.V22_0_4,
    certificateArn: 'MOCK_ARN',
    env: {
      JAVA_OPTS: '-DHelloWorld',
    },
    hostname: 'keycloak.test',
  });

  // THEN
  const t = assertions.Template.fromStack(stack);
  t.hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      {
        Environment: [
          {
            Name: 'KC_DB',
            Value: 'mysql',
          },
          {
            Name: 'KC_DB_URL_DATABASE',
            Value: 'keycloak',
          },
          {
            Name: 'KC_DB_URL_HOST',
            Value: {
              'Fn::GetAtt': ['KeyCloakDatabaseDBCluster06E9C0E1', 'Endpoint.Address'],
            },
          },
          {
            Name: 'KC_DB_URL_PORT',
            Value: '3306',
          },
          {
            Name: 'KC_DB_USERNAME',
            Value: 'admin',
          },
          {
            Name: 'KC_HOSTNAME',
            Value: 'keycloak.test',
          },
          {
            Name: 'KC_HOSTNAME_STRICT_BACKCHANNEL',
            Value: 'true',
          },
          {
            Name: 'KC_PROXY',
            Value: 'edge',
          },
          {
            Name: 'KC_CACHE_CONFIG_FILE',
            Value: 'cache-ispn-jdbc-ping.xml',
          },
          {
            Name: 'JAVA_OPTS',
            Value: '-DHelloWorld',
          },
        ],
        Essential: true,
        Image: {
          'Fn::FindInMap': [
            'KeyCloakKeyCloakContainerServiceKeycloakImageMapE15D4544',
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
              Ref: 'KeyCloakKeyCloakContainerServiceLogGroup770A4A22',
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
            ContainerPort: 8080,
            Protocol: 'tcp',
          },
          {
            ContainerPort: 7800,
            Protocol: 'tcp',
          },
          {
            ContainerPort: 57800,
            Protocol: 'tcp',
          },
        ],
        Secrets: [
          {
            Name: 'KC_DB_PASSWORD',
            ValueFrom: {
              'Fn::Join': [
                '',
                [
                  {
                    Ref: 'KeyCloakDatabaseDBClusterSecretAttachment50401C92',
                  },
                  ':password::',
                ],
              ],
            },
          },
          {
            Name: 'KEYCLOAK_ADMIN',
            ValueFrom: {
              'Fn::Join': [
                '',
                [
                  {
                    Ref: 'KeyCloakKCSecretF8498E5C',
                  },
                  ':username::',
                ],
              ],
            },
          },
          {
            Name: 'KEYCLOAK_ADMIN_PASSWORD',
            ValueFrom: {
              'Fn::Join': [
                '',
                [
                  {
                    Ref: 'KeyCloakKCSecretF8498E5C',
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
      'Fn::GetAtt': ['KeyCloakKeyCloakContainerServiceTaskRoleE227375A', 'Arn'],
    },
    Family: 'testingstackKeyCloakKeyCloakContainerServiceTaskDef1B636EF3',
    Memory: '8192',
    NetworkMode: 'awsvpc',
    RequiresCompatibilities: ['FARGATE'],
    TaskRoleArn: {
      'Fn::GetAtt': ['KeyCloakKeyCloakContainerServiceTaskDefTaskRole509DDBD7', 'Arn'],
    },
  });
});


test('with customized task settings', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'testing-stack');

  // WHEN
  new kc.KeyCloak(stack, 'KeyCloak', {
    keycloakVersion: KeycloakVersion.V22_0_4,
    certificateArn: 'MOCK_ARN',
    hostname: 'keycloak.test',
    taskCpu: 512,
    taskMemory: 1024,
  });

  // THEN
  const t = assertions.Template.fromStack(stack);
  t.hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      {
        Name: 'keycloak',
      },
    ],
    Cpu: '512',
    Memory: '1024',
  });
});
