const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: "1.70.0",
  name: "cdk-lambda-gov2",
  cdkDependencies: [
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-event-sources',
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-s3',
    "@aws-cdk/core",
    
  ],
  dependencies: [
    {"destroyable-bucket":  "^1.15"}
  ] ,
  devDependencies: [
    {'@types/jest': '26.0.14'},
  ]
});

project.synth();
