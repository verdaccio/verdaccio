"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var fs = require("fs-extra"), fs__default = _interopDefault(fs), path = _interopDefault(require("path")), parse = _interopDefault(require("@changesets/parse")), git = require("@changesets/git"), chalk = _interopDefault(require("chalk")), pFilter = _interopDefault(require("p-filter")), logger = require("@changesets/logger");

let importantSeparator = chalk.red("===============================IMPORTANT!==============================="), importantEnd = chalk.red("----------------------------------------------------------------------");

async function getOldChangesets(changesetBase, dirs) {
  const changesetContents = (await pFilter(dirs, async dir => (await fs.lstat(path.join(changesetBase, dir))).isDirectory())).map(async changesetDir => {
    const jsonPath = path.join(changesetBase, changesetDir, "changes.json"), [summary, json] = await Promise.all([ fs.readFile(path.join(changesetBase, changesetDir, "changes.md"), "utf-8"), fs.readJson(jsonPath) ]);
    return {
      releases: json.releases,
      summary: summary,
      id: changesetDir
    };
  });
  return Promise.all(changesetContents);
}

async function getOldChangesetsAndWarn(changesetBase, dirs) {
  let oldChangesets = await getOldChangesets(changesetBase, dirs);
  return 0 === oldChangesets.length ? [] : (logger.warn(importantSeparator), logger.warn("There were old changesets from version 1 found"), 
  logger.warn("Theses are being applied now but the dependents graph may have changed"), 
  logger.warn("Make sure you validate all your dependencies"), logger.warn("In a future major version, we will no longer apply these old changesets, and will instead throw here"), 
  logger.warn(importantEnd), oldChangesets);
}

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

async function filterChangesetsSinceRef(changesets, changesetBase, sinceRef) {
  const newHahses = (await git.getChangedChangesetFilesSinceRef({
    cwd: changesetBase,
    ref: sinceRef
  })).map(c => c.split("/")[1]);
  return changesets.filter(dir => newHahses.includes(dir));
}

async function getChangesets(cwd, sinceRef) {
  let contents, changesetBase = path.join(cwd, ".changeset");
  try {
    contents = await fs__default.readdir(changesetBase);
  } catch (err) {
    if ("ENOENT" === err.code) throw new Error("There is no .changeset directory in this project");
    throw err;
  }
  void 0 !== sinceRef && (contents = await filterChangesetsSinceRef(contents, changesetBase, sinceRef));
  let oldChangesetsPromise = getOldChangesetsAndWarn(changesetBase, contents);
  const changesetContents = contents.filter(file => file.endsWith(".md") && "README.md" !== file).map(async file => {
    const changeset = await fs__default.readFile(path.join(changesetBase, file), "utf-8");
    return _objectSpread({}, parse(changeset), {
      id: file.replace(".md", "")
    });
  });
  return [ ...await oldChangesetsPromise, ...await Promise.all(changesetContents) ];
}

exports.default = getChangesets;
