#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
new CdkStack(app, 'CdkStack',
 { 
    env: { region: 'eu-west-3' } ,
    tags: {'Created-For': 'tRick Benchmakr'},
    });
app.synth();
