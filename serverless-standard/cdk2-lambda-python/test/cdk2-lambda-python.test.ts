import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Cdk2LambdaPython from '../lib/cdk2-lambda-python-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/cdk2-lambda-python-stack.ts
test('SQS Queue Created', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new Cdk2LambdaPython.Cdk2LambdaPythonStack(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Dynamodb::Table', {
    
  });
});
