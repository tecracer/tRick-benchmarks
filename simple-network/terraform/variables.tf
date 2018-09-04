variable "region" {
  type        = "string"
  description = "Region where the Infrastructure should be deployed"
}

variable "cidr_block" {
  type        = "string"
  description = "CIDR Range to be used for the VPC"
}
