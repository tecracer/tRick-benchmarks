terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  # Configuration will be taken from environment variables or AWS config
}

# Data source to get current AWS account and region
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "lambda-go-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Attach basic Lambda execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Attach Lambda Insights policy
resource "aws_iam_role_policy_attachment" "lambda_insights" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy"
}

# Attach X-Ray write policy for tracing
resource "aws_iam_role_policy_attachment" "lambda_xray" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

# S3 Bucket
resource "aws_s3_bucket" "incoming" {
  bucket_prefix = "incoming-"
}

# Block all public access to the bucket
resource "aws_s3_bucket_public_access_block" "incoming" {
  bucket = aws_s3_bucket.incoming.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# DynamoDB Table
resource "aws_dynamodb_table" "items" {
  name           = "items"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "itemID"

  attribute {
    name = "itemID"
    type = "S"
  }

  tags = {
    Name = "items"
  }
}

# IAM Policy for S3 Read Access
resource "aws_iam_role_policy" "lambda_s3_read" {
  name = "lambda-s3-read-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion"
        ]
        Resource = "${aws_s3_bucket.incoming.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.incoming.arn
      }
    ]
  })
}

# IAM Policy for DynamoDB Access
resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "lambda-dynamodb-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = aws_dynamodb_table.items.arn
      }
    ]
  })
}

# Lambda Function
resource "aws_lambda_function" "lambda_go" {
  filename         = "../app/dist/bootstrap.zip"
  function_name    = "LambdaGo"
  role            = aws_iam_role.lambda_role.arn
  handler         = "main"
  runtime         = "provided.al2023"
  memory_size     = 1024
  architectures    = ["arm64"]
  source_code_hash = filebase64sha256("../app/dist/bootstrap.zip")
  timeout         = 30
  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      Bucket    = aws_s3_bucket.incoming.bucket
      TableName = aws_dynamodb_table.items.name
    }
  }

}

# Lambda permission for S3 to invoke the function
resource "aws_lambda_permission" "allow_s3" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_go.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.incoming.arn
}

# S3 Bucket Notification
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.incoming.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.lambda_go.arn
    events              = ["s3:ObjectCreated:*"]
  }

  depends_on = [aws_lambda_permission.allow_s3]
}

# Outputs
output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.lambda_go.function_name
}

output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.incoming.bucket
}

output "table_name" {
  description = "Name of the DynamoDB table"
  value       = aws_dynamodb_table.items.name
}
