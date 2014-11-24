"use strict";

// ./test.js
var assert = require("assert")
  , Keygrip = require("./")
  , keylist, keys, hash, index

// keygrip takes an array of keys. If missing or empty, it will throw.
assert.throws(function() {
	keys = new Keygrip(/* empty list */);
}, /must be provided/);

// Randomly generated key - don't use this for something real. Don't be that person.
keys = new Keygrip(['06ae66fdc6c2faf5a401b70e0bf885cb']);  

// .sign returns the hash for the first key
// all hashes are SHA1 HMACs in url-safe base64
hash = keys.sign("bieberschnitzel")
assert.ok(/^[\w\-]{27}$/.test(hash))


// but we're going to use our list.
// (note that the 'new' operator is optional)
keylist = ["SEKRIT3", "SEKRIT2", "SEKRIT1"] // keylist will be modified in place, so don't reuse
keys = Keygrip(keylist)
testKeygripInstance(keys);


// now pass in a different hmac algorithm and encoding
keylist = ["Newest", "AnotherKey", "Oldest"]
keys = Keygrip(keylist, "sha256", "hex")
testKeygripInstance(keys);



function testKeygripInstance(keys) {
	hash = keys.sign("bieberschnitzel")
	
	// .index returns the index of the first matching key
	index = keys.index("bieberschnitzel", hash)
	assert.equal(index, 0)
	
	// .verify returns the a boolean indicating a matched key
	var matched = keys.verify("bieberschnitzel", hash)
	assert.ok(matched)
	
	index = keys.index("bieberschnitzel", "o_O")
	assert.equal(index, -1)
	
	// rotate a new key in, and an old key out
	keylist.unshift("SEKRIT4")
	keylist.pop()
	
	// if index > 0, it's time to re-sign
	index = keys.index("bieberschnitzel", hash)
	assert.equal(index, 1)
	hash = keys.sign("bieberschnitzel")	
}