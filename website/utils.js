const path = require("path");
const fs = require("fs");
const parseYaml = require("js-yaml").safeLoad;

function loadYaml(fsPath) {
  return parseYaml(fs.readFileSync(path.join(__dirname, fsPath), "utf8"));
}

module.exports = {
  loadYaml
};
