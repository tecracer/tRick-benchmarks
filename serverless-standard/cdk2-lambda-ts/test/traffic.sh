#!/bin/bash
export BUCKET=`aws cloudformation describe-stacks --stack-name lambda-ts --query "Stacks[?StackName == 'lambda-ts'][].Outputs[?OutputKey == 'BucketName'].OutputValue" --output text`
for i in 0 1 2 3 4 5 6 7 8 9 10
do
    for k in 0 1 2 3 4 5 6 7 8 9
    do
        date
        sleep 10
        aws s3 cp readme.md s3://${BUCKET}/go/test-2${i}-${k}
    done
done
