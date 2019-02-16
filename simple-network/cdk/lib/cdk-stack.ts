import cdk = require('@aws-cdk/cdk');
import { VpcNetwork, SubnetType, SecurityGroup, AnyIPv4, TcpPort } from "@aws-cdk/aws-ec2";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.templateOptions.description = 'v1.0.0 tRick Benchmark Stack'

    const tRickVPC = new VpcNetwork(this, 'tRick-simple-network-vpc', {
      cidr: '10.0.0.0/16',
      maxAZs: 1,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: SubnetType.Public,
          cidrMask: 24
        }]
    });

    const tRickWebServerSG = new SecurityGroup(this, 'tRick-simple-network-sg', {
      allowAllOutbound: true,
      description: 'Security Group for HTTP Webserver',
      groupName: 'webserver-sg',
      vpc: tRickVPC
    });

    tRickWebServerSG.addIngressRule(new AnyIPv4, new TcpPort(80), 'Allow HTTP Access from the world')
  }
}
