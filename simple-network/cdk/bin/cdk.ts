#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
const tRickStack = new CdkStack(app, 'CdkStack', { env: { region: 'eu-west-3' } });
tRickStack.apply(new cdk.Tag('Created-For', 'tRick Benchmakr'))
tRickStack.apply(new cdk.Tag('Created-By', 'AWS CDK'))
app.run();
