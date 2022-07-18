
empty :=

IMAGE_REGISTRY := dockerhub.dev.data.qingcloud.link
IMAGE_TAG := $(empty)

ifeq ($(IMAGE_TAG),$(empty))
	IMAGE_TAG:=`git branch --show-current|sed 's/\//-/g'`
endif


.PHONY: help
help: ## This help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_%-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)


.PHONY: build-image
build-image:  ## build dataomnis-console image
	@echo "build $(IMAGE_REGISTRY)/dataomnis/console:$(IMAGE_TAG) .."
	@docker build -t  $(IMAGE_REGISTRY)/dataomnis/console:$(IMAGE_TAG) -f ./docker/Dockerfile .
	@echo "build $(IMAGE_REGISTRY)/dataomnis/console:$(IMAGE_TAG) done."


.PHONY: push-image
push-image:  ## push dataomnis-console image
	@echo "push $(IMAGE_REGISTRY)/dataomnis/console:$(IMAGE_TAG) .."
	@docker push $(IMAGE_REGISTRY)/dataomnis/console:$(IMAGE_TAG)
	@echo "push $(IMAGE_REGISTRY)/dataomnis/console:$(IMAGE_TAG) done."