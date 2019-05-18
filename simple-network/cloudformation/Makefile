.PHONY: test help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

stack=vpc-simple

init: 


pre_build: 

build: 

post_build:

deploy: ## Deploy Stack
	aws cloudformation create-stack --stack-name $(stack) --template-body file://template.json --region eu-central-1
	aws cloudformation wait stack-create-complete --stack-name $(stack) --region eu-central-1

remove: ## Remove Stack
	export id=`aws cloudformation describe-stacks --stack-name vpc-simple --query "Stacks[0].StackId" --output text` && \
	aws cloudformation delete-stack --stack-name $(stack) --region eu-central-1 && \
	aws cloudformation wait stack-delete-complete --stack-name ${id} --region eu-central-1

	
