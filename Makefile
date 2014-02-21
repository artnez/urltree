MOCHA=./node_modules/.bin/mocha test.js

test:
	@${MOCHA} test.js

.PHONY: test
