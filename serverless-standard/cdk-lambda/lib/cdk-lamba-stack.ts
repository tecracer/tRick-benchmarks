import { StackProps, Construct, Stack, CfnOutput, RemovalPolicy } from '@aws-cdk/core';

// Problems with cdk version 1.59
// import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';

import {Code, Runtime, Function} from '@aws-cdk/aws-lambda';
import {Bucket, BlockPublicAccess, EventType} from '@aws-cdk/aws-s3';
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb'
import path = require('path');

export class CdkLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Problems with cdk version 1.59
    // const fn = new NodejsFunction(this, "fn",{
    //   entry: 'lambda/index.ts',
    //   handler: 'lambdaHandler',
    //   runtime: Runtime.NODEJS_12_X,  
    //   nodeModules: ['util','aws-sdk']
    // })

    
    const fn = new Function(this, 'fn', {
      code: Code.asset(path.join(__dirname, '../lambda')),
      handler: 'index.lambdaHandler',
      runtime: Runtime.NODEJS_12_X,
      memorySize: 1024
    });

    new CfnOutput(this, "LambdaName",{
      value: fn.functionName
    })

    // Bucket start ****************
    // *
    const bucky = new Bucket(this, "incoming", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL
    })
    new CfnOutput(this, "BucketName",{
      value: bucky.bucketName
    })
    // Tell Lambda the dynamic bucket name
    fn.addEnvironment('Bucket', bucky.bucketName);
    // *
    // give lambda read rights
    bucky.grantRead(fn);
    // *
    // Bucket end *******************

    // Event start *******************
    fn.addEventSource( new S3EventSource(bucky, {
      events: [
        EventType.OBJECT_CREATED]
    }))
    // Event End   *******************

    //** Dynamodb start */
    const table = new Table(this, 'items', {
      partitionKey: {
        name: 'itemId',
        type: AttributeType.STRING
      },
      tableName: 'items',
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    fn.addEnvironment('TableName', table.tableName);
    table.grantReadWriteData(fn);
    //** Dynamodb End */

  }
}
