# CDK2 with python lambda

Deployment with docker


1) Start docker

    On Mac: 

    ```bash
    open -a docker
    ```

2) Deploy Lambda/Create Dynamodb

    From base directory, using cdk2

    ```bash
    npm i
    cdk deploy --require-approval never
    ```


3) Test

- Check Dynamoddb entries - should be zero

```bash
aws dynamodb scan --table-name "Cdk2LambdaPythonStack-items07D08F4B-1DPGZZKU2TBR1"
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
aws s3 cp ../readme.md s3://cdk2lambdapythonstack-incominggov27c7b0bad-19uswqghifalt/dummy.txt
```

4) Check DynamoDB entries

```bash
aws dynamodb scan --table-name "Cdk2LambdaPythonStack-items07D08F4B-1DPGZZKU2TBR1"
```


## X-Ray Test

Call `test/traffic.sh` to create traffic.
With these calls you can analyze the X.Ray traces.