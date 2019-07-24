.PHONY: test help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


install: ## First time init
	npm -g install aws-cdk
	cdk bootstrap

init: ## Install npm deps
	npm i

pre_build: ## Run build
	npm run build

build: ## Build Cloudformation
	cdk synth

post_build: ## Show diff
	cdk diff

deploy: ## Deploy
	cdk deploy --require-approval never

remove: ## Remove/destroy (without asking!)
	cdk destroy --force
	
