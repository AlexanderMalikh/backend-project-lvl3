#Makefile

install:
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint .

test:
	DEBUG=tests npm test

.PHONY: test