'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var semver = require('semver');
var semver__default = _interopDefault(semver);
var errors = require('@changesets/errors');
var getDependentsGraph = require('@changesets/get-dependents-graph');

function incrementVersion(release, preInfo) {
  if (release.type === "none") {
    return release.oldVersion;
  }

  let version = semver.inc(release.oldVersion, release.type);

  if (preInfo !== undefined && preInfo.state.mode !== "exit") {
    let preVersion = preInfo.preVersions.get(release.name);

    if (preVersion === undefined) {
      throw new errors.InternalError(`preVersion for ${release.name} does not exist when preState is defined`);
    } // why are we adding this ourselves rather than passing 'pre' + versionType to semver.inc?
    // because semver.inc with prereleases is confusing and this seems easier


    version += `-${preInfo.state.tag}.${preVersion}`;
  }

  return version;
}

/*
  WARNING:
  Important note for understanding how this package works:

  We are doing some kind of wacky things with manipulating the objects within the
  releases array, despite the fact that this was passed to us as an argument. We are
  aware that this is generally bad practice, but have decided to to this here as
  we control the entire flow of releases.

  We could solve this by inlining this function, or by returning a deep-cloned then
  modified array, but we decided both of those are worse than this solution.
*/

function getDependents({
  releases,
  packagesByName,
  dependencyGraph,
  preInfo,
  ignoredPackages,
  onlyUpdatePeerDependentsWhenOutOfRange
}) {
  let updated = false; // NOTE this is intended to be called recursively

  let pkgsToSearch = [...releases.values()];

  while (pkgsToSearch.length > 0) {
    // nextRelease is our dependency, think of it as "avatar"
    const nextRelease = pkgsToSearch.shift();
    if (!nextRelease) continue; // pkgDependents will be a list of packages that depend on nextRelease ie. ['avatar-group', 'comment']

    const pkgDependents = dependencyGraph.get(nextRelease.name);

    if (!pkgDependents) {
      throw new Error(`Error in determining dependents - could not find package in repository: ${nextRelease.name}`);
    } // For each dependent we are going to see whether it needs to be bumped because it's dependency
    // is leaving the version range.


    pkgDependents.map(dependent => {
      let type;
      const dependentPackage = packagesByName.get(dependent);
      if (!dependentPackage) throw new Error("Dependency map is incorrect");
      const {
        depTypes,
        versionRange
      } = getDependencyVersionRange(dependentPackage.packageJson, nextRelease.name); // If the dependent is an ignored package, we want to bump its dependencies without a release, so setting type to "none"

      if (ignoredPackages.includes(dependent)) {
        type = "none";
      } // we check if it is a peerDependency because if it is, our dependent bump type needs to be major.
      else if (depTypes.includes("peerDependencies") && nextRelease.type !== "patch" && (!onlyUpdatePeerDependentsWhenOutOfRange || !semver__default.satisfies(incrementVersion(nextRelease, preInfo), versionRange)) && (!releases.has(dependent) || releases.has(dependent) && releases.get(dependent).type !== "major")) {
          type = "major";
        } else {
          if ( // TODO validate this - I don't think it's right anymore
          (!releases.has(dependent) || releases.get(dependent).type === "none") && !semver__default.satisfies(incrementVersion(nextRelease, preInfo), versionRange)) {
            if (depTypes.includes("dependencies") || depTypes.includes("optionalDependencies") || depTypes.includes("peerDependencies")) {
              type = "patch";
            } else {
              // We don't need a version bump if the package is only in the devDependencies of the dependent package
              type = "none";
            }
          }
        }

      if (releases.has(dependent) && releases.get(dependent).type === type) {
        type = undefined;
      }

      return {
        name: dependent,
        type,
        pkgJSON: dependentPackage.packageJson
      };
    }).filter(({
      type
    }) => type).forEach( // @ts-ignore - I don't know how to make typescript understand that the filter above guarantees this and I got sick of trying
    ({
      name,
      type,
      pkgJSON
    }) => {
      // At this point, we know if we are making a change
      updated = true;
      const existing = releases.get(name); // For things that are being given a major bump, we check if we have already
      // added them here. If we have, we update the existing item instead of pushing it on to search.
      // It is safe to not add it to pkgsToSearch because it should have already been searched at the
      // largest possible bump type.

      if (existing && type === "major" && existing.type !== "major") {
        existing.type = "major";
        pkgsToSearch.push(existing);
      } else {
        let newDependent = {
          name,
          type,
          oldVersion: pkgJSON.version,
          changesets: []
        };
        pkgsToSearch.push(newDependent);
        releases.set(name, newDependent);
      }
    });
  }

  return updated;
}
/*
  Returns an object in the shape { depTypes: [], versionRange: '' } with a list of different depTypes
  matched ('dependencies', 'peerDependencies', etc) and the versionRange itself ('^1.0.0')
*/

