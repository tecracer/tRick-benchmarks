import * as aws from "@pulumi/aws";
import * as variable from "./variables";

let vpc = new aws.ec2.Vpc("vpc", {
  cidrBlock: variable.cidr_block,

  tags: variable.tags
});

let public_subnet = new aws.ec2.Subnet("public_subnet", {
  availabilityZone: variable.region + variable.availability_zone,
  cidrBlock: variable.subnet_cidr_block,
  mapPublicIpOnLaunch: true,
  vpcId: vpc.id,

  tags: variable.tags
});

let internet_gateway = new aws.ec2.InternetGateway("internet_gateway", {
  vpcId: vpc.id,

  tags: variable.tags
});

let public_routetable = new aws.ec2.RouteTable("public_routetable", {
  vpcId: vpc.id,

  routes: [
    {
      cidrBlock: "0.0.0.0/0",
      gatewayId: internet_gateway.id
    }
  ],

  tags: variable.tags
});

new aws.ec2.RouteTableAssociation("public_routetable_association", {
  routeTableId: public_routetable.id,
  subnetId: public_subnet.id
});

let webserver_sg = new aws.ec2.SecurityGroup("webserver-sg", {
  name: "webserver-sg",
  description: "Security Group for HTTP Webserver",

  ingress: [{
    fromPort: 80, toPort: 80, protocol: "tcp", cidrBlocks: ["0.0.0.0/0"]
  }],

  vpcId: vpc.id,

  tags: variable.tags
});

new aws.ec2.SecurityGroupRule("webserver-sg-egress", {
  type: "egress",
  fromPort: 0,
  toPort: 0,
  protocol: "all",
  cidrBlocks: ["0.0.0.0/0"],
  securityGroupId: webserver_sg.id
});