'use strict'

module.exports = {
  groupRedact,
  groupRestore,
  nestedRedact,
  nestedRestore
}

function groupRestore ({ keys, values, target }) {
  if (target == null) return
  const length = keys.length
  for (var i = 0; i < length; i++) {
    const k = keys[i]
    target[k] = values[i]
  }
}

function groupRedact (o, path, censor, isCensorFct) {
  const target = get(o, path)
  if (target == null) return { keys: null, values: null, target: null, flat: true }
  const keys = Object.keys(target)
  const length = keys.length
  const values = new Array(length)
  for (var i = 0; i < length; i++) {
    const k = keys[i]
    values[i] = target[k]
    target[k] = isCensorFct ? censor(target[k]) : censor
  }
  return { keys, values, target, flat: true }
}

function nestedRestore (arr) {
  const length = arr.length
  for (var i = 0; i < length; i++) {
    const { key, target, value } = arr[i]
    target[key] = value
  }
}

function nestedRedact (store, o, path, ns, censor, isCensorFct) {
  const target = get(o, path)
  if (target == null) return
  const keys = Object.keys(target)
  const length = keys.length
  for (var i = 0; i < length; i++) {
    const key = keys[i]
    const { value, parent, exists } = specialSet(target, key, ns, censor, isCensorFct)

    if (exists === true && parent !== null) {
      store.push({ key: ns[ns.length - 1], target: parent, value })
    }
  }
  return store
}

function has (obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function specialSet (o, k, p, v, f) {
  var i = -1
  var l = p.length
  var li = l - 1
  var n
  var nv
  var ov
  var oov = null
  var exists = true
  ov = n = o[k]
  if (typeof n !== 'object') return { value: null, parent: null, exists }
  while (n != null && ++i < l) {
    k = p[i]
    oov = ov
    if (!(k in n)) {
      exists = false
      break
    }
    ov = n[k]
    nv = f ? v(ov) : v
    nv = (i !== li) ? ov : nv
    n[k] = (has(n, k) && nv === ov) || (nv === undefined && v !== undefined) ? n[k] : nv
    n = n[k]
    if (typeof n !== 'object') break
  }
  return { value: ov, parent: oov, exists }
}
function get (o, p) {
  var i = -1
  var l = p.length
  var n = o
  while (n != null && ++i < l) {
    n = n[p[i]]
  }
  return n
}
