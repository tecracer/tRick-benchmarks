.PHONY: test help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

stack = trickvpc

init: ## First time init
	terraform init

pre_build: ## build binary for current os
	
build:  ## generate
	terraform plan 

deploy: ## Deploy generated Cloudformation
	terraform apply -auto-approve

remove: ## Delete generated Cloudformation
	terraform destroy  -auto-approve

