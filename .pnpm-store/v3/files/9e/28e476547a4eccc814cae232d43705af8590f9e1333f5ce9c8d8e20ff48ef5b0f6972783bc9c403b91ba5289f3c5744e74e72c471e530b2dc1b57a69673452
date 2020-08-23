'use strict';
const path = require('path');
const buildParserOptions = require('minimist-options');
const yargs = require('yargs-parser');
const camelCase = require('camelcase');
const camelcaseKeys = require('camelcase-keys');
const decamelizeKeys = require('decamelize-keys');
const trimNewlines = require('trim-newlines');
const redent = require('redent');
const readPkgUp = require('read-pkg-up');
const hardRejection = require('hard-rejection');
const normalizePackageData = require('normalize-package-data');
const arrify = require('arrify');

// Prevent caching of this module so module.parent is always accurate
delete require.cache[__filename];
const parentDir = path.dirname(module.parent.filename);

const isFlagMissing = (flagName, definedFlags, receivedFlags, input) => {
	const flag = definedFlags[flagName];
	let isFlagRequired = true;

	if (typeof flag.isRequired === 'function') {
		isFlagRequired = flag.isRequired(receivedFlags, input);
		if (typeof isFlagRequired !== 'boolean') {
			throw new TypeError(`Return value for isRequired callback should be of type boolean, but ${typeof isFlagRequired} was returned.`);
		}
	}

	if (typeof receivedFlags[flagName] === 'undefined') {
		return isFlagRequired;
	}

	return flag.isMultiple && receivedFlags[flagName].length === 0;
};

const getMissingRequiredFlags = (flags, receivedFlags, input) => {
	const missingRequiredFlags = [];
	if (typeof flags === 'undefined') {
		return [];
	}

	for (const flagName of Object.keys(flags)) {
		if (flags[flagName].isRequired && isFlagMissing(flagName, flags, receivedFlags, input)) {
			missingRequiredFlags.push({key: flagName, ...flags[flagName]});
		}
	}

	return missingRequiredFlags;
};

const reportMissingRequiredFlags = missingRequiredFlags => {
	console.error(`Missing required flag${missingRequiredFlags.length > 1 ? 's' : ''}`);
	for (const flag of missingRequiredFlags) {
		console.error(`\t--${flag.key}${flag.alias ? `, -${flag.alias}` : ''}`);
	}
};

const buildParserFlags = ({flags, booleanDefault}) =>
	Object.entries(flags).reduce((parserFlags, [flagKey, flagValue]) => {
		const flag = {...flagValue};

		if (
			typeof booleanDefault !== 'undefined' &&
			flag.type === 'boolean' &&
			!Object.prototype.hasOwnProperty.call(flag, 'default')
		) {
			flag.default = flag.isMultiple ? [booleanDefault] : booleanDefault;
		}

		if (flag.isMultiple) {
			flag.type = 'array';
			delete flag.isMultiple;
		}

		parserFlags[flagKey] = flag;

		return parserFlags;
	}, {});

/**
Convert to alternative syntax for coercing values to expected type, according to https://github.com/yargs/yargs-parser#requireyargs-parserargs-opts.
*/
const convertToTypedArrayOption = (arrayOption, flags) =>
	arrify(arrayOption).map(flagKey => ({
		key: flagKey,
		[flags[camelCase(flagKey, '-')].type || 'string']: true
	}));

const validateFlags = (flags, options) => {
	for (const [flagKey, flagValue] of Object.entries(options.flags)) {
		if (flagKey !== '--' && !flagValue.isMultiple && Array.isArray(flags[flagKey])) {
			throw new Error(`The flag --${flagKey} can only be set once.`);
		}
	}
};

const meow = (helpText, options) => {
	if (typeof helpText !== 'string') {
		options = helpText;
		helpText = '';
	}

	options = {
		pkg: readPkgUp.sync({
			cwd: parentDir,
			normalize: false
		}).packageJson || {},
		argv: process.argv.slice(2),
		flags: {},
		inferType: false,
		input: 'string',
		help: helpText,
		autoHelp: true,
		autoVersion: true,
		booleanDefault: false,
		hardRejection: true,
		...options
	};

	if (options.hardRejection) {
		hardRejection();
	}

	let parserOptions = {
		arguments: options.input,
		...buildParserFlags(options)
	};

	parserOptions = decamelizeKeys(parserOptions, '-', {exclude: ['stopEarly', '--']});

	if (options.inferType) {
		delete parserOptions.arguments;
	}

	parserOptions = buildParserOptions(parserOptions);

	if (parserOptions['--']) {
		parserOptions.configuration = {
			...parserOptions.configuration,
			'populate--': true
		};
	}

	if (parserOptions.array !== undefined) {
		// `yargs` supports 'string|number|boolean' arrays,
		// but `minimist-options` only support 'string' as element type.
		// Open issue to add support to `minimist-options`: https://github.com/vadimdemedes/minimist-options/issues/18.
		parserOptions.array = convertToTypedArrayOption(parserOptions.array, options.flags);
	}

	const {pkg} = options;
	const argv = yargs(options.argv, parserOptions);
	let help = redent(trimNewlines((options.help || '').replace(/\t+\n*$/, '')), 2);

	normalizePackageData(pkg);

	process.title = pkg.bin ? Object.keys(pkg.bin)[0] : pkg.name;

	let {description} = options;
	if (!description && description !== false) {
		({description} = pkg);
	}

	help = (description ? `\n  ${description}\n` : '') + (help ? `\n${help}\n` : '\n');

	const showHelp = code => {
		console.log(help);
		process.exit(typeof code === 'number' ? code : 2);
	};

	const showVersion = () => {
		console.log(typeof options.version === 'string' ? options.version : pkg.version);
		process.exit();
	};

	if (argv._.length === 0 && options.argv.length === 1) {
		if (argv.version === true && options.autoVersion) {
			showVersion();
		}

		if (argv.help === true && options.autoHelp) {
			showHelp(0);
		}
	}

	const input = argv._;
	delete argv._;

	const flags = camelcaseKeys(argv, {exclude: ['--', /^\w$/]});
	const unnormalizedFlags = {...flags};

	validateFlags(flags, options);

	for (const flagValue of Object.values(options.flags)) {
		delete flags[flagValue.alias];
	}

	// Get a list of missing flags that are required
	const missingRequiredFlags = getMissingRequiredFlags(options.flags, flags, input);

	// Print error message for missing flags that are required
	if (missingRequiredFlags.length > 0) {
		reportMissingRequiredFlags(missingRequiredFlags);
		process.exit(2);
	}

	return {
		input,
		flags,
		unnormalizedFlags,
		pkg,
		help,
		showHelp,
		showVersion
	};
};

module.exports = meow;
