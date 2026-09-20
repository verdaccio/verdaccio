globalThis.__verdaccioMissingDepEvaluations =
  (globalThis.__verdaccioMissingDepEvaluations || 0) + 1;
require('this-dependency-does-not-exist-xyz');
module.exports = function plugin() {};
