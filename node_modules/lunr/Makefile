
SRC = lib/lunr.js \
	lib/utils.js \
	lib/event_emitter.js \
	lib/tokenizer.js \
	lib/pipeline.js \
	lib/vector.js \
	lib/sorted_set.js \
	lib/index.js \
	lib/document_store.js \
	lib/stemmer.js \
	lib/stop_word_filter.js \
	lib/trimmer.js \
	lib/token_store.js \

YEAR = $(shell date +%Y)
VERSION = $(shell cat VERSION)

SERVER_PORT ?= 3000
TEST_PORT ?= 32423

DOX ?= ./node_modules/.bin/dox
DOX_TEMPLATE ?= ./node_modules/.bin/dox-template
NODE ?= /usr/local/bin/node
NPM ?= /usr/local/bin/npm
PHANTOMJS ?= ./node_modules/.bin/phantomjs
UGLIFYJS ?= ./node_modules/.bin/uglifyjs

all: node_modules lunr.js lunr.min.js docs bower.json package.json component.json example

lunr.js: $(SRC)
	cat build/wrapper_start $^ build/wrapper_end | \
	sed "s/@YEAR/${YEAR}/" | \
	sed "s/@VERSION/${VERSION}/" > $@

lunr.min.js: lunr.js
	${UGLIFYJS} --compress --mangle --comments < $< > $@

%.json: build/%.json.template
	cat $< | sed "s/@VERSION/${VERSION}/" > $@

size: lunr.min.js
	@gzip -c lunr.min.js | wc -c

server:
	${NODE} server.js ${SERVER_PORT}

test: node_modules
	@./test/runner.sh ${TEST_PORT}

docs: node_modules
	${DOX} < lunr.js | ${DOX_TEMPLATE} -n lunr.js -r ${VERSION} > docs/index.html

clean:
	rm -f lunr{.min,}.js
	rm *.json
	rm example/example_index.json

reset:
	git checkout lunr.* *.json docs/index.html example/example_index.json

example: lunr.min.js
	${NODE} example/index_builder.js

node_modules: package.json
	${NPM} -s install

.PHONY: test clean docs reset example
