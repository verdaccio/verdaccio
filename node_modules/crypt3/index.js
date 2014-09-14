/** Node.js Crypt(3) Library */

var salters = {
	'md5': function() { return '$1$'+require('crypto').randomBytes(10).toString('base64'); },
	'blowfish': function() { return '$2a$'+require('crypto').randomBytes(10).toString('base64'); },
	'sha256': function() { return '$5$'+require('crypto').randomBytes(10).toString('base64'); },
	'sha512': function() { return '$6$'+require('crypto').randomBytes(10).toString('base64'); }
};

function createSalt(type) {
	type = type || 'sha512';
	if(!salters[type]) throw new TypeError('Unknown salt type at crypt3.createSalt: ' + type);
	return salters[type]();
};

/** Crypt(3) password and data encryption.
 * @param {string} key user's typed password
 * @param {string} salt Optional salt, for example SHA-512 use "$6$salt$".
 * @returns {string} A generated hash in format $id$salt$encrypted
 * @see https://en.wikipedia.org/wiki/Crypt_(C)
 */
var crypt3 = module.exports = function(key, salt) {
	salt = salt || createSalt();
	return require('./build/Release/crypt3').crypt(key, salt);
};

/** Create salt 
 * @param {string} type The type of salt: md5, blowfish (only some linux distros), sha256 or sha512. Default is sha512.
 * @returns {string} Generated salt string
 */
crypt3.createSalt = createSalt;

/* EOF */
