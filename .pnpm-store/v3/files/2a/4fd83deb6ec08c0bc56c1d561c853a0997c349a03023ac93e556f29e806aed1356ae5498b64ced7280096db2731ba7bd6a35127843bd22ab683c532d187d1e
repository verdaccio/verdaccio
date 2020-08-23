import semver from "semver";
import {
  Release,
  DependencyType,
  PackageJSON,
  VersionType
} from "@changesets/types";
import { Package } from "@manypkg/get-packages";
import { InternalRelease, PreInfo } from "./types";
import { incrementVersion } from "./increment";

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
export default function getDependents({
  releases,
  packagesByName,
  dependencyGraph,
  preInfo,
  ignoredPackages,
  onlyUpdatePeerDependentsWhenOutOfRange
}: {
  releases: Map<string, InternalRelease>;
  packagesByName: Map<string, Package>;
  dependencyGraph: Map<string, string[]>;
  preInfo: PreInfo | undefined;
  ignoredPackages: Readonly<string[]>;
  onlyUpdatePeerDependentsWhenOutOfRange: boolean;
}): boolean {
  let updated = false;
  // NOTE this is intended to be called recursively
  let pkgsToSearch = [...releases.values()];

  while (pkgsToSearch.length > 0) {
    // nextRelease is our dependency, think of it as "avatar"
    const nextRelease = pkgsToSearch.shift();
    if (!nextRelease) continue;
    // pkgDependents will be a list of packages that depend on nextRelease ie. ['avatar-group', 'comment']
    const pkgDependents = dependencyGraph.get(nextRelease.name);
    if (!pkgDependents) {
      throw new Error(
        `Error in determining dependents - could not find package in repository: ${nextRelease.name}`
      );
    }
    // For each dependent we are going to see whether it needs to be bumped because it's dependency
    // is leaving the version range.
    pkgDependents
      .map(dependent => {
        let type: VersionType | undefined;

        const dependentPackage = packagesByName.get(dependent);
        if (!dependentPackage) throw new Error("Dependency map is incorrect");
        const { depTypes, versionRange } = getDependencyVersionRange(
          dependentPackage.packageJson,
          nextRelease.name
        );

        // If the dependent is an ignored package, we want to bump its dependencies without a release, so setting type to "none"
        if (ignoredPackages.includes(dependent)) {
          type = "none";
        }
        // we check if it is a peerDependency because if it is, our dependent bump type needs to be major.
        else if (
          depTypes.includes("peerDependencies") &&
          nextRelease.type !== "patch" &&
          (!onlyUpdatePeerDependentsWhenOutOfRange ||
            !semver.satisfies(
              incrementVersion(nextRelease, preInfo),
              versionRange
            )) &&
          (!releases.has(dependent) ||
            (releases.has(dependent) &&
              releases.get(dependent)!.type !== "major"))
        ) {
          type = "major";
        } else {
          if (
            // TODO validate this - I don't think it's right anymore
            (!releases.has(dependent) ||
              releases.get(dependent)!.type === "none") &&
            !semver.satisfies(
              incrementVersion(nextRelease, preInfo),
              versionRange
            )
          ) {
            if (
              depTypes.includes("dependencies") ||
              depTypes.includes("optionalDependencies") ||
              depTypes.includes("peerDependencies")
            ) {
              type = "patch";
            } else {
              // We don't need a version bump if the package is only in the devDependencies of the dependent package
              type = "none";
            }
          }
        }
        if (releases.has(dependent) && releases.get(dependent)!.type === type) {
          type = undefined;
        }
        return { name: dependent, type, pkgJSON: dependentPackage.packageJson };
      })
      .filter(({ type }) => type)
      .forEach(
        // @ts-ignore - I don't know how to make typescript understand that the filter above guarantees this and I got sick of trying
        ({ name, type, pkgJSON }: Release & { pkgJSON: PackageJSON }) => {
          // At this point, we know if we are making a change
          updated = true;

          const existing = releases.get(name);
          // For things that are being given a major bump, we check if we have already
          // added them here. If we have, we update the existing item instead of pushing it on to search.
          // It is safe to not add it to pkgsToSearch because it should have already been searched at the
          // largest possible bump type.

          if (existing && type === "major" && existing.type !== "major") {
            existing.type = "major";

            pkgsToSearch.push(existing);
          } else {
            let newDependent: InternalRelease = {
              name,
              type,
              oldVersion: pkgJSON.version,
              changesets: []
            };

            pkgsToSearch.push(newDependent);
            releases.set(name, newDependent);
          }
        }
      );
  }

  return updated;
}

/*
  Returns an object in the shape { depTypes: [], versionRange: '' } with a list of different depTypes
  matched ('dependencies', 'peerDependencies', etc) and the versionRange itself ('^1.0.0')
*/

function getDependencyVersionRange(
  dependentPkgJSON: PackageJSON,
  dependencyName: string
) {
  const DEPENDENCY_TYPES = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies"
  ] as const;
  const dependencyVersionRange: {
    depTypes: DependencyType[];
    versionRange: string;
  } = {
    depTypes: [],
    versionRange: ""
  };
  for (const type of DEPENDENCY_TYPES) {
    const deps = dependentPkgJSON[type];
    if (!deps) continue;
    if (deps[dependencyName]) {
      dependencyVersionRange.depTypes.push(type);
      // We'll just override this each time, *hypothetically* it *should* be the same...
      dependencyVersionRange.versionRange = deps[dependencyName];
    }
  }
  return dependencyVersionRange;
}
