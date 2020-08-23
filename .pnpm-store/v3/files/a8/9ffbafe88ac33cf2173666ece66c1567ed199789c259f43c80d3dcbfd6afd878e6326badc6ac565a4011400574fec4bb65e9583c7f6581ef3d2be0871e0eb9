'use strict'

module.exports = state

function state (o) {
  const {
    secret,
    censor,
    isCensorFct,
    compileRestore,
    serialize,
    groupRedact,
    nestedRedact,
    wildcards,
    wcLen
  } = o
  const builder = [{ secret, censor, isCensorFct, compileRestore }]
  builder.push({ secret })
  if (serialize !== false) builder.push({ serialize })
  if (wcLen > 0) builder.push({ groupRedact, nestedRedact, wildcards, wcLen })
  return Object.assign(...builder)
}
