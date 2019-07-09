.PHONY: test help
.DEFAULT_GOAL := help

help:
<<<<<<< HEAD
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

=======
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) |  awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	
init: ## 1) Init terraform
	terraform init

plan: ## 2) plan tf
	terraform plan

apply: ## 3) deploy this stack to your default AWS account/region
	terraform apply

destroy: ## 4) Destroy the stack
	terraform destroy
>>>>>>> Makefiles created
