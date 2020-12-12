import { App } from '@aws-cdk/core';

import { CdkLambdaGoStack } from './lib/cdk-lambda-go-stack';

const app = new App();
new CdkLambdaGoStack(app, 'cdk-lambda-go-stack', {
  description: 'trick-serverless-standard CDK: go aws sdk v1',

});
app.synth();