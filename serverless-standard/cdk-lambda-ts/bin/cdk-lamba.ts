#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkLambdaStack } from '../lib/cdk-lamba-stack';

const app = new cdk.App();
new CdkLambdaStack(app, 'tricksCdkLambaTSStack', {
    description: "trick-serverless-standard CDK: TypeScript"
});
