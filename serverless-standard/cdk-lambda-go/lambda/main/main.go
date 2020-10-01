package main

import (
	"context"
	"fmt"
	"os"
	"time"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-lambda-go/events"
    "github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

// Item holds Dynamodb input
type Item struct {
    itemID string `json:"itemID"`
    time  string `json:"time"`
}


// MyEvent Struct for S3 event
type MyEvent struct {
	Name string `json:"name"`
}

// HandleRequest S3 Event
func handler(ctx context.Context, s3Event events.S3Event) {
	// See https://github.com/aws/aws-lambda-go/tree/master/events
	// Handle only one event
	s3input := s3Event.Records[0].S3
	fmt.Printf("Bucket = %s, Key = %s \n", s3input.Bucket.Name, 
	s3input.Object.Key)

	putItem(s3input.Object.Key)

}

func putItem(itemID string){

	tableName := os.Getenv("TableName")

	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	// Create DynamoDB client
	svc := dynamodb.New(sess)

	t := time.Now()

	input := &dynamodb.PutItemInput{
        Item: map[string]*dynamodb.AttributeValue{
            "itemID": {
                S: aws.String(itemID),
			},
			"time" : {
				S: aws.String(t.String()),
			},
        },
        TableName: aws.String(tableName),
    }
  
	result, err := svc.PutItem(input)
	if err != nil {
		fmt.Println("Got error calling PutItem:")
		fmt.Println(err.Error())
		os.Exit(1)
	}


	fmt.Println("Successfully added " ,result)
}

func main() {

	lambda.Start(handler)

}


// CreateDirIfNotExist mkdir
func CreateDirIfNotExist(dir string) {
	if _, err := os.Stat(dir); os.IsNotExist(err) {
			err = os.MkdirAll(dir, 0755)
			if err != nil {
					panic(err)
			}
	}
}
