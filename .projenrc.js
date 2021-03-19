const { AwsCdkConstructLibrary } = require('projen');
const { Automation } = require('projen-automate-it');

const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  author: 'Pahud Hsieh',
  authorAddress: 'pahudnet@gmail.com',
  description: 'CDK construct library that allows you to create KeyCloak service on AWS in TypeScript or Python',
  cdkVersion: '1.73.0',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'cdk-keycloak',
  repositoryUrl: 'https://github.com/aws-samples/cdk-keycloak.git',
  cdkDependencies: [
    '@aws-cdk/aws-autoscaling',
    '@aws-cdk/aws-certificatemanager',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-ecs',
    '@aws-cdk/aws-elasticloadbalancingv2',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-logs',
    '@aws-cdk/aws-rds',
    '@aws-cdk/aws-secretsmanager',
    '@aws-cdk/core',
  ],
  dependabot: false,
  catalog: {
    announce: false,
    twitter: 'pahudnet',
  },
  releaseBranches: ['main'],
  defaultReleaseBranch: ['main'],
  publishToPypi: {
    distName: 'cdk-keycloak',
    module: 'cdk_keycloak',
  },
  keywords: [
    'cdk',
    'keycloak',
    'aws',
  ],
  devDeps: [
    'projen-automate-it',
  ],
});


const automation = new Automation(project, {
  automationToken: AUTOMATION_TOKEN,
});
automation.autoApprove();
automation.autoMerge();
automation.projenYarnUpgrade();


const common_exclude = ['cdk.out', 'cdk.context.json', 'images', 'yarn-error.log', 'dependabot.yml'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);


project.synth();
