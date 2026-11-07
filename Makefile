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
lint: node_modules
	npx biome lint .

.PHONY: lint-fix
lint-fix: node_modules
	npx biome lint --write .

.PHONY: format
format: node_modules
	npx biome format --write .

.PHONY: format-check
format-check: node_modules
	npx biome format .
