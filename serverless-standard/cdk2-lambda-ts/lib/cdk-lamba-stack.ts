import { StackProps, Stack, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { LambdaInsightsVersion, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket, BlockPublicAccess, EventType } from 'aws-cdk-lib/aws-s3';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb'
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class CdkLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, "fn", {
      entry: 'lambda/index.ts',
      handler: 'lambdaHandler',
      runtime: Runtime.NODEJS_16_X,
      memorySize: 1024,
      description: "trick-serverless-typescript-2022",
      logRetention: RetentionDays.ONE_MONTH,
      insightsVersion: LambdaInsightsVersion.VERSION_1_0_143_0,
      tracing: Tracing.ACTIVE,
    })

    new CfnOutput(this, "LambdaName", {
      value: fn.functionName,
      exportName: 'lambda-trick-ts-name',
    })


    // Bucket start ****************
    // *
    const bucky = new Bucket(this, "incoming", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL
    })
    new CfnOutput(this, "BucketName", {
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
    fn.addEventSource(new S3EventSource(bucky, {
      events: [
        EventType.OBJECT_CREATED]
    }))
    // Event End   *******************

    //** Dynamodb start */
    const table = new Table(this, 'items-ts', {
      partitionKey: {
        name: 'itemId',
        type: AttributeType.STRING
      },
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    fn.addEnvironment('TableName', table.tableName);

    // least privileges
    table.grantReadWriteData(fn);

    new CfnOutput(this, 'TableName', {
      value: table.tableName,
      exportName: 'trick-Table-ts-name',
    });
    //** Dynamodb End */

  }
}
