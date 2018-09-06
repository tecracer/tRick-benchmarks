variable "region" {
  type        = "string"
  description = "Region where the Infrastructure should be deployed"
}

variable "availability_zone" {
  type        = "string"
  description = "Availability Zone for the public subnet"
  default     = "a"
}

variable "cidr_block" {
  type        = "string"
  description = "CIDR Range to be used for the VPC"
}

variable "tags" {
  type        = "map"
  description = "Tags to be assigned to resources created for the benchmark"

  default = {
    Created-For = "tRick Benchmark"
    Created-By  = "Terraform"
  }
}