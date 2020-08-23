'use strict'

const Q = require(`q`)

module.exports = presetResolver

function presetResolver (presetPackage) {
  // start the chain as a Q.Promise
  return Q.resolve().then(() => {
    // handle traditional node-style callbacks
    if (typeof presetPackage === `function`) {
      return Q.nfcall(presetPackage)
    }

    // handle object literal or Promise instance
    if (typeof presetPackage === `object`) {
      return Q(presetPackage)
    }

    throw new Error(`preset package must be a promise, function, or object`)
  })
}
