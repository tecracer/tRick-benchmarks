provider "aws" {
  region = var.region
}

resource "aws_vpc" "vpc" {
  cidr_block = var.cidr_block

  tags = var.tags
}

resource "aws_subnet" "public_subnet" {
  availability_zone       = join("",[var.region, var.availability_zone])
  cidr_block              = cidrsubnet(var.cidr_block, 8, 0)
  map_public_ip_on_launch = true
  vpc_id                  = aws_vpc.vpc.id

  tags = var.tags
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id

  tags = var.tags
}

resource "aws_route_table" "public_routetable" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }

  tags = var.tags
}

resource "aws_route_table_association" "public_routetable_association" {
  route_table_id = aws_route_table.public_routetable.id
  subnet_id      = aws_subnet.public_subnet.id
}

resource "aws_security_group" "webserver-sg" {
  name        = "webserver-sg"
  description = "Security Group for HTTP Webserver"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # As Terraform overwrides the AWS default for SGs to be outbound open on every port,
  # we need to create a corresponding egress rule in our SG resource
  egress {
    from_port   = 0             # Must be 0 if every protocol ("all") is allowed
    to_port     = 0             # Must be 0 if every protocol ("all") is allowed
    protocol    = -1            # Semantically equivalent to "all" 
    cidr_blocks = ["0.0.0.0/0"]
  }

  vpc_id = aws_vpc.vpc.id

  tags = var.tags
}
