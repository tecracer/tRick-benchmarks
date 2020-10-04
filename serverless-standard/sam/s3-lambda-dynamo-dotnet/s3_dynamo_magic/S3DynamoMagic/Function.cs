using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;

using Amazon.Lambda.Core;
using Amazon.Lambda.S3Events;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace S3DynamoMagic
{

  public class Function
  {

    private static readonly HttpClient client = new HttpClient();

    private static TableEnvironment getEnvironment()
    {
      var tableName = System.Environment.GetEnvironmentVariable("TABLE");

      return new TableEnvironment { Table = tableName };
    }

    private async Task<PutItemResponse> putDynamoItem(TableEnvironment tableEnvironment, string itemKey)
    {
      var dynamoClient = new AmazonDynamoDBClient();
      var putItemRequest = new PutItemRequest
      {
        TableName = tableEnvironment.Table,
        Item = new Dictionary<string, AttributeValue>
          {
              {
                  "objectId",
                  new AttributeValue(s: itemKey)
              }
          },
        ReturnConsumedCapacity = new ReturnConsumedCapacity("TOTAL")
      };
      var response = await dynamoClient.PutItemAsync(putItemRequest);

      return response;
    }

    public async Task<bool> FunctionHandler(S3Event s3Event, ILambdaContext context)
    {

      var environment = getEnvironment();

      foreach (var record in s3Event.Records)
      {
        var itemKey = record.S3.Object.Key;
        var dynamoResponse = await putDynamoItem(environment, itemKey);

        System.Console.WriteLine($"ConsumedCapacity: {dynamoResponse.ConsumedCapacity.CapacityUnits}");
      };

      return true;
    }
  }

  class TableEnvironment
  {
    public string Table { get; set; }
  }
}
