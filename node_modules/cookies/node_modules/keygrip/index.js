var crypto = require("crypto")
  
function Keygrip(keys, algorithm, encoding) {
  if (!algorithm) algorithm = "sha1";
  if (!encoding) encoding = "base64";
  if (!(this instanceof Keygrip)) return new Keygrip(keys, algorithm, encoding)

  if (!keys || !(0 in keys)) {
    throw new Error("Keys must be provided.")
  }

  function sign(data, key) {
    return crypto
      .createHmac(algorithm, key)
      .update(data).digest(encoding)
      .replace(/\/|\+|=/g, function(x) {
        return ({ "/": "_", "+": "-", "=": "" })[x]
      })
  }

  this.sign = function(data){ return sign(data, keys[0]) }

  this.verify = function(data, digest) {
    return this.index(data, digest) > -1
  }

  this.index = function(data, digest) {
    for (var i = 0, l = keys.length; i < l; i++) {
      if (constantTimeCompare(digest, sign(data, keys[i]))) return i
    }

    return -1
  }
}

Keygrip.sign = Keygrip.verify = Keygrip.index = function() {
  throw new Error("Usage: require('keygrip')(<array-of-keys>)")
}

//http://codahale.com/a-lesson-in-timing-attacks/
var constantTimeCompare = function(val1, val2){
    if(val1 == null && val2 != null){
        return false;
    } else if(val2 == null && val1 != null){
        return false;
    } else if(val1 == null && val2 == null){
        return true;
    }

    if(val1.length !== val2.length){
        return false;
    }

    var matches = 1;

    for(var i = 0; i < val1.length; i++){
        matches &= (val1.charAt(i) === val2.charAt(i) ? 1 : 0); //Don't short circuit
    }

    return matches === 1;
};

module.exports = Keygrip
