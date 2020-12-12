
import {inspect} from 'util';
import * as AWS from 'aws-sdk';

AWS.config.update({
  region: "eu-central-1",
  apiVersions: {
    dynamodb: '2012-08-10',
  }
});

const table = process.env['TableName'] || 'undefined';
const bucket = process.env['BucketName'] || 'undefined';

const dynamodb = new AWS.DynamoDB();

export const lambdaHandler = async (event: any, context: any) =>
{
    console.log("Reading options from event:\n", inspect(event, {depth: 5}));
    const srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    
    

    let now = new Date().getTime();
    let params: AWS.DynamoDB.PutItemInput = {
      Item:
        {
          "itemId": {"S": srcKey},
          "time" : {"N": now.toString()}
        }, 
      TableName: table,
    }
    await dynamodb.putItem(params).promise();

    let msg= "Key:"+srcKey;
    console.log(msg);
    return msg;
}
