.PHONY: test help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

stack = trickvpc

init: ## First time init
	npm install


pre_build: ## build binary for current os
	echo "name: simple-network" > Pulumi.yaml
	echo "runtime: nodejs" >> Pulumi.yaml
	
build:  ## generate
	pulumi stack select megaproaktiv/simple-network/simplevpc
	pulumi config refresh

deploy: ## Deploy generated Cloudformation
	pulumi up --yes

remove: ## Delete generated Cloudformation
	pulumi destroy -s megaproaktiv/simple-network/simplevpc -y
	pulumi stack rm megaproaktiv/simple-network/simplevpc -y --force
