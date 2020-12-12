import { App } from '@aws-cdk/core';
import { CdkLambdaGoStack } from './lib/cdk-lambda-go-stack';


const app = new App();
new CdkLambdaGoStack(app, 'cdk-lambda-go-v2', {
  description: 'trick-serverless-standard CDK: go aws sdk v2',
});
app.synth();