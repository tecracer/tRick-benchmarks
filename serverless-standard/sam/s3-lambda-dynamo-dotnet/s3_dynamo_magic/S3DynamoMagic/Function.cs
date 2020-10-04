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
      var response = await dynamoClient.PutItemAsync(
          tableName: tableEnvironment.Table,
          item: new Dictionary<string, AttributeValue>
          {
              {
                  "objectId",
                  new AttributeValue(s: itemKey)
              }
          }
      );

      return response;
    }

    public async Task<bool> FunctionHandler(S3Event s3Event, ILambdaContext context)
    {

      var environment = getEnvironment();

      s3Event.Records.ForEach(record =>
      {
        var itemKey = record.S3.Object.Key;
        var dynamoRepsonse = putDynamoItem(environment, itemKey);
        System.Console.WriteLine(dynamoRepsonse);
      });

      return true;
    }
  }

  class TableEnvironment
  {
    public string Table { get; set; }
  }
}
