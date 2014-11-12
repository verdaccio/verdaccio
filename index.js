require('es6-shim')
module.exports = require('./lib')

/**package
{ "name": "sinopia",
  "version": "0.0.0",
  "dependencies": {"js-yaml": "*"},
  "scripts": {"postinstall": "js-yaml package.yaml > package.json ; npm install"}
}
**/
