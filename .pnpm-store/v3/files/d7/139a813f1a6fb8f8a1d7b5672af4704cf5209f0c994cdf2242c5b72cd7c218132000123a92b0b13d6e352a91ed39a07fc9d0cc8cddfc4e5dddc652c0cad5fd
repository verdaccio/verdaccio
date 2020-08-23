.PHONY: test

MOCHA=mocha

all: lunr-mutable.js test

lunr-mutable.js: lib/mutable_builder.js lib/mutable_index.js lib/lunr_mutable.js
	cat preamble $^ postamble > $@

test: lunr-mutable.js
	${MOCHA} test/*.js -u tdd

clean:
	rm lunr-mutable.js
