'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs-extra');
var fs__default = _interopDefault(fs);
var path = _interopDefault(require('path'));
var parse = _interopDefault(require('@changesets/parse'));
var git = require('@changesets/git');
var chalk = _interopDefault(require('chalk'));
var pFilter = _interopDefault(require('p-filter'));
var logger = require('@changesets/logger');

let importantSeparator = chalk.red("===============================IMPORTANT!===============================");
let importantEnd = chalk.red("----------------------------------------------------------------------");

async function getOldChangesets(changesetBase, dirs) {
  // this needs to support just not dealing with dirs that aren't set up properly
  let changesets = await pFilter(dirs, async dir => (await fs.lstat(path.join(changesetBase, dir))).isDirectory());
  const changesetContents = changesets.map(async changesetDir => {
    const jsonPath = path.join(changesetBase, changesetDir, "changes.json");
    const [summary, json] = await Promise.all([fs.readFile(path.join(changesetBase, changesetDir, "changes.md"), "utf-8"), fs.readJson(jsonPath)]);
    return {
      releases: json.releases,
      summary,
      id: changesetDir
    };
  });
  return Promise.all(changesetContents);
} // this function only exists while we wait for v1 changesets to be obsoleted
// and should be deleted before v3


async function getOldChangesetsAndWarn(changesetBase, dirs) {
  let oldChangesets = await getOldChangesets(changesetBase, dirs);

  if (oldChangesets.length === 0) {
    return [];
  }

  logger.warn(importantSeparator);
  logger.warn("There were old changesets from version 1 found");
  logger.warn("Theses are being applied now but the dependents graph may have changed");
  logger.warn("Make sure you validate all your dependencies");
  logger.warn("In a future major version, we will no longer apply these old changesets, and will instead throw here");
  logger.warn(importantEnd);
  return oldChangesets;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function filterChangesetsSinceRef(changesets, changesetBase, sinceRef) {
  const newChangesets = await git.getChangedChangesetFilesSinceRef({
    cwd: changesetBase,
    ref: sinceRef
  });
  const newHahses = newChangesets.map(c => c.split("/")[1]);
  return changesets.filter(dir => newHahses.includes(dir));
}

async function getChangesets(cwd, sinceRef) {
  let changesetBase = path.join(cwd, ".changeset");
  let contents;

  try {
    contents = await fs__default.readdir(changesetBase);
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error("There is no .changeset directory in this project");
    }

    throw err;
  }

  if (sinceRef !== undefined) {
    contents = await filterChangesetsSinceRef(contents, changesetBase, sinceRef);
  }

  let oldChangesetsPromise = getOldChangesetsAndWarn(changesetBase, contents);
  let changesets = contents.filter(file => file.endsWith(".md") && file !== "README.md");
  const changesetContents = changesets.map(async file => {
    const changeset = await fs__default.readFile(path.join(changesetBase, file), "utf-8");
    return _objectSpread({}, parse(changeset), {
      id: file.replace(".md", "")
    });
  });
  return [...(await oldChangesetsPromise), ...(await Promise.all(changesetContents))];
}

exports.default = getChangesets;
