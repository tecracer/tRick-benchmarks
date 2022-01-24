import { aws_dynamodb, aws_lambda, aws_lambda_event_sources, aws_s3, CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';


export class Cdk2LambdaGoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new aws_lambda.Function(this, 'LambdaGo',
      {
        code: aws_lambda.Code.fromAsset(join(__dirname, '../../app/dist/main.zip')),
        handler: 'main',
        runtime: aws_lambda.Runtime.GO_1_X,
        memorySize: 1024,
      });

    new CfnOutput(this, 'LambdaName', {
      value: fn.functionName,
      exportName: 'lambda-go-name',
    });

    // Bucket start ****************
    // *
    const bucky = new aws_s3.Bucket(this, 'incoming', {
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
    fn.addEventSource( new aws_lambda_event_sources.S3EventSource(bucky, {
      events: [
        aws_s3.EventType.OBJECT_CREATED,
      ],
    }));
    // Event End   *******************

    //** Dynamodb start */
    const table = new aws_dynamodb.Table(this, 'items', {
      partitionKey: {
        name: 'itemID',
        type: aws_dynamodb.AttributeType.STRING,
      },
      tableName: 'items',
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    fn.addEnvironment('TableName', table.tableName);
    table.grantReadWriteData(fn);
    //** Dynamodb End */

  }
}
