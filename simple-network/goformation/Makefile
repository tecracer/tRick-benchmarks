.PHONY: test help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'



init: ## First time init
	mkdir bin

build: ## build binary for current os
	export GO111MODULE=on & go build -o bin/generate main.go 

run: ## just runs
	go run  main.go 
