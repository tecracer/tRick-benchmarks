# Trick CDK V2 GO SDK V2 Lambda

## Directories

infra: Infrastructure
app: Lambda application

## Deploy

1) Install https://taskfile.dev
2) Build Zip

```bash
cd app
task build
```

3) Deploy Lambda/Create Dynamodb

From base directory, using cdk2

```bash
cd infra
npm i
cdk deploy --require-approval never
```

Note bucket name and table name from output.

4) Test

- Check Dynamoddb entries - should be zero

```bash
aws dynamodb scan --table-name "items"
```

Output like:
```json
{
    "Items": [],
    "Count": 0,
    "ScannedCount": 0,
    "ConsumedCapacity": null
}
```

- Replace Bucket name in command:

```bash
aws s3 cp ../readme.md s3://cdk2lambdagostack-incoming0b397865-8yyp40jh593s/dummy.txt
```

5) Check DynamoDB entries

```bash
aws dynamodb scan --table-name "items"
```

Output like:
```json
{
    "Items": [
        {
            "itemID": {
                "S": "dummy.txt"
            },
            "time": {
                "S": "2022-10-28 13:37:38.552396449 +0000 UTC m=+0.065920903"
            }
        }
    ],
    "Count": 1,
    "ScannedCount": 1,
    "ConsumedCapacity": null
}
```

6) Destroy

From base directory, using cdk2

```bash
cd infra
cdk destroy
```