function getDependencyVersionRange(dependentPkgJSON, dependencyName) {
  const DEPENDENCY_TYPES = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
  const dependencyVersionRange = {
    depTypes: [],
    versionRange: ""
  };

  for (const type of DEPENDENCY_TYPES) {
    const deps = dependentPkgJSON[type];
    if (!deps) continue;

    if (deps[dependencyName]) {
      dependencyVersionRange.depTypes.push(type); // We'll just override this each time, *hypothetically* it *should* be the same...

      dependencyVersionRange.versionRange = deps[dependencyName];
    }
  }

  return dependencyVersionRange;
}

// This function takes in changesets and returns one release per
// package listed in the changesets
function flattenReleases(changesets, packagesByName, ignoredPackages) {
  let releases = new Map();
  changesets.forEach(changeset => {
    changeset.releases // Filter out ignored packages because they should not trigger a release
    // If their dependencies need updates, they will be added to releases by `determineDependents()` with release type `none`
    .filter(({
      name
    }) => !ignoredPackages.includes(name)).forEach(({
      name,
      type
    }) => {
      let release = releases.get(name);
      let pkg = packagesByName.get(name);

      if (!pkg) {
        throw new Error(`Could not find package information for ${name}`);
      }

      if (!release) {
        release = {
          name,
          type,
          oldVersion: pkg.packageJson.version,
          changesets: [changeset.id]
        };
      } else {
        // If the type was already major, we never need to update it
        if (release.type === "minor" && type === "major") {
          release.type = type;
        } else if (release.type === "patch" && (type === "major" || type === "minor")) {
          release.type = type;
        } // Check whether the bumpType will change
        // If the bumpType has changed recalc newVersion
        // push new changeset to releases


        release.changesets.push(changeset.id);
      }

      releases.set(name, release);
    });
  });
  return releases;
}

