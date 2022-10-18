import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Cdk2LambdaGo from '../lib/cdk2-lambda-go-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/cdk2-lambda-go-stack.ts
test('Lambda Function Created', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new Cdk2LambdaGo.Cdk2LambdaGoStack(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    MemorySize: 1024
  });
});
