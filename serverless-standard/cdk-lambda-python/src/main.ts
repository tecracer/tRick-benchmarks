import { App } from '@aws-cdk/core';
import { CdkLambdaPythonStack } from './lib/cdk-lambda-python-stack';

const app = new App();

new CdkLambdaPythonStack(app, 'tricksCdkLambaPythonStack', {
  description: 'trick-serverless-standard CDK: python aws sdk',
});


app.synth();