const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: "1.65.0",
  name: "cdk-lambda-go",
  cdkDependencies: [
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-event-sources',
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-s3',
    "@aws-cdk/core",
    
  ],
  dependencies: [
    "@cloudcomponents/cdk-deletable-bucket"
  ],
  
});

project.synth();
