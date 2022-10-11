import { aws_dynamodb, aws_lambda, aws_lambda_event_sources, aws_s3, CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {  PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Construct } from 'constructs';
import { join } from 'path';

export class Cdk2LambdaPythonStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new PythonFunction(this, 'MyFunction', {
      entry: './lambda-python', // required
       index: 'app.py', // optional, defaults to 'index.py'
       handler: 'lambda_handler', // optional, defaults to 'handler'
       runtime: aws_lambda.Runtime.PYTHON_3_8,
       memorySize: 1024,
       description: 'trick-serverless-python',
     });
 
     new CfnOutput(this, 'LambdaName', {
       value: fn.functionName,
       exportName: 'lambda-trick-python-name',
     });
 
     // Bucket start ****************
     // *
     const bucky = new aws_s3.Bucket(this, 'incoming-gov2', {
       blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
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
     fn.addEventSource( new aws_s3.S3EventSource(bucky, {
       events: [
         aws_s3.EventType.OBJECT_CREATED,
       ],
     }));
     // Event End   *******************
 
     //** Dynamodb start */
     // do not force table name, this leads to singleTimeDeployability
     const table = new aws_dynamodb.Table(this, 'items', {
       partitionKey: {
         name: 'itemID',
         type: aws_dynamodb.AttributeType.STRING,
       },
       removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
       billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
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
