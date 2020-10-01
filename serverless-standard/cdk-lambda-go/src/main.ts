import { App, Construct, Stack, StackProps } from '@aws-cdk/core';

import { CdkLambdaGoStack } from './lib/cdk-lambda-go-stack';


export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // define resources here...
  }
}

const app = new App();
new CdkLambdaGoStack(app, 'cdk-lambda-go-stack');
app.synth();