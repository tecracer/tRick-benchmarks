# Implementation cdk if Trick standard serverless architure

See main directory for architecture.

## Tool

| Tool | Purpose | Website | install mac |
| ------:| -----------:|---:|---:|
| task | manage| scripting | https://taskfile.dev | `brew install go-task/tap/go-task` |
| node | language | https://nodejs.org/en/ | download pkg or use nvm
| cdk | CloudFormation compiler | https://docs.aws.amazon.com/cdk/latest/guide/home.html | `npm i cdk -g `|
| awsume | switch profiles | https://awsu.me/ | `pip install awsume` |
| docker | build environment | https://www.docker.com/ | Download&install … https://www.docker.com/get-started |

## Walkthrough

Remark: The `NodejsFunction` had problems with cdk 1.59. That's ok, as it is experimental. But for this purpose of having a running function i switched to the normal, stable lambda package without docker.
This means, you have to compile `/lambda` before deploy cdk.
The `Taskfile` scripts does that for you with `task deploy`.

### Install 

1. Load packages: 

    `npm i`

1. Check whether cdk version is the same as in package.json

    `cdk --version`

    If not, install the new cdk 

    `npm i cdk -g`

1. Switch profile (only needed if you use the task)

    `awsume yourprofilename`


1. Show to be deployed resources (optional)

    `task diff`

    or

    `npm run build && cdk diff`

    This takes some time, because the used typscript construct uses docker with sam to compile in the target linux system for lambda. This is the most comfortable versionm but also the slowest running the first time.

    Take the output (like):

    `CdkLambaStack.LambdaName = CdkLambaStack-fn5FF616E3-1HELHLDT9SNKN` 

    and put the lambda name in `Taskfile.dev, Section vars:`

    `  lambda: CdkLambaStack-fn5FF616E3-1HELHLDT9SNKN`

1. Deploy resources and lambda

    `task deploy`


### Test

1. Define testevent in Lambda Console with s3 put template

1. Start Lambda function with this s3 event

1. Look into dynamodb table "items" for the new item

## Update

1. Change something in function code `lambda\index.ts`  like

    from
    ```js
        let params: AWS.DynamoDB.PutItemInput = {
      Item:
        {
          "itemId": {"S": srcKey},
          "time" : {"N": now.toString()}
        }, 
      TableName: table,
    }
    ```

    to
    ```js
        let params: AWS.DynamoDB.PutItemInput = {
      Item:
        {
          "itemId": {"S": "Key: "+srcKey},
          "time" : {"N": now.toString()}
        }, 
      TableName: table,
    }
    ````

1. Update fast:

    `task deploy-code`

    Takes 10 seconds on my machine. 