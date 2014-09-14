node-crypt3
===========

[crypt3link]: https://en.wikipedia.org/wiki/Crypt_(C) "crypt() in C"

[crypt(3)][crypt3link] for Node.js

Installation
------------

Install using `npm install crypt3` and use:

```javascript
var crypt = require('crypt3');
```

Example password check
----------------------

```javascript
if( crypt('6Xz7sS6fEmnWScMb6Ayf363e5cdqF4Kh', '$1$SrkubyRm$DEQU3KupUxt4yfhbK1HyV/') !== '$1$SrkubyRm$DEQU3KupUxt4yfhbK1HyV/' ) {
	console.error('Access denied!');
	return;
}
```

Example password encoding
-------------------------

Use `crypt(key[, salt])`:

```javascript
console.log( crypt('6Xz7sS6fEmnWScMb6Ayf363e5cdqF4Kh') );                                   // Salt generated automatically using default SHA512
console.log( crypt('6Xz7sS6fEmnWScMb6Ayf363e5cdqF4Kh', crypt.createSalt('md5') ) );         // MD5 salt
console.log( crypt('6Xz7sS6fEmnWScMb6Ayf363e5cdqF4Kh', crypt.createSalt('blowfish') ) );    // Blowfish salt (only some Linux distros)
console.log( crypt('6Xz7sS6fEmnWScMb6Ayf363e5cdqF4Kh', crypt.createSalt('sha256') ) );      // SHA-256
console.log( crypt('6Xz7sS6fEmnWScMb6Ayf363e5cdqF4Kh', crypt.createSalt('sha512') ) );      // SHA-512
```

Create hashes
-------------

Use `crypt.createSalt([type=sha512])` where type is one of `md5`, `blowfish`, `sha256` or `sha512` (default). 
