import { VersionType } from "@changesets/types";
export declare function shouldUpdateDependencyBasedOnConfig(release: {
    version: string;
    type: VersionType;
}, { depVersionRange, depType }: {
    depVersionRange: string;
    depType: "dependencies" | "devDependencies" | "peerDependencies" | "optionalDependencies";
}, { minReleaseType, onlyUpdatePeerDependentsWhenOutOfRange }: {
    minReleaseType: "patch" | "minor";
    onlyUpdatePeerDependentsWhenOutOfRange: boolean;
}): boolean;
