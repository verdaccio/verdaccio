"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var semver = require("semver"), semver__default = _interopDefault(semver), errors = require("@changesets/errors"), getDependentsGraph = require("@changesets/get-dependents-graph");

function incrementVersion(release, preInfo) {
  if ("none" === release.type) return release.oldVersion;
  let version = semver.inc(release.oldVersion, release.type);
  if (void 0 !== preInfo && "exit" !== preInfo.state.mode) {
    let preVersion = preInfo.preVersions.get(release.name);
    if (void 0 === preVersion) throw new errors.InternalError(`preVersion for ${release.name} does not exist when preState is defined`);
    version += `-${preInfo.state.tag}.${preVersion}`;
  }
  return version;
}

function getDependents({releases: releases, packagesByName: packagesByName, dependencyGraph: dependencyGraph, preInfo: preInfo, ignoredPackages: ignoredPackages, onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange}) {
  let updated = !1, pkgsToSearch = [ ...releases.values() ];
  for (;pkgsToSearch.length > 0; ) {
    const nextRelease = pkgsToSearch.shift();
    if (!nextRelease) continue;
    const pkgDependents = dependencyGraph.get(nextRelease.name);
    if (!pkgDependents) throw new Error(`Error in determining dependents - could not find package in repository: ${nextRelease.name}`);
    pkgDependents.map(dependent => {
      let type;
      const dependentPackage = packagesByName.get(dependent);
      if (!dependentPackage) throw new Error("Dependency map is incorrect");
      const {depTypes: depTypes, versionRange: versionRange} = getDependencyVersionRange(dependentPackage.packageJson, nextRelease.name);
      return ignoredPackages.includes(dependent) ? type = "none" : !depTypes.includes("peerDependencies") || "patch" === nextRelease.type || onlyUpdatePeerDependentsWhenOutOfRange && semver__default.satisfies(incrementVersion(nextRelease, preInfo), versionRange) || releases.has(dependent) && (!releases.has(dependent) || "major" === releases.get(dependent).type) ? releases.has(dependent) && "none" !== releases.get(dependent).type || semver__default.satisfies(incrementVersion(nextRelease, preInfo), versionRange) || (type = depTypes.includes("dependencies") || depTypes.includes("optionalDependencies") || depTypes.includes("peerDependencies") ? "patch" : "none") : type = "major", 
      releases.has(dependent) && releases.get(dependent).type === type && (type = void 0), 
      {
        name: dependent,
        type: type,
        pkgJSON: dependentPackage.packageJson
      };
    }).filter(({type: type}) => type).forEach(({name: name, type: type, pkgJSON: pkgJSON}) => {
      updated = !0;
      const existing = releases.get(name);
      if (existing && "major" === type && "major" !== existing.type) existing.type = "major", 
      pkgsToSearch.push(existing); else {
        let newDependent = {
          name: name,
          type: type,
          oldVersion: pkgJSON.version,
          changesets: []
        };
        pkgsToSearch.push(newDependent), releases.set(name, newDependent);
      }
    });
  }
  return updated;
}

function getDependencyVersionRange(dependentPkgJSON, dependencyName) {
  const DEPENDENCY_TYPES = [ "dependencies", "devDependencies", "peerDependencies", "optionalDependencies" ], dependencyVersionRange = {
    depTypes: [],
    versionRange: ""
  };
  for (const type of DEPENDENCY_TYPES) {
    const deps = dependentPkgJSON[type];
    deps && (deps[dependencyName] && (dependencyVersionRange.depTypes.push(type), dependencyVersionRange.versionRange = deps[dependencyName]));
  }
  return dependencyVersionRange;
}

