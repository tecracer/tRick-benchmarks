package main

import (
	"fmt"
    "log"
	"github.com/awslabs/goformation/cloudformation"
)


const vpc = "myVpc"

func main() {
	// Create a new CloudFormation template
	template := cloudformation.NewTemplate()

    // vpc
    var cfVpc cloudformation.AWSEC2VPC
    

    template.Resources[vpc] = &cfVpc

	output(template)
}

func output( template *cloudformation.Template){
	y, err := template.YAML()
	//y, err := template.JSON()
	if err != nil {
		log.Printf("Failed to generate YAML: ")
	} else {
		log.Printf("Generating yaml")
		//yaml := string(y)
		fmt.Printf("%s\n", y)
	}
}


