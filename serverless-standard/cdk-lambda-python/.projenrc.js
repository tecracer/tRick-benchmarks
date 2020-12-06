const { AwsCdkTypeScriptApp, Semver } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: "1.69.0",
  name: "cdk-lambda-python",
  cdkDependencies: [
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-event-sources',
    "@aws-cdk/aws-lambda-python",
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-s3',
    "@aws-cdk/core",
  ]

});

project.synth();
