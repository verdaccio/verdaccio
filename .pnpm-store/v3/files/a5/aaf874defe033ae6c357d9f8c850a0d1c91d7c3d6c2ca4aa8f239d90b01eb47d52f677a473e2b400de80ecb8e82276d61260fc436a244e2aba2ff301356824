"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var fs = require("fs-extra"), path = _interopDefault(require("path")), errors = require("@changesets/errors"), logger = require("@changesets/logger"), getDependentsGraph = require("@changesets/get-dependents-graph"), packageJson = {
  name: "@changesets/config",
  version: "1.3.0",
  description: "Utilities for reading and parsing Changeset's config",
  main: "dist/config.cjs.js",
  module: "dist/config.esm.js",
  license: "MIT",
  repository: "https://github.com/changesets/changesets/tree/master/packages/config",
  files: [ "dist", "schema.json" ],
  dependencies: {
    "@changesets/errors": "^0.1.4",
    "@changesets/get-dependents-graph": "^1.1.3",
    "@changesets/logger": "^0.0.5",
    "@changesets/types": "^3.1.0",
    "@manypkg/get-packages": "^1.0.1",
    "fs-extra": "^7.0.1"
  },
  devDependencies: {
    fixturez: "^1.1.0",
    "jest-in-case": "^1.0.2"
  }
};

let defaultWrittenConfig = {
  $schema: `https://unpkg.com/@changesets/config@${packageJson.version}/schema.json`,
  changelog: "@changesets/cli/changelog",
  commit: !1,
  linked: [],
  access: "restricted",
  baseBranch: "master",
  updateInternalDependencies: "patch",
  ignore: []
};

function getNormalisedChangelogOption(thing) {
  return !1 !== thing && ("string" == typeof thing ? [ thing, null ] : thing);
}

