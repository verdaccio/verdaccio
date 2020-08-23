"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var assembleReleasePlan = _interopDefault(require("@changesets/assemble-release-plan")), readChangesets = _interopDefault(require("@changesets/read")), config = require("@changesets/config"), getPackages = require("@manypkg/get-packages"), pre = require("@changesets/pre");

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

async function getReleasePlan(cwd, sinceRef, passedConfig) {
  const packages = await getPackages.getPackages(cwd), preState = await pre.readPreState(cwd), readConfig = await config.read(cwd, packages), config$1 = passedConfig ? _objectSpread({}, readConfig, {}, passedConfig) : readConfig, changesets = await readChangesets(cwd, sinceRef);
  return assembleReleasePlan(changesets, packages, config$1, preState);
}

exports.default = getReleasePlan;
