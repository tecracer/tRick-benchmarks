import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';
import { Runtime } from '@aws-cdk/aws-lambda';
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources';
import { PythonFunction } from '@aws-cdk/aws-lambda-python';
import { BlockPublicAccess, Bucket, EventType } from '@aws-cdk/aws-s3';
import { StackProps, Construct, Stack, CfnOutput, RemovalPolicy } from '@aws-cdk/core';


// Problems with cdk version 1.59
// import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';


export class CdkLambdaPythonStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

  
    const fn = new PythonFunction(this, 'MyFunction', {
     entry: './lambda-python', // required
      index: 'app.py', // optional, defaults to 'index.py'
      handler: 'lambda_handler', // optional, defaults to 'handler'
      runtime: Runtime.PYTHON_3_8,
      memorySize: 1024,
      description: 'trick-serverless-python',
    });

    new CfnOutput(this, 'LambdaName', {
      value: fn.functionName,
      exportName: 'lambda-trick-python-name',
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
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    fn.addEnvironment('TABLE', table.tableName);
    table.grantReadWriteData(fn);
    new CfnOutput(this, 'TableName', {
      value: table.tableName,
      exportName: 'trick-Table-python-name',
    });
    //** Dynamodb End */

  }
}