let read = async (cwd, packages) => {
  let json = await fs.readJSON(path.join(cwd, ".changeset", "config.json"));
  return parse(json, packages);
}, parse = (json, packages) => {
  let messages = [];
  void 0 === json.changelog || !1 === json.changelog || "string" == typeof json.changelog || Array.isArray(json.changelog) && 2 === json.changelog.length && "string" == typeof json.changelog[0] || messages.push(`The \`changelog\` option is set as ${JSON.stringify(json.changelog, null, 2)} when the only valid values are undefined, a module path(e.g. "@changesets/cli/changelog" or "./some-module") or a tuple with a module path and config for the changelog generator(e.g. ["@changesets/cli/changelog", { someOption: true }])`);
  let normalizedAccess = json.access;
  if ("private" === json.access && (normalizedAccess = "restricted", logger.warn('The `access` option is set as "private", but this is actually not a valid value - the correct form is "restricted".')), 
  void 0 !== normalizedAccess && "restricted" !== normalizedAccess && "public" !== normalizedAccess && messages.push(`The \`access\` option is set as ${JSON.stringify(normalizedAccess, null, 2)} when the only valid values are undefined, "public" or "restricted"`), 
  void 0 !== json.commit && "boolean" != typeof json.commit && messages.push(`The \`commit\` option is set as ${JSON.stringify(json.commit, null, 2)} when the only valid values are undefined or a boolean`), 
  void 0 !== json.baseBranch && "string" != typeof json.baseBranch && messages.push(`The \`baseBranch\` option is set as ${JSON.stringify(json.baseBranch, null, 2)} but the \`baseBranch\` option can only be set as a string`), 
  void 0 !== json.linked) if (Array.isArray(json.linked) && json.linked.every(arr => Array.isArray(arr) && arr.every(pkgName => "string" == typeof pkgName))) {
    let pkgNames = new Set(packages.packages.map(({packageJson: packageJson}) => packageJson.name)), foundPkgNames = new Set, duplicatedPkgNames = new Set;
    for (let linkedGroup of json.linked) for (let linkedPkgName of linkedGroup) pkgNames.has(linkedPkgName) || messages.push(`The package "${linkedPkgName}" is specified in the \`linked\` option but it is not found in the project. You may have misspelled the package name.`), 
    foundPkgNames.has(linkedPkgName) && duplicatedPkgNames.add(linkedPkgName), foundPkgNames.add(linkedPkgName);
    duplicatedPkgNames.size && duplicatedPkgNames.forEach(pkgName => {
      messages.push(`The package "${pkgName}" is in multiple sets of linked packages. Packages can only be in a single set of linked packages.`);
    });
  } else messages.push(`The \`linked\` option is set as ${JSON.stringify(json.linked, null, 2)} when the only valid values are undefined or an array of arrays of package names`);
  if (void 0 === json.updateInternalDependencies || [ "patch", "minor" ].includes(json.updateInternalDependencies) || messages.push(`The \`updateInternalDependencies\` option is set as ${JSON.stringify(json.updateInternalDependencies, null, 2)} but can only be 'patch' or 'minor'`), 
  json.ignore) if (Array.isArray(json.ignore) && json.ignore.every(pkgName => "string" == typeof pkgName)) {
    let pkgNames = new Set(packages.packages.map(({packageJson: packageJson}) => packageJson.name));
    for (let pkgName of json.ignore) pkgNames.has(pkgName) || messages.push(`The package "${pkgName}" is specified in the \`ignore\` option but it is not found in the project. You may have misspelled the package name.`);
    const dependentsGraph = getDependentsGraph.getDependentsGraph(packages);
    for (const ignoredPackage of json.ignore) {
      const dependents = dependentsGraph.get(ignoredPackage) || [];
      for (const dependent of dependents) json.ignore.includes(dependent) || messages.push(`The package "${dependent}" depends on the ignored package "${ignoredPackage}", but "${dependent}" is not being ignored. Please add "${dependent}" to the \`ignore\` option.`);
    }
  } else messages.push(`The \`ignore\` option is set as ${JSON.stringify(json.ignore, null, 2)} when the only valid values are undefined or an array of package names`);
  if (void 0 !== json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH) {
    const {onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange, useCalculatedVersionForSnapshots: useCalculatedVersionForSnapshots} = json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH;
    void 0 !== onlyUpdatePeerDependentsWhenOutOfRange && "boolean" != typeof onlyUpdatePeerDependentsWhenOutOfRange && messages.push(`The \`onlyUpdatePeerDependentsWhenOutOfRange\` option is set as ${JSON.stringify(onlyUpdatePeerDependentsWhenOutOfRange, null, 2)} when the only valid values are undefined or a boolean`), 
    void 0 !== useCalculatedVersionForSnapshots && "boolean" != typeof useCalculatedVersionForSnapshots && messages.push(`The \`useCalculatedVersionForSnapshots\` option is set as ${JSON.stringify(useCalculatedVersionForSnapshots, null, 2)} when the only valid values are undefined or a boolean`);
  }
  if (messages.length) throw new errors.ValidationError("Some errors occurred when validating the changesets config:\n" + messages.join("\n"));
  return {
    changelog: getNormalisedChangelogOption(void 0 === json.changelog ? defaultWrittenConfig.changelog : json.changelog),
    access: void 0 === normalizedAccess ? defaultWrittenConfig.access : normalizedAccess,
    commit: void 0 === json.commit ? defaultWrittenConfig.commit : json.commit,
    linked: void 0 === json.linked ? defaultWrittenConfig.linked : json.linked,
    baseBranch: void 0 === json.baseBranch ? defaultWrittenConfig.baseBranch : json.baseBranch,
    updateInternalDependencies: void 0 === json.updateInternalDependencies ? defaultWrittenConfig.updateInternalDependencies : json.updateInternalDependencies,
    ignore: void 0 === json.ignore ? defaultWrittenConfig.ignore : json.ignore,
    ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
      onlyUpdatePeerDependentsWhenOutOfRange: void 0 !== json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH && void 0 !== json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange && json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange,
      useCalculatedVersionForSnapshots: void 0 !== json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH && void 0 !== json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.useCalculatedVersionForSnapshots && json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.useCalculatedVersionForSnapshots
    }
  };
}, fakePackage = {
  dir: "",
  packageJson: {
    name: "",
    version: ""
  }
}, defaultConfig = parse(defaultWrittenConfig, {
  root: fakePackage,
  tool: "root",
  packages: [ fakePackage ]
});

exports.defaultConfig = defaultConfig, exports.defaultWrittenConfig = defaultWrittenConfig, 
exports.parse = parse, exports.read = read;
