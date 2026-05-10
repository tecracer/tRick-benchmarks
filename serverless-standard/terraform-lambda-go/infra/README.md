# Terraform Infrastructure for Lambda-Go

This directory contains Terraform configuration for deploying a serverless Go Lambda function with S3 and DynamoDB.

## What This Creates

- **Lambda Function**: Go-based Lambda function with:
  - 1024 MB memory
  - X-Ray tracing enabled
  - Lambda Insights enabled
  - Custom runtime (provided.al2023)

- **S3 Bucket**: 
  - Fully private bucket for incoming files
  - Configured to trigger Lambda on object creation

- **DynamoDB Table**:
  - Table named "items"
  - PAY_PER_REQUEST billing mode
  - Partition key: "itemID" (String)

- **IAM Roles & Policies**:
  - Lambda execution role with necessary permissions
  - S3 read access
  - DynamoDB read/write access
  - CloudWatch Logs, X-Ray, and Lambda Insights permissions

## Prerequisites

1. Install Terraform (>= 1.0)
2. Install Task (https://taskfile.dev)
3. Configure AWS credentials (via AWS CLI or environment variables)
4. Build the Go Lambda function (you'll need to create the app directory structure)

## Directory Structure

```
terraform-lambda-go/
├── infra/                 # Terraform configuration (this directory)
│   ├── main.tf           # Main Terraform configuration
│   ├── variables.tf      # Variable definitions
│   ├── Taskfile.yml      # Task automation
│   └── .gitignore        # Git ignore patterns
└── app/                   # Go Lambda application (to be created)
    ├── main/
    │   └── main.go       # Go Lambda handler
    └── dist/
        └── bootstrap.zip # Compiled Lambda binary
```

## Usage

### Initialize Terraform
```bash
task init
```

### Plan Deployment
```bash
task plan
```

### Deploy
```bash
task deploy
```

### Update Lambda Code Only
After rebuilding the Go application:
```bash
task update-lambda
```

### Show Outputs
```bash
task output
```

### Destroy
```bash
task force-destroy
```

## Available Tasks

Run `task --list` to see all available tasks:

- `init` - Initialize Terraform
- `plan` - Plan Terraform changes
- `apply` - Apply Terraform changes (with confirmation)
- `deploy` - Deploy infrastructure (auto-approve)
- `destroy` - Destroy infrastructure (with confirmation)
- `force-destroy` - Destroy infrastructure (auto-approve)
- `update-lambda` - Update only Lambda function code
- `output` - Show outputs
- `validate` - Validate Terraform configuration
- `fmt` - Format Terraform files
- `clean` - Clean Terraform cache and state

## Outputs

After deployment, Terraform will output:
- `lambda_function_name`: Name of the Lambda function
- `bucket_name`: Name of the S3 bucket
- `table_name`: Name of the DynamoDB table

## Notes

- The Lambda Insights layer ARN is region-specific and configured for most common AWS regions
- The S3 bucket name will be auto-generated with the prefix "incoming-"
- DynamoDB table has deletion protection disabled (will be deleted on `terraform destroy`)
- Lambda function expects the compiled Go binary at `../app/dist/bootstrap.zip`
