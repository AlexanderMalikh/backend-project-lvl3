#Makefile

install:
	npm link

publish:
	npm publish --dry-run

lint:
	npx eslint .

test:
	npm test

.PHONY: test