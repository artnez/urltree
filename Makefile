MOCHA=./node_modules/.bin/mocha

test:
	@${MOCHA} test.js

.PHONY: test