function flattenReleases(changesets, packagesByName, ignoredPackages) {
  let releases = new Map;
  return changesets.forEach(changeset => {
    changeset.releases.filter(({name: name}) => !ignoredPackages.includes(name)).forEach(({name: name, type: type}) => {
      let release = releases.get(name), pkg = packagesByName.get(name);
      if (!pkg) throw new Error(`Could not find package information for ${name}`);
      release ? ("minor" === release.type && "major" === type ? release.type = type : "patch" !== release.type || "major" !== type && "minor" !== type || (release.type = type), 
      release.changesets.push(changeset.id)) : release = {
        name: name,
        type: type,
        oldVersion: pkg.packageJson.version,
        changesets: [ changeset.id ]
      }, releases.set(name, release);
    });
  }), releases;
}

function applyLinks(releases, packagesByName, linked) {
  let updated = !1;
  if (!linked) return updated;
  for (let linkedPackages of linked) {
    let highestReleaseType, highestVersion, releasingLinkedPackages = [ ...releases.values() ].filter(release => linkedPackages.includes(release.name));
    if (!(releasingLinkedPackages.length < 1)) {
      for (let pkg of releasingLinkedPackages) highestReleaseType ? "major" === pkg.type ? highestReleaseType = pkg.type : "minor" === pkg.type && "major" !== highestReleaseType && (highestReleaseType = pkg.type) : highestReleaseType = pkg.type;
      for (let linkedPackage of linkedPackages) {
        let pkg = packagesByName.get(linkedPackage);
        if (!pkg) throw console.error(`FATAL ERROR IN CHANGESETS! We were unable to version for linked package: ${linkedPackage} in linkedPackages: ${linkedPackages.toString()}`), 
        new Error("fatal: could not resolve linked packages");
        (void 0 === highestVersion || semver__default.gt(pkg.packageJson.version, highestVersion)) && (highestVersion = pkg.packageJson.version);
      }
      if (!highestVersion || !highestReleaseType) throw new Error("Large internal changesets error in calculating linked versions. Please contact the maintainers");
      for (let linkedPackage of releasingLinkedPackages) linkedPackage.type !== highestReleaseType && (updated = !0, 
      linkedPackage.type = highestReleaseType), linkedPackage.oldVersion !== highestVersion && (updated = !0, 
      linkedPackage.oldVersion = highestVersion);
    }
  }
  return updated;
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

function getPreVersion(version) {
  let parsed = semver.parse(version), preVersion = void 0 === parsed.prerelease[1] ? -1 : parsed.prerelease[1];
  if ("number" != typeof preVersion) throw new errors.InternalError("preVersion is not a number");
  return preVersion++, preVersion;
}

function getSnapshotSuffix(snapshot) {
  const now = new Date;
  let tag = "";
  return "string" == typeof snapshot && (tag = `-${snapshot}`), `${tag}-${[ now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds() ].join("")}`;
}

function getNewVersion(release, preInfo, snapshot, snapshotSuffix, useCalculatedVersionForSnapshots) {
  if (snapshot && !useCalculatedVersionForSnapshots) return `0.0.0${snapshotSuffix}`;
  const calculatedVersion = incrementVersion(release, preInfo);
  return snapshot && useCalculatedVersionForSnapshots ? `${calculatedVersion}${snapshotSuffix}` : calculatedVersion;
}

function assembleReleasePlan(changesets, packages, config, preState, snapshot) {
  validateChangesets(changesets, config.ignore);
  let snapshotSuffix, updatedPreState = void 0 === preState ? void 0 : _objectSpread({}, preState, {
    initialVersions: _objectSpread({}, preState.initialVersions)
  });
  void 0 !== snapshot && (snapshotSuffix = getSnapshotSuffix(snapshot));
  let packagesByName = new Map(packages.packages.map(x => [ x.packageJson.name, x ])), unfilteredChangesets = changesets, preVersions = new Map;
  if (void 0 !== updatedPreState) {
    for (let pkg of packages.packages) void 0 === updatedPreState.initialVersions[pkg.packageJson.name] && (updatedPreState.initialVersions[pkg.packageJson.name] = pkg.packageJson.version);
    if ("exit" !== updatedPreState.mode) {
      let usedChangesetIds = new Set(updatedPreState.changesets);
      updatedPreState.changesets = changesets.map(x => x.id), changesets = changesets.filter(changeset => !usedChangesetIds.has(changeset.id));
    }
    for (let pkg of packages.packages) preVersions.set(pkg.packageJson.name, getPreVersion(pkg.packageJson.version));
    for (let linkedGroup of config.linked) {
      let highestPreVersion = 0;
      for (let linkedPackage of linkedGroup) highestPreVersion = Math.max(getPreVersion(packagesByName.get(linkedPackage).packageJson.version), highestPreVersion);
      for (let linkedPackage of linkedGroup) preVersions.set(linkedPackage, highestPreVersion);
    }
    for (let pkg of packages.packages) packagesByName.set(pkg.packageJson.name, _objectSpread({}, pkg, {
      packageJson: _objectSpread({}, pkg.packageJson, {
        version: updatedPreState.initialVersions[pkg.packageJson.name]
      })
    }));
  }
  let releases = flattenReleases(changesets, packagesByName, config.ignore);
  if (void 0 !== updatedPreState) if ("exit" === updatedPreState.mode) for (let pkg of packages.packages) 0 !== preVersions.get(pkg.packageJson.name) && (releases.has(pkg.packageJson.name) || releases.set(pkg.packageJson.name, {
    type: "patch",
    name: pkg.packageJson.name,
    changesets: [],
    oldVersion: pkg.packageJson.version
  })); else {
    let releasesFromUnfilteredChangesets = flattenReleases(unfilteredChangesets, packagesByName, config.ignore);
    releases.forEach((value, key) => {
      let releaseFromUnfilteredChangesets = releasesFromUnfilteredChangesets.get(key);
      if (void 0 === releaseFromUnfilteredChangesets) throw new errors.InternalError("releaseFromUnfilteredChangesets is undefined");
      releases.set(key, _objectSpread({}, value, {
        type: releaseFromUnfilteredChangesets.type
      }));
    });
  }
  let preInfo = void 0 === updatedPreState ? void 0 : {
    state: updatedPreState,
    preVersions: preVersions
  }, dependencyGraph = getDependentsGraph.getDependentsGraph(packages), releaseObjectValidated = !1;
  for (;!1 === releaseObjectValidated; ) {
    let dependentAdded = getDependents({
      releases: releases,
      packagesByName: packagesByName,
      dependencyGraph: dependencyGraph,
      preInfo: preInfo,
      ignoredPackages: config.ignore,
      onlyUpdatePeerDependentsWhenOutOfRange: config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange
    });
    releaseObjectValidated = !applyLinks(releases, packagesByName, config.linked) && !dependentAdded;
  }
  return {
    changesets: changesets,
    releases: [ ...releases.values() ].map(incompleteRelease => _objectSpread({}, incompleteRelease, {
      newVersion: getNewVersion(incompleteRelease, preInfo, snapshot, snapshotSuffix, config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.useCalculatedVersionForSnapshots)
    })),
    preState: updatedPreState
  };
}

function validateChangesets(changesets, ignored) {
  for (const changeset of changesets) {
    const ignoredPackages = [], notIgnoredPackages = [];
    for (const release of changeset.releases) ignored.find(ignoredPackageName => ignoredPackageName === release.name) ? ignoredPackages.push(release.name) : notIgnoredPackages.push(release.name);
    if (ignoredPackages.length > 0 && notIgnoredPackages.length > 0) throw new Error(`Found mixed changeset ${changeset.id}\n` + `Found ignored packages: ${ignoredPackages.join(" ")}\n` + `Found not ignored packages: ${notIgnoredPackages.join(" ")}\n` + "Mixed changesets that contain both ignored and not ignored packages are not allowed");
  }
}

exports.default = assembleReleasePlan;
