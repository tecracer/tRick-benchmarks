import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { CdkLambdaStack } from '../lib/cdk-lamba-stack';

test('Stack has expected resources', () => {
  const app = new cdk.App();
  const stack = new CdkLambdaStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);
  
  // Verify Lambda function exists
  template.resourceCountIs('AWS::Lambda::Function', 1);
  
  // Verify S3 bucket exists
  template.resourceCountIs('AWS::S3::Bucket', 1);
  
  // Verify DynamoDB table exists
  template.resourceCountIs('AWS::DynamoDB::Table', 1);
});