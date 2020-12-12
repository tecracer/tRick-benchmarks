import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { CdkLambdaPythonStack } from '../src/lib/cdk-lambda-python-stack';

test('BaseResources', () => {
  const app = new App();
  const stack = new CdkLambdaPythonStack(app, 'test');

  expectCDK(stack).to(haveResource('AWS::S3::Bucket'));
  expectCDK(stack).to(haveResource('AWS::Lambda::Function'));
  expectCDK(stack).to(haveResource('AWS::DynamoDB::Table'));

});