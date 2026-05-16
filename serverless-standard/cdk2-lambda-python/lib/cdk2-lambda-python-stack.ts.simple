import {
  aws_dynamodb,
  aws_lambda,
  aws_lambda_event_sources,
  aws_s3,
  CfnOutput,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

export class Cdk2LambdaPythonStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Use native Lambda Function - no Docker bundling, just zip
    const fn = new aws_lambda.Function(this, "MyFunction", {
      runtime: aws_lambda.Runtime.PYTHON_3_14,
      handler: "app.lambda_handler",
      code: aws_lambda.Code.fromAsset("./lambda-python"),
      memorySize: 1024,
      description: "trick-serverless-python",
      logRetention: RetentionDays.ONE_MONTH,
      insightsVersion: aws_lambda.LambdaInsightsVersion.VERSION_1_0_135_0,
    });

    new CfnOutput(this, "LambdaName", {
      value: fn.functionName,
      exportName: "lambda-trick-python-name",
    });

    // Bucket start ****************
    // *
    const bucky = new aws_s3.Bucket(this, "incoming-gov2", {
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
    });
    new CfnOutput(this, "BucketName", {
      value: bucky.bucketName,
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
      new aws_lambda_event_sources.S3EventSource(bucky, {
        events: [aws_s3.EventType.OBJECT_CREATED],
      }),
    );
    // Event End   *******************

    //** Dynamodb start */
    // do not force table name, this leads to singleTimeDeployability
    const table = new aws_dynamodb.Table(this, "items", {
      partitionKey: {
        name: "itemID",
        type: aws_dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    fn.addEnvironment("TABLE", table.tableName);
    table.grantReadWriteData(fn);
    new CfnOutput(this, "TableName", {
      value: table.tableName,
      exportName: "trick-Table-python-name",
    });
    //** Dynamodb End */
  }
}
