import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { CdkLambdaGoStack } from '../src/lib/cdk-lambda-go-stack';

test('BaseResources', () => {
  const app = new App();
  const stack = new CdkLambdaGoStack(app, 'test');

  expectCDK(stack).to(haveResource('AWS::S3::Bucket'));
  expectCDK(stack).to(haveResource('AWS::Lambda::Function'));
  expectCDK(stack).to(haveResource('AWS::DynamoDB::Table'));

});