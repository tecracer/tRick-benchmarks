package main // import "goformation"

import (
	"fmt"
	"log"
	cloudformation "github.com/awslabs/goformation/cloudformation"
)


const vpc = "vpc"
const internetCidr = "0.0.0.0/0"
const vpcCidr = "10.0.0.0/16"
const subnet1 = "PublicSubnet"
const subnet1cidr = "10.0.1.0/24"
const igw = "igateway"
const igwa = "igatewayattachment"
const routetable1 = "PublicRoute"
const az= "eu-central-1a"
const route1p = "route1"
const sg1name = "WebServerSG"
const sg1desc = "Demo Security Group Webserver"

func main() { 
	// Create a new CloudFormation template
	template := cloudformation.NewTemplate()

	buildVpc(template, vpcCidr)
	buildSubnet(template, vpc, subnet1cidr, az)
	buildIGW(template,vpc)
	buildRouting(template, vpc, igw)
	buildSecurityGroups(template, vpc)
	output(template)
}

func output(template *cloudformation.Template) {
	y, err := template.JSON()
	if err != nil {
		log.Printf("Failed to generate  ")
	} else {
		log.Printf("Generating json")
		fmt.Printf("%s\n", y)
	}
}

func buildVpc(template *cloudformation.Template, cidr string){
	var cloudformationVPC cloudformation.AWSEC2VPC
	cloudformationVPC.CidrBlock = cidr
	template.Resources[vpc] = &cloudformationVPC
}

func buildSubnet(template *cloudformation.Template, vpc string, cidr string, zone string){
	var cloudformationSubnet cloudformation.AWSEC2Subnet
	cloudformationSubnet.AvailabilityZone = zone
	cloudformationSubnet.CidrBlock = cidr
	cloudformationSubnet.VpcId = cloudformation.Ref(vpc)
	template.Resources[subnet1] = &cloudformationSubnet
}

func buildIGW(template *cloudformation.Template, vpc string){
	var cloudformationIGW cloudformation.AWSEC2InternetGateway
	template.Resources[igw] = &cloudformationIGW

	var cloudformationIGWAttachment cloudformation.AWSEC2VPCGatewayAttachment
	cloudformationIGWAttachment.VpcId = cloudformation.Ref(vpc)
	cloudformationIGWAttachment.InternetGatewayId = cloudformation.Ref(igw)
	template.Resources[igwa] = &cloudformationIGWAttachment
}

func buildRouting(template *cloudformation.Template, vpc string , igw string){
	var cloudformationRT cloudformation.AWSEC2RouteTable
	cloudformationRT.VpcId =  cloudformation.Ref(vpc)
	template.Resources[routetable1] = &cloudformationRT
	
	var cloudformationRoute cloudformation.AWSEC2Route
	cloudformationRoute.DestinationCidrBlock = internetCidr
	cloudformationRoute.GatewayId = cloudformation.Ref(igw)
	cloudformationRoute.RouteTableId =  cloudformation.Ref(routetable1)
	template.Resources[route1p] = &cloudformationRoute
}

func buildSecurityGroups(template *cloudformation.Template, vpc string){
	var cloudformationSG1 cloudformation.AWSEC2SecurityGroup

	cloudformationSG1.GroupDescription = sg1desc
	cloudformationSG1.GroupName = sg1name
	cloudformationSG1.VpcId =  cloudformation.Ref(vpc)

	var portfilter []cloudformation.AWSEC2SecurityGroup_Ingress
	portfilter = append(portfilter,  cloudformation.AWSEC2SecurityGroup_Ingress{
		CidrIp: internetCidr,
		FromPort: 80,
		ToPort: 80,
		IpProtocol: "tcp",
	})
	cloudformationSG1.SecurityGroupIngress = portfilter
	template.Resources[sg1name] = &cloudformationSG1
}
