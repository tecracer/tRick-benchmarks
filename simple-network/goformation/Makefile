.PHONY: test help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

stack = trickvpc

init: ## First time init
	mkdir bin
	cd src && export GO111MODULE=on && go mod init 

build: ## build binary for current os
	cd src && export GO111MODULE=on && go build -o ../bin/generate main.go 

run: build ## generate
	bin/generate >stacks/$(stack)/template.json

runlight:  ## just generate w/o build
	bin/generate >stacks/$(stack)/template.json



deploy: build run ## Deploy generated Cloudformation
		clouds -r eu-central-1 update   -c --events $(stack)

delete: ## Delete generated Cloudformation
		clouds -r eu-central-1 delete   -f --events $(stack)

