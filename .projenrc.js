const { AwsCdkConstructLibrary } = require('projen');

const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  author: 'Pahud Hsieh',
  authorAddress: 'pahudnet@gmail.com',
  description: 'CDK construct library that allows you to create KeyCloak service on AWS in TypeScript or Python',
  cdkVersion: '1.73.0',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'cdk-keycloak',
  repositoryUrl: 'https://github.com/pahud/cdk-keycloak.git',
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
});


// create a custom projen and yarn upgrade workflow
autoApprove = project.github.addWorkflow('AutoApprove');


autoApprove.on({
  pull_request_target: {
    types: ['assigned', 'opened', 'synchronize', 'reopened'],
  },
});

autoApprove.addJobs({
  'auto-approve': {
    'runs-on': 'ubuntu-latest',
    'steps':
    [
      {
        uses: 'hmarr/auto-approve-action@v2.0.0',
        if: "github.actor == 'pahud' || contains( github.event.pull_request.labels.*.name, 'auto-approve')",
        with: {
          'github-token': '${{ secrets.GITHUB_TOKEN }}',
        },
      },
    ],
  },
});

// create a custom projen and yarn upgrade workflow
workflow = project.github.addWorkflow('ProjenYarnUpgrade');

workflow.on({
  schedule: [{
    cron: '11 0 * * *',
  }], // 0:11am every day
  workflow_dispatch: {}, // allow manual triggering
});

workflow.addJobs({
  upgrade: {
    'runs-on': 'ubuntu-latest',
    'steps': [
      { uses: 'actions/checkout@v2' },
      {
        uses: 'actions/setup-node@v1',
        with: {
          'node-version': '10.17.0',
        },
      },
      { run: 'yarn upgrade' },
      { run: 'yarn projen:upgrade' },
      // submit a PR
      {
        name: 'Create Pull Request',
        uses: 'peter-evans/create-pull-request@v3',
        with: {
          'token': '${{ secrets.' + AUTOMATION_TOKEN + ' }}',
          'commit-message': 'chore: upgrade projen',
          'branch': 'auto/projen-upgrade',
          'title': 'chore: upgrade projen and yarn',
          'body': 'This PR upgrades projen and yarn upgrade to the latest version',
          'labels': 'auto-merge,auto-approve', 
        },
      },
    ],
  },
});


const common_exclude = ['cdk.out', 'cdk.context.json', 'images', 'yarn-error.log', 'dependabot.yml'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);


project.synth();
