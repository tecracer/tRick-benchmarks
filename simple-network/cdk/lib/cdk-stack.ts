import cdk = require('@aws-cdk/core');
import { Vpc, SubnetType, SecurityGroup, Peer, Port } from "@aws-cdk/aws-ec2";

export class CdkStack extends cdk.Stack {
  constructor(app: cdk.App, id: string, props: {}) {
    super(app, id, props);

    const tRickVPC = new Vpc(this, 'tRick-simple-network-vpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 1,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24
        }]
    });

    const tRickWebServerSG = new SecurityGroup(this, 'tRick-simple-network-sg', {
      allowAllOutbound: true,
      description: 'Security Group for HTTP Webserver',
      securityGroupName:'webserver-sg',
      vpc: tRickVPC
    });

    tRickWebServerSG.addIngressRule(Peer.anyIpv4(), Port.tcp(80), 'Allow HTTP Access from the world')
  }
}
