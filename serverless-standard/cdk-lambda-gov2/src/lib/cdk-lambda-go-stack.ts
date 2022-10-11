import { join } from 'path';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Code, Runtime, Function } from '@aws-cdk/aws-lambda';
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources';

import { BlockPublicAccess, Bucket, EventType } from '@aws-cdk/aws-s3';
import { StackProps, Construct, Stack, CfnOutput, RemovalPolicy } from '@aws-cdk/core';

// Problems with cdk version 1.59
// import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';


export class CdkLambdaGoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new Function(this, 'LambdaGoV2',
      {
        code: Code.fromAsset(join(__dirname, '../../lambda-go-v2/dist/main.zip')),
        handler: 'main',
        runtime: Runtime.GO_1_X,
        memorySize: 128,
      });

    new CfnOutput(this, 'LambdaName', {
      value: fn.functionName,
      exportName: 'lambda-go-v2-name',
    });

    // Bucket start ****************
    // *
    const bucky = new Bucket(this, 'incoming-gov2', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });
    new CfnOutput(this, 'BucketName', {
      value: bucky.bucketName,
    });
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
        EventType.OBJECT_CREATED,
      ],
    }));
    // Event End   *******************

    //** Dynamodb start */
    // do not force table name, this leads to singleTimeDeployability
    const table = new Table(this, 'items', {
      partitionKey: {
        name: 'itemID',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code

    });

    fn.addEnvironment('TableName', table.tableName);
    table.grantReadWriteData(fn);
    new CfnOutput(this, 'TableName', {
      value: table.tableName,
      exportName: 'Table-go-v2-name',
    });
    //** Dynamodb End */

  }
}