/*
  WARNING:
  Important note for understanding how this package works:

  We are doing some kind of wacky things with manipulating the objects within the
  releases array, despite the fact that this was passed to us as an argument. We are
  aware that this is generally bad practice, but have decided to to this here as
  we control the entire flow of releases.

  We could solve this by inlining this function, or by returning a deep-cloned then
  modified array, but we decided both of those are worse than this solution.
*/
function applyLinks(releases, packagesByName, linked) {
  let updated = false;
  if (!linked) return updated; // We do this for each set of linked packages

  for (let linkedPackages of linked) {
    // First we filter down to all the relevent releases for one set of linked packages
    let releasingLinkedPackages = [...releases.values()].filter(release => linkedPackages.includes(release.name)); // If we proceed any further we do extra work with calculating highestVersion for things that might
    // not need one, as they only have workspace based packages

    if (releasingLinkedPackages.length < 1) continue;
    let highestReleaseType;
    let highestVersion;

    for (let pkg of releasingLinkedPackages) {
      // Note that patch is implictly set here, but never needs to override another value
      if (!highestReleaseType) {
        highestReleaseType = pkg.type;
      } else if (pkg.type === "major") {
        highestReleaseType = pkg.type;
      } else if (pkg.type === "minor" && highestReleaseType !== "major") {
        highestReleaseType = pkg.type;
      }
    } // Next we determine what the highest version among the linked packages will be


    for (let linkedPackage of linkedPackages) {
      let pkg = packagesByName.get(linkedPackage);

      if (pkg) {
        if (highestVersion === undefined || semver__default.gt(pkg.packageJson.version, highestVersion)) {
          highestVersion = pkg.packageJson.version;
        }
      } else {
        console.error(`FATAL ERROR IN CHANGESETS! We were unable to version for linked package: ${linkedPackage} in linkedPackages: ${linkedPackages.toString()}`);
        throw new Error(`fatal: could not resolve linked packages`);
      }
    }

    if (!highestVersion || !highestReleaseType) throw new Error(`Large internal changesets error in calculating linked versions. Please contact the maintainers`); // Finally, we update the packages so all of them are on the highest version

    for (let linkedPackage of releasingLinkedPackages) {
      if (linkedPackage.type !== highestReleaseType) {
        updated = true;
        linkedPackage.type = highestReleaseType;
      }

      if (linkedPackage.oldVersion !== highestVersion) {
        updated = true;
        linkedPackage.oldVersion = highestVersion;
      }
    }
  }

  return updated;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getPreVersion(version) {
  let parsed = semver.parse(version);
  let preVersion = parsed.prerelease[1] === undefined ? -1 : parsed.prerelease[1];

  if (typeof preVersion !== "number") {
    throw new errors.InternalError("preVersion is not a number");
  }

  preVersion++;
  return preVersion;
}

function getSnapshotSuffix(snapshot) {
  const now = new Date();
  let dateAndTime = [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()].join("");
  let tag = "";
  if (typeof snapshot === "string") tag = `-${snapshot}`;
  return `${tag}-${dateAndTime}`;
}

function getNewVersion(release, preInfo, snapshot, snapshotSuffix, useCalculatedVersionForSnapshots) {
  /**
   * Using version as 0.0.0 so that it does not hinder with other version release
   * For example;
   * if user has a regular pre-release at 1.0.0-beta.0 and then you had a snapshot pre-release at 1.0.0-canary-git-hash
   * and a consumer is using the range ^1.0.0-beta, most people would expect that range to resolve to 1.0.0-beta.0
   * but it'll actually resolve to 1.0.0-canary-hash. Using 0.0.0 solves this problem because it won't conflict with other versions.
   *
   * You can set `useCalculatedVersionForSnapshots` flag to true to use calculated versions if you don't care about the above problem.
   */
  if (snapshot && !useCalculatedVersionForSnapshots) {
    return `0.0.0${snapshotSuffix}`;
  }

  const calculatedVersion = incrementVersion(release, preInfo);

  if (snapshot && useCalculatedVersionForSnapshots) {
    return `${calculatedVersion}${snapshotSuffix}`;
  }

  return calculatedVersion;
}

function assembleReleasePlan(changesets, packages, config, preState, snapshot) {
  validateChangesets(changesets, config.ignore);
  let updatedPreState = preState === undefined ? undefined : _objectSpread({}, preState, {
    initialVersions: _objectSpread({}, preState.initialVersions)
  }); // Caching the snapshot version here and use this if it is snapshot release

  let snapshotSuffix;

  if (snapshot !== undefined) {
    snapshotSuffix = getSnapshotSuffix(snapshot);
  }

  let packagesByName = new Map(packages.packages.map(x => [x.packageJson.name, x]));
  let unfilteredChangesets = changesets;
  let preVersions = new Map();

  if (updatedPreState !== undefined) {
    for (let pkg of packages.packages) {
      if (updatedPreState.initialVersions[pkg.packageJson.name] === undefined) {
        updatedPreState.initialVersions[pkg.packageJson.name] = pkg.packageJson.version;
      }
    }

    if (updatedPreState.mode !== "exit") {
      let usedChangesetIds = new Set(updatedPreState.changesets);
      updatedPreState.changesets = changesets.map(x => x.id);
      changesets = changesets.filter(changeset => !usedChangesetIds.has(changeset.id));
    } // Populate preVersion
    // preVersion is the map between package name and its next pre version number.


    for (let pkg of packages.packages) {
      preVersions.set(pkg.packageJson.name, getPreVersion(pkg.packageJson.version));
    }

    for (let linkedGroup of config.linked) {
      let highestPreVersion = 0;

      for (let linkedPackage of linkedGroup) {
        highestPreVersion = Math.max(getPreVersion(packagesByName.get(linkedPackage).packageJson.version), highestPreVersion);
      }

      for (let linkedPackage of linkedGroup) {
        preVersions.set(linkedPackage, highestPreVersion);
      }
    }

    for (let pkg of packages.packages) {
      packagesByName.set(pkg.packageJson.name, _objectSpread({}, pkg, {
        packageJson: _objectSpread({}, pkg.packageJson, {
          version: updatedPreState.initialVersions[pkg.packageJson.name]
        })
      }));
    }
  } // releases is, at this point a list of all packages we are going to releases,
  // flattened down to one release per package, having a reference back to their
  // changesets, and with a calculated new versions


  let releases = flattenReleases(changesets, packagesByName, config.ignore);

  if (updatedPreState !== undefined) {
    if (updatedPreState.mode === "exit") {
      for (let pkg of packages.packages) {
        // If a package had a prerelease, but didn't trigger a version bump in the regular release,
        // we want to give it a patch release.
        // Detailed explaination at https://github.com/atlassian/changesets/pull/382#discussion_r434434182
        if (preVersions.get(pkg.packageJson.name) !== 0) {
          if (!releases.has(pkg.packageJson.name)) {
            releases.set(pkg.packageJson.name, {
              type: "patch",
              name: pkg.packageJson.name,
              changesets: [],
              oldVersion: pkg.packageJson.version
            });
          }
        }
      }
    } else {
      // for every release in pre mode, we want versions to be bumped to the highest bump type
      // across all the changesets even if the package doesn't have a changeset that releases
      // to the highest bump type in a given release in pre mode and importantly
      // we don't want to add any new releases, we only want to update ones that will already happen
      // because if they're not being released, the version will already have been bumped with the highest bump type
      let releasesFromUnfilteredChangesets = flattenReleases(unfilteredChangesets, packagesByName, config.ignore);
      releases.forEach((value, key) => {
        let releaseFromUnfilteredChangesets = releasesFromUnfilteredChangesets.get(key);

        if (releaseFromUnfilteredChangesets === undefined) {
          throw new errors.InternalError("releaseFromUnfilteredChangesets is undefined");
        }

        releases.set(key, _objectSpread({}, value, {
          // note that we're only setting the type, not the changesets which could be different(the name and oldVersion would be the same so they don't matter)
          // because the changesets on a given release refer to why a given package is being released
          // NOT why it's being released with a given bump type
          // (the bump type could change because of this, linked or peer dependencies)
          type: releaseFromUnfilteredChangesets.type
        }));
      });
    }
  }

  let preInfo = updatedPreState === undefined ? undefined : {
    state: updatedPreState,
    preVersions
  };
  let dependencyGraph = getDependentsGraph.getDependentsGraph(packages);
  let releaseObjectValidated = false;

  while (releaseObjectValidated === false) {
    // The map passed in to determineDependents will be mutated
    let dependentAdded = getDependents({
      releases,
      packagesByName,
      dependencyGraph,
      preInfo,
      ignoredPackages: config.ignore,
      onlyUpdatePeerDependentsWhenOutOfRange: config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange
    }); // The map passed in to determineDependents will be mutated

    let linksUpdated = applyLinks(releases, packagesByName, config.linked);
    releaseObjectValidated = !linksUpdated && !dependentAdded;
  }

  return {
    changesets,
    releases: [...releases.values()].map(incompleteRelease => {
      return _objectSpread({}, incompleteRelease, {
        newVersion: getNewVersion(incompleteRelease, preInfo, snapshot, snapshotSuffix, config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.useCalculatedVersionForSnapshots)
      });
    }),
    preState: updatedPreState
  };
} // Changesets that contains both ignored and not ignored packages are not allowed


function validateChangesets(changesets, ignored) {
  for (const changeset of changesets) {
    // Using the following 2 arrays to decide whether a changeset
    // contains both ignored and not ignored packages
    const ignoredPackages = [];
    const notIgnoredPackages = [];

    for (const release of changeset.releases) {
      if (ignored.find(ignoredPackageName => ignoredPackageName === release.name)) {
        ignoredPackages.push(release.name);
      } else {
        notIgnoredPackages.push(release.name);
      }
    }

    if (ignoredPackages.length > 0 && notIgnoredPackages.length > 0) {
      throw new Error(`Found mixed changeset ${changeset.id}\n` + `Found ignored packages: ${ignoredPackages.join(" ")}\n` + `Found not ignored packages: ${notIgnoredPackages.join(" ")}\n` + "Mixed changesets that contain both ignored and not ignored packages are not allowed");
    }
  }
}

exports.default = assembleReleasePlan;
