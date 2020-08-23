import { Package } from "@manypkg/get-packages";
import { InternalRelease, PreInfo } from "./types";
export default function getDependents({ releases, packagesByName, dependencyGraph, preInfo, ignoredPackages, onlyUpdatePeerDependentsWhenOutOfRange }: {
    releases: Map<string, InternalRelease>;
    packagesByName: Map<string, Package>;
    dependencyGraph: Map<string, string[]>;
    preInfo: PreInfo | undefined;
    ignoredPackages: Readonly<string[]>;
    onlyUpdatePeerDependentsWhenOutOfRange: boolean;
}): boolean;
