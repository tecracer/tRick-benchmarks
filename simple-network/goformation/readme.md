# Go trick

## Additional tools

This module uses clouds-aws to deploy the template. It is installed via `pip install clouds-aws`.

With `make help`you get the possible commands.

1) `make run` - build and generate the CloudFormation template
1) `make deploy` - deploy the CloudFormation template, fixed region **eu-central-1**

## Go 1.11 modules

1) Add import comment

```go
package main // import "goformation"
```

2) inside `src` : `go mod init`