import { ReleasePlan, Config, NewChangeset, PreState } from "@changesets/types";
import determineDependents from "./determine-dependents";
import flattenReleases from "./flatten-releases";
import applyLinks from "./apply-links";
import { incrementVersion } from "./increment";
import * as semver from "semver";
import { InternalError } from "@changesets/errors";
import { Packages } from "@manypkg/get-packages";
import { getDependentsGraph } from "@changesets/get-dependents-graph";
import { PreInfo, InternalRelease } from "./types";

function getPreVersion(version: string) {
  let parsed = semver.parse(version)!;
  let preVersion =
    parsed.prerelease[1] === undefined ? -1 : parsed.prerelease[1];
  if (typeof preVersion !== "number") {
    throw new InternalError("preVersion is not a number");
  }
  preVersion++;
  return preVersion;
}

function getSnapshotSuffix(snapshot?: string | boolean): string {
  const now = new Date();

  let dateAndTime = [
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  ].join("");

  let tag = "";
  if (typeof snapshot === "string") tag = `-${snapshot}`;

  return `${tag}-${dateAndTime}`;
}

function getNewVersion(
  release: InternalRelease,
  preInfo: PreInfo | undefined,
  snapshot: string | boolean | undefined,
  snapshotSuffix: string,
  useCalculatedVersionForSnapshots: boolean
): string {
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

function assembleReleasePlan(
  changesets: NewChangeset[],
  packages: Packages,
  config: Config,
  preState: PreState | undefined,
  snapshot?: string | boolean
): ReleasePlan {
  validateChangesets(changesets, config.ignore);

  let updatedPreState: PreState | undefined =
    preState === undefined
      ? undefined
      : {
          ...preState,
          initialVersions: {
            ...preState.initialVersions
          }
        };

  // Caching the snapshot version here and use this if it is snapshot release
  let snapshotSuffix: string;
  if (snapshot !== undefined) {
    snapshotSuffix = getSnapshotSuffix(snapshot);
  }

  let packagesByName = new Map(
    packages.packages.map(x => [x.packageJson.name, x])
  );

  let unfilteredChangesets = changesets;

  let preVersions = new Map();
  if (updatedPreState !== undefined) {
    for (let pkg of packages.packages) {
      if (updatedPreState.initialVersions[pkg.packageJson.name] === undefined) {
        updatedPreState.initialVersions[pkg.packageJson.name] =
          pkg.packageJson.version;
      }
    }
    if (updatedPreState.mode !== "exit") {
      let usedChangesetIds = new Set(updatedPreState.changesets);
      updatedPreState.changesets = changesets.map(x => x.id);
      changesets = changesets.filter(
        changeset => !usedChangesetIds.has(changeset.id)
      );
    }

    // Populate preVersion
    // preVersion is the map between package name and its next pre version number.
    for (let pkg of packages.packages) {
      preVersions.set(
        pkg.packageJson.name,
        getPreVersion(pkg.packageJson.version)
      );
    }
    for (let linkedGroup of config.linked) {
      let highestPreVersion = 0;
      for (let linkedPackage of linkedGroup) {
        highestPreVersion = Math.max(
          getPreVersion(packagesByName.get(linkedPackage)!.packageJson.version),
          highestPreVersion
        );
      }
      for (let linkedPackage of linkedGroup) {
        preVersions.set(linkedPackage, highestPreVersion);
      }
    }

    for (let pkg of packages.packages) {
      packagesByName.set(pkg.packageJson.name, {
        ...pkg,
        packageJson: {
          ...pkg.packageJson,
          version: updatedPreState.initialVersions[pkg.packageJson.name]
        }
      });
    }
  }

  // releases is, at this point a list of all packages we are going to releases,
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
      let releasesFromUnfilteredChangesets = flattenReleases(
        unfilteredChangesets,
        packagesByName,
        config.ignore
      );

      releases.forEach((value, key) => {
        let releaseFromUnfilteredChangesets = releasesFromUnfilteredChangesets.get(
          key
        );
        if (releaseFromUnfilteredChangesets === undefined) {
          throw new InternalError(
            "releaseFromUnfilteredChangesets is undefined"
          );
        }

        releases.set(key, {
          ...value,
          // note that we're only setting the type, not the changesets which could be different(the name and oldVersion would be the same so they don't matter)
          // because the changesets on a given release refer to why a given package is being released
          // NOT why it's being released with a given bump type
          // (the bump type could change because of this, linked or peer dependencies)
          type: releaseFromUnfilteredChangesets.type
        });
      });
    }
  }

  let preInfo: PreInfo | undefined =
    updatedPreState === undefined
      ? undefined
      : {
          state: updatedPreState,
          preVersions
        };

  let dependencyGraph = getDependentsGraph(packages);

  let releaseObjectValidated = false;
  while (releaseObjectValidated === false) {
    // The map passed in to determineDependents will be mutated
    let dependentAdded = determineDependents({
      releases,
      packagesByName,
      dependencyGraph,
      preInfo,
      ignoredPackages: config.ignore,
      onlyUpdatePeerDependentsWhenOutOfRange:
        config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH
          .onlyUpdatePeerDependentsWhenOutOfRange
    });

    // The map passed in to determineDependents will be mutated
    let linksUpdated = applyLinks(releases, packagesByName, config.linked);

    releaseObjectValidated = !linksUpdated && !dependentAdded;
  }

  return {
    changesets,
    releases: [...releases.values()].map(incompleteRelease => {
      return {
        ...incompleteRelease,
        newVersion: getNewVersion(
          incompleteRelease,
          preInfo,
          snapshot,
          snapshotSuffix,
          config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH
            .useCalculatedVersionForSnapshots
        )
      };
    }),
    preState: updatedPreState
  };
}

// Changesets that contains both ignored and not ignored packages are not allowed
function validateChangesets(
  changesets: NewChangeset[],
  ignored: Readonly<string[]>
): void {
  for (const changeset of changesets) {
    // Using the following 2 arrays to decide whether a changeset
    // contains both ignored and not ignored packages
    const ignoredPackages = [];
    const notIgnoredPackages = [];
    for (const release of changeset.releases) {
      if (
        ignored.find(ignoredPackageName => ignoredPackageName === release.name)
      ) {
        ignoredPackages.push(release.name);
      } else {
        notIgnoredPackages.push(release.name);
      }
    }

    if (ignoredPackages.length > 0 && notIgnoredPackages.length > 0) {
      throw new Error(
        `Found mixed changeset ${changeset.id}\n` +
          `Found ignored packages: ${ignoredPackages.join(" ")}\n` +
          `Found not ignored packages: ${notIgnoredPackages.join(" ")}\n` +
          "Mixed changesets that contain both ignored and not ignored packages are not allowed"
      );
    }
  }
}

export default assembleReleasePlan;
