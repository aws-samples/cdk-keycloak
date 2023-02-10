import { App, Stack, assertions } from 'aws-cdk-lib';
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
    keycloakVersion: KeycloakVersion.V15_0_2,
  });

  // THEN
  const t = assertions.Template.fromStack(stack);
  t.hasResourceProperties('AWS::RDS::DBCluster', {
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
  t.resourceCountIs('AWS::RDS::DBInstance', 2);
  // we should have 2 secrets
  t.resourceCountIs('AWS::SecretsManager::Secret', 2);
  // we should have ecs service
  t.hasResourceProperties('AWS::ECS::Service', {
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
    keycloakVersion: KeycloakVersion.V15_0_2,
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

test('with aurora serverless v2', () => {

  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'testing-stack');

  // WHEN
  new kc.KeyCloak(stack, 'KeyCloak', {
    certificateArn: 'MOCK_ARN',
    auroraServerlessV2: true,
    keycloakVersion: KeycloakVersion.V15_0_2,
  });

  // THEN
  const t = assertions.Template.fromStack(stack);
  t.hasResourceProperties('AWS::RDS::DBCluster', {
    Engine: 'aurora-mysql',
    DBClusterParameterGroupName: 'default.aurora-mysql8.0',
    DBSubnetGroupName: {
      Ref: 'KeyCloakDatabaseDBClusterSubnetsE36F1B1B',
    },
    EngineVersion: '8.0.mysql_aurora.3.02.0',
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
        'Fn::GetAtt': [
          'KeyCloakDatabaseDBClusterSecurityGroup843B4392',
          'GroupId',
        ],
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
    keycloakVersion: KeycloakVersion.V15_0_2,
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
  t.resourceCountIs('AWS::SecretsManager::Secret', 2);
  // we should have ecs service
  t.hasResourceProperties('AWS::ECS::Service', {
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
  const t = assertions.Template.fromStack(stack);
  t.hasResourceProperties('AWS::ECS::TaskDefinition', {

    ContainerDefinitions: [
      {
        Environment: [
          {
            Name: 'DB_ADDR',
            Value: {
              'Fn::GetAtt': [
                'KeyCloakDatabaseDBCluster06E9C0E1',
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
            Name: 'PROXY_ADDRESS_FORWARDING',
            Value: 'true',
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
            'KeyCloakKeyCloakContainerSerivceKeycloakImageMapF79EAEA3',
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
              Ref: 'KeyCloakKeyCloakContainerSerivceLogGroup010F2AAE',
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
                    Ref: 'KeyCloakDatabaseDBClusterSecretAttachment50401C92',
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
                    Ref: 'KeyCloakKCSecretF8498E5C',
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
      'Fn::GetAtt': [
        'KeyCloakKeyCloakContainerSerivceTaskRole0658CED2',
        'Arn',
      ],
    },
    Family: 'testingstackKeyCloakKeyCloakContainerSerivceTaskDef799BAD5B',
    Memory: '8192',
    NetworkMode: 'awsvpc',
    RequiresCompatibilities: [
      'FARGATE',
    ],
    TaskRoleArn: {
      'Fn::GetAtt': [
        'KeyCloakKeyCloakContainerSerivceTaskDefTaskRole0DC4D418',
        'Arn',
      ],
    },
  });
});
