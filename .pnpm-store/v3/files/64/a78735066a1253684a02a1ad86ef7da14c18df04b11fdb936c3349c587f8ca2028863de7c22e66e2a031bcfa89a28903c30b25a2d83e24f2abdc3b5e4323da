"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var fs = _interopDefault(require("fs-extra")), path = _interopDefault(require("path")), prettier = _interopDefault(require("prettier")), humanId = _interopDefault(require("human-id"));

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

async function writeChangeset(changeset, cwd) {
  const {summary: summary, releases: releases} = changeset, changesetBase = path.resolve(cwd, ".changeset"), changesetID = humanId({
    separator: "-",
    capitalize: !1
  }), prettierConfig = await prettier.resolveConfig(cwd), newChangesetPath = path.resolve(changesetBase, `${changesetID}.md`), changesetContents = `---\n${releases.map(release => `"${release.name}": ${release.type}`).join("\n")}\n---\n\n${summary}\n  `;
  return await fs.writeFile(newChangesetPath, prettier.format(changesetContents, _objectSpread({}, prettierConfig, {
    parser: "markdown"
  }))), changesetID;
}

exports.default = writeChangeset;
