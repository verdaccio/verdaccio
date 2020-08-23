import semver from "semver";
import { Package } from "@manypkg/get-packages";
import { Linked, VersionType } from "@changesets/types";
import { InternalRelease } from "./types";

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
function applyLinks(
  releases: Map<string, InternalRelease>,
  packagesByName: Map<string, Package>,
  linked: Linked
): boolean {
  let updated = false;
  if (!linked) return updated;

  // We do this for each set of linked packages
  for (let linkedPackages of linked) {
    // First we filter down to all the relevent releases for one set of linked packages
    let releasingLinkedPackages = [...releases.values()].filter(release =>
      linkedPackages.includes(release.name)
    );

    // If we proceed any further we do extra work with calculating highestVersion for things that might
    // not need one, as they only have workspace based packages
    if (releasingLinkedPackages.length < 1) continue;

    let highestReleaseType: VersionType | undefined;
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
    }

    // Next we determine what the highest version among the linked packages will be
    for (let linkedPackage of linkedPackages) {
      let pkg = packagesByName.get(linkedPackage);

      if (pkg) {
        if (
          highestVersion === undefined ||
          semver.gt(pkg.packageJson.version, highestVersion)
        ) {
          highestVersion = pkg.packageJson.version;
        }
      } else {
        console.error(
          `FATAL ERROR IN CHANGESETS! We were unable to version for linked package: ${linkedPackage} in linkedPackages: ${linkedPackages.toString()}`
        );
        throw new Error(`fatal: could not resolve linked packages`);
      }
    }

    if (!highestVersion || !highestReleaseType)
      throw new Error(
        `Large internal changesets error in calculating linked versions. Please contact the maintainers`
      );

    // Finally, we update the packages so all of them are on the highest version
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

export default applyLinks;
