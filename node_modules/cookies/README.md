Cookies
=======

[![NPM Version](https://badge.fury.io/js/cookies.svg)](https://badge.fury.io/js/cookies)
[![Build Status](https://travis-ci.org/expressjs/cookies.svg?branch=master)](https://travis-ci.org/expressjs/cookies)

Cookies is a [node.js](http://nodejs.org/) module for getting and setting HTTP(S) cookies. Cookies can be signed to prevent tampering, using [Keygrip](https://github.com/expressjs/keygrip). It can be used with the built-in node.js HTTP library, or as Connect/Express middleware.

## Requirements

* [node.js](http://nodejs.org/), tested with 0.8 and 0.10

## Install

    $ npm install cookies

## Features

* **Lazy**: Since cookie verification against multiple keys could be expensive, cookies are only verified lazily when accessed, not eagerly on each request.

* **Secure**: All cookies are `httponly` by default, and cookies sent over SSL are `secure` by default. An error will be thrown if you try to send secure cookies over an insecure socket.

* **Unobtrusive**: Signed cookies are stored the same way as unsigned cookies, instead of in an obfuscated signing format. An additional signature cookie is stored for each signed cookie, using a standard naming convention (_cookie-name_`.sig`). This allows other libraries to access the original cookies without having to know the signing mechanism.

* **Agnostic**: This library is optimized for use with [Keygrip](https://github.com/expressjs/keygrip), but does not require it; you can implement your own signing scheme instead if you like and use this library only to read/write cookies. Factoring the signing into a separate library encourages code reuse and allows you to use the same signing library for other areas where signing is needed, such as in URLs.

## API

### cookies = new Cookies( request, response, keys )

This creates a cookie jar corresponding to the current _request_ and _response_. A [Keygrip](https://github.com/expressjs/keygrip) object or an array of keys can optionally be passed as the third argument _keygrip_ to enable cryptographic signing based on SHA1 HMAC, using rotated credentials.

Note that since this only saves parameters without any other processing, it is very lightweight. Cookies are only parsed on demand when they are accessed.

### express.createServer( Cookies.express( keys ) )

This adds cookie support as a Connect middleware layer for use in Express apps, allowing inbound cookies to be read using `req.cookies.get` and outbound cookies to be set using `res.cookies.set`.

### cookies.get( name, [ options ] )

This extracts the cookie with the given name from the `Cookie` header in the request. If such a cookie exists, its value is returned. Otherwise, nothing is returned.

`{ signed: true }` can optionally be passed as the second parameter _options_. In this case, a signature cookie (a cookie of same name ending with the `.sig` suffix appended) is fetched. If no such cookie exists, nothing is returned.

If the signature cookie _does_ exist, the provided [Keygrip](https://github.com/expressjs/keygrip) object is used to check whether the hash of _cookie-name_=_cookie-value_ matches that of any registered key:

* If the signature cookie hash matches the first key, the original cookie value is returned.
* If the signature cookie hash matches any other key, the original cookie value is returned AND an outbound header is set to update the signature cookie's value to the hash of the first key. This enables automatic freshening of signature cookies that have become stale due to key rotation.
* If the signature cookie hash does not match any key, nothing is returned, and an outbound header with an expired date is used to delete the cookie.

### cookies.set( name, [ value ], [ options ] )

This sets the given cookie in the response and returns the current context to allow chaining.

If the _value_ is omitted, an outbound header with an expired date is used to delete the cookie.

If the _options_ object is provided, it will be used to generate the outbound cookie header as follows:

* `maxAge`: a number representing the milliseconds from `Date.now()` for expiry
* `expires`: a `Date` object indicating the cookie's expiration date (expires at the end of session by default).
* `path`: a string indicating the path of the cookie (`/` by default).
* `domain`: a string indicating the domain of the cookie (no default).
* `secure`: a boolean indicating whether the cookie is only to be sent over HTTPS (`false` by default for HTTP, `true` by default for HTTPS).
* `secureProxy`: a boolean indicating whether the cookie is only to be sent over HTTPS (use this if you handle SSL not in your node process).
* `httpOnly`: a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (`true` by default).
* `signed`: a boolean indicating whether the cookie is to be signed (`false` by default). If this is true, another cookie of the same name with the `.sig` suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of _cookie-name_=_cookie-value_ against the first [Keygrip](https://github.com/expressjs/keygrip) key. This signature key is used to detect tampering the next time a cookie is received.
* `overwrite`: a boolean indicating whether to overwrite previously set cookies of the same name (`false` by default). If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie.

## Example

```javascript
var http    = require( "http" )
var Cookies = require( "cookies" )

server = http.createServer( function( req, res ) {
  var cookies = new Cookies( req, res, keys )
    , unsigned, signed, tampered

  if ( req.url == "/set" ) {
    cookies
      // set a regular cookie
      .set( "unsigned", "foo", { httpOnly: false } )

      // set a signed cookie
      .set( "signed", "bar", { signed: true } )

      // mimic a signed cookie, but with a bogus signature
      .set( "tampered", "baz" )
      .set( "tampered.sig", "bogus" )

    res.writeHead( 302, { "Location": "/" } )
    return res.end( "Now let's check." )
  }

  unsigned = cookies.get( "unsigned" )
  signed = cookies.get( "signed", { signed: true } )
  tampered = cookies.get( "tampered", { signed: true } )

  assert.equal( unsigned, "foo" )
  assert.equal( signed, "bar" )
  assert.notEqual( tampered, "baz" )
  assert.equal( tampered, undefined )

  res.writeHead( 200, { "Content-Type": "text/plain" } )
  res.end(
    "unsigned expected: foo\n\n" +
    "unsigned actual: " + unsigned + "\n\n" +
    "signed expected: bar\n\n" +
    "signed actual: " + signed + "\n\n" +
    "tampered expected: undefined\n\n"+
    "tampered: " + tampered + "\n\n"
  )
})
```

Copyright
---------

Copyright (c) 2014 Jed Schmidt. See LICENSE.txt for details.

Send any questions or comments [here](http://twitter.com/jedschmidt).
