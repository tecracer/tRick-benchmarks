# tRick-benchmarks

Repository used for tecRacer created Infrastructure as Code (IaC) Framework benchmarks and IaC sourcecode

- [tRick-benchmarks](#trick-benchmarks)
  - [Use Cases](#use-cases)
    - [Simple Network](#simple-network)

## Use Cases 

There are several use cases, that will be used to benchmark different IaC Frameworks for the AWS platform.

### Simple Network

The first use case that will be evaluated consists of a simple network setup with the following properties:

- 1 Virtual Private Cloud (VPC)
- 1 Subnet (public)
- 1 Routetable (public)
- 1 Internet Gateway
- 1 example Security Group (Webserver: Inbound Port 80)

The benchmark itself can be found in the [simple-network folder](/simple-network), each used IaC framework will be held in it's respective subfolder.