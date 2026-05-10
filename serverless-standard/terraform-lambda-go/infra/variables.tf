variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = null # Will use AWS config default if not specified
}

variable "lambda_memory_size" {
  description = "Memory size for Lambda function in MB"
  type        = number
  default     = 1024
}

variable "function_name" {
  description = "Name of the Lambda function"
  type        = string
  default     = "LambdaGo"
}

variable "table_name" {
  description = "Name of the DynamoDB table"
  type        = string
  default     = "items"
}
