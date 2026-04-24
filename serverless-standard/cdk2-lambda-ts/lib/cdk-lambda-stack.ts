import { StackProps, Stack, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import {
  LambdaInsightsVersion,
  Runtime,
  Tracing,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket, BlockPublicAccess, EventType } from "aws-cdk-lib/aws-s3";
import { S3EventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { RetentionDays, LogGroup } from "aws-cdk-lib/aws-logs"; // Added LogGroup
import { Construct } from "constructs";

export class CdkLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create log group first
    const logGroup = new LogGroup(this, "FunctionLogGroup", {
      logGroupName: "/trick/event-lambda",
      retention: RetentionDays.ONE_MONTH,
      removalPolicy: RemovalPolicy.DESTROY, // Clean up logs when stack is deleted
    });

    const fn = new NodejsFunction(this, "fn", {
      functionName: "trick",
      entry: "lambda/index.ts",
      handler: "lambdaHandler",
      runtime: Runtime.NODEJS_24_X,
      memorySize: 1024,
      description: "trick-serverless-typescript-2022",
      logGroup: logGroup, // Changed from logRetention
      insightsVersion: LambdaInsightsVersion.VERSION_1_0_143_0,
      tracing: Tracing.ACTIVE,
    });

    new CfnOutput(this, "LambdaName", {
      value: fn.functionName,
      exportName: "lambda-trick-ts-name",
    });

    // Bucket start ****************
    // *
    const bucky = new Bucket(this, "incoming", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });
    new CfnOutput(this, "BucketName", {
      value: bucky.bucketName,
    });
    new StringParameter(this, "BucketNameParameter", {
      parameterName: "/trick/bucket",
      description: "Bucket name for trick stacks",
      stringValue: bucky.bucketName,
    });
    // Tell Lambda the dynamic bucket name
    fn.addEnvironment("Bucket", bucky.bucketName);
    // *
    // give lambda read rights
    bucky.grantRead(fn);
    // *
    // Bucket end *******************
    // Event start *******************
    fn.addEventSource(
      new S3EventSource(bucky, {
        events: [EventType.OBJECT_CREATED],
      }),
    );
    // Event End   *******************
    //** Dynamodb start */
    const table = new Table(this, "items-ts", {
      tableName: "trick-items",
      partitionKey: {
        name: "itemId",
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    fn.addEnvironment("TableName", table.tableName);
    // least privileges
    table.grantReadWriteData(fn);
    new CfnOutput(this, "TableName", {
      value: table.tableName,
      exportName: "trick-Table-ts-name",
    });
    //** Dynamodb End */
  }
}
