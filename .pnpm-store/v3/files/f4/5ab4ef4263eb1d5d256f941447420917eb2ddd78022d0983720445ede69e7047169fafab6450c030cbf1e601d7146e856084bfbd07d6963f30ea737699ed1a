/* eslint-env mocha */

const assert = require('assert')
const loadYamlFile = require('./')

describe('load-yaml-file', () => {
  it('loadYamlFile()', () => {
    return loadYamlFile('foo.yml').then(data => {
      assert.deepStrictEqual(data, { foo: true })
    })
  })

  it('loadYamlFile.sync()', () => {
    const data = loadYamlFile.sync('foo.yml')
    assert.deepStrictEqual(data, { foo: true })
  })
})
