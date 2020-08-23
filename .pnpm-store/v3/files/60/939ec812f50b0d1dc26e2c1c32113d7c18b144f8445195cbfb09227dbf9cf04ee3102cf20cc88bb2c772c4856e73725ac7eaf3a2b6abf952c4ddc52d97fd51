declare namespace dargs {
	interface Options {
		/**
		Keys or regex of keys to exclude. Takes precedence over `includes`.
		*/
		excludes?: ReadonlyArray<string | RegExp>;

		/**
		Keys or regex of keys to include.
		*/
		includes?: ReadonlyArray<string | RegExp>;

		/**
		Maps keys in `input` to an aliased name. Matching keys are converted to arguments with a single dash (`-`) in front of the aliased key and the value in a separate array item. Keys are still affected by `includes` and `excludes`.
		*/
		aliases?: {[key: string]: string};

		/**
		Setting this to `false` makes it return the key and value as separate array items instead of using a `=` separator in one item. This can be useful for tools that doesn't support `--foo=bar` style flags.

		@default true

		@example
		```
		import dargs = require('dargs');

		console.log(dargs({foo: 'bar'}, {useEquals: false}));
		// [
		// 	'--foo', 'bar'
		// ]
		```
		*/
		useEquals?: boolean;

		/**
		Make a single character option key `{a: true}` become a short flag `-a` instead of `--a`.

		@default true

		@example
		```
		import dargs = require('dargs');

		console.log(dargs({a: true}));
		//=> ['-a']

		console.log(dargs({a: true}, {shortFlag: false}));
		//=> ['--a']
		```
		*/
		shortFlag?: boolean;

		/**
		Exclude `false` values. Can be useful when dealing with strict argument parsers that throw on unknown arguments like `--no-foo`.

		@default false
		*/
		ignoreFalse?: boolean;

		/**
		By default, camel-cased keys will be hyphenated. Enabling this will bypass the conversion process.

		@default false

		@example
		```
		import dargs = require('dargs');

		console.log(dargs({fooBar: 'baz'}));
		//=> ['--foo-bar', 'baz']

		console.log(dargs({fooBar: 'baz'}, {allowCamelCase: true}));
		//=> ['--fooBar', 'baz']
		```
		*/
		allowCamelCase?: boolean;
	}
}

/**
Reverse [`minimist`](https://github.com/substack/minimist). Convert an object of options into an array of command-line arguments.

@param object - Object to convert to command-line arguments.

@example
```
import dargs = require('dargs');

const input = {
	_: ['some', 'option'],          // Values in '_' will be appended to the end of the generated argument list
	'--': ['separated', 'option'],  // Values in '--' will be put at the very end of the argument list after the escape option (`--`)
	foo: 'bar',
	hello: true,                    // Results in only the key being used
	cake: false,                    // Prepends `no-` before the key
	camelCase: 5,                   // CamelCase is slugged to `camel-case`
	multiple: ['value', 'value2'],  // Converted to multiple arguments
	pieKind: 'cherry',
	sad: ':('
};

const excludes = ['sad', /.*Kind$/];  // Excludes and includes accept regular expressions
const includes = ['camelCase', 'multiple', 'sad', /^pie.+/];
const aliases = {file: 'f'};

console.log(dargs(input, {excludes}));
// [
// 	'--foo=bar',
// 	'--hello',
// 	'--no-cake',
// 	'--camel-case=5',
// 	'--multiple=value',
// 	'--multiple=value2',
// 	'some',
// 	'option',
// 	'--',
// 	'separated',
// 	'option'
// ]

console.log(dargs(input, {excludes, includes}));
// [
// 	'--camel-case=5',
// 	'--multiple=value',
// 	'--multiple=value2'
// ]


console.log(dargs(input, {includes}));
// [
// 	'--camel-case=5',
// 	'--multiple=value',
// 	'--multiple=value2',
// 	'--pie-kind=cherry',
// 	'--sad=:('
// ]


console.log(dargs({
	foo: 'bar',
	hello: true,
	file: 'baz'
}, {aliases}));
// [
// 	'--foo=bar',
// 	'--hello',
// 	'-f', 'baz'
// ]
```
*/
declare function dargs(
	object: {
		'--'?: string[];
		_?: string[];
	} & {[key: string]: string | boolean | number | readonly string[]},
	options?: dargs.Options
): string[];

export = dargs;
