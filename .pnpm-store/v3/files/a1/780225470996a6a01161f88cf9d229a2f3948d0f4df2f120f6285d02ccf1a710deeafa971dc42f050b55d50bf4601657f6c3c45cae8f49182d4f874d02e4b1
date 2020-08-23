"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var fs = require("fs-extra"), path = _interopDefault(require("path")), getPackages = require("@manypkg/get-packages"), errors = require("@changesets/errors");

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter((function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    }))), keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach((function(key) {
      _defineProperty(target, key, source[key]);
    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach((function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    }));
  }
  return target;
}

function _defineProperty(obj, key, value) {
  return key in obj ? Object.defineProperty(obj, key, {
    value: value,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : obj[key] = value, obj;
}

async function readPreState(cwd) {
  let preState, preStatePath = path.resolve(cwd, ".changeset", "pre.json");
  try {
    let contents = await fs.readFile(preStatePath, "utf8");
    try {
      preState = JSON.parse(contents);
    } catch (err) {
      throw err instanceof SyntaxError && console.error("error parsing json:", contents), 
      err;
    }
  } catch (err) {
    if ("ENOENT" !== err.code) throw err;
  }
  return preState;
}

async function exitPre(cwd) {
  let preStatePath = path.resolve(cwd, ".changeset", "pre.json"), preState = await readPreState(cwd);
  if (void 0 === preState) throw new errors.PreExitButNotInPreModeError;
  await fs.writeFile(preStatePath, JSON.stringify(_objectSpread({}, preState, {
    mode: "exit"
  }), null, 2) + "\n");
}

async function enterPre(cwd, tag) {
  let packages = await getPackages.getPackages(cwd), preStatePath = path.resolve(packages.root.dir, ".changeset", "pre.json");
  if (void 0 !== await readPreState(packages.root.dir)) throw new errors.PreEnterButInPreModeError;
  let newPreState = {
    mode: "pre",
    tag: tag,
    initialVersions: {},
    changesets: []
  };
  for (let pkg of packages.packages) newPreState.initialVersions[pkg.packageJson.name] = pkg.packageJson.version;
  await fs.writeFile(preStatePath, JSON.stringify(newPreState, null, 2) + "\n");
}

exports.enterPre = enterPre, exports.exitPre = exitPre, exports.readPreState = readPreState;
