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
cdk deploy
```

4) Test

- Find Name from s3bucket
- Replace Name in command:

```bash
aws s3 cp ../readme.md s3://cdk2lambdagostack-incoming0b397865-1wpb09c9rp9dv/dummy.txt
```

5) Check DynamoDB entries

6) Destroy

From base directory, using cdk2

```bash
cd infra
cdk destroy
```
