SHELL := bash

.default: build

.PHONY: build
build: node_modules
ifeq ($(CI), true)
	npx tsc -p tsconfig.build.json
else
	npx tsc -p .
endif

.PHONY: clean
clean:
	rm -rf dist

node_modules: package.json package-lock.json
ifeq ($(CI), true)
	npm ci
else
	npm install
endif

.PHONY: test
test:
	npx jest $(TEST_ARGS)

.PHONY: test-watch
test-watch:
	$(MAKE) test TEST_ARGS=--watch

.PHONY: lint
lint:
	npx eslint -c .eslintrc.js .

.PHONY: lint-fix
lint-fix:
	npx eslint --fix -c .eslintrc.js .


