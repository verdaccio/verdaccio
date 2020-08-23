/* global describe, it */
const assert = require('assert')
const Ajv = require('ajv')
const schema = require('../versions/2.0.0/schema.json')
const shared = require('./shared')

describe('v2.0.0', function () {
  shared(schema)

  it('change: hides less useful/common `types` by default', function () {
    schema.properties.types.default.map(function (type) {
      if (!['fix', 'feat'].includes(type.type)) {
        assert(type.hidden === true, `${type.type} is expected to bet hidden`)
      }
    })
  })

  it('addition: should validate a simple `header` configuration', function () {
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const mock = {
      header: '#`changelog`\n\n'
    }
    assert(validate(mock))
  })
})
