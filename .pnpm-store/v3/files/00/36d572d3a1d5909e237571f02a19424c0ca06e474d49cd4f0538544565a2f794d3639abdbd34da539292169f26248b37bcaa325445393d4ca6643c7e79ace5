'use strict'

const nodePath = require('path')

module.exports = presetLoader(require)
module.exports.presetLoader = presetLoader

function presetLoader (requireMethod) {
  return path => {
    let name = ''
    let scope = ''
    let absolutePath = ''

    if (typeof path === 'string') {
      name = path.toLowerCase()
      if (nodePath.isAbsolute(path)) {
        absolutePath = path
      }
    } else if (typeof path === 'object' && path.name) {
      // Rather than a string preset name, options.preset can be an object
      // with a "name" key indicating the preset to load; additinoal key/value
      // pairs are assumed to be configuration for the preset. See the documentation
      // for a given preset for configuration available.
      name = path.name.toLowerCase()
      if (nodePath.isAbsolute(path.name)) {
        absolutePath = path.name
      }
    } else {
      throw Error('preset must be string or object with key name')
    }

    if (!absolutePath) {
      if (name[0] === '@') {
        const parts = name.split('/')
        scope = parts.shift() + '/'
        name = parts.join('/')
      }

      if (!name.startsWith('conventional-changelog-')) {
        name = `conventional-changelog-${name}`
      }
    }

    try {
      const config = requireMethod(absolutePath || `${scope}${name}`)
      // rather than returning a promise, presets can return a builder function
      // which accepts a config object (allowing for customization) and returns
      // a promise.
      if (config && !config.then && typeof path === 'object') {
        return config(path)
      } else {
        // require returned a promise that resolves to a config object.
        return config
      }
    } catch (_) {
      throw Error('does not exist')
    }
  }
}
