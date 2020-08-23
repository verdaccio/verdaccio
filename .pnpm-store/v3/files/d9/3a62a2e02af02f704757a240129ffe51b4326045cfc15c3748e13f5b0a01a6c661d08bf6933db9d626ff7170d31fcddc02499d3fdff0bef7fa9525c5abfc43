import { ComprehensiveRelease, PackageJSON, VersionType } from "@changesets/types";
export default function versionPackage(release: ComprehensiveRelease & {
    changelog: string | null;
    packageJson: PackageJSON;
    dir: string;
}, versionsToUpdate: Array<{
    name: string;
    version: string;
    type: VersionType;
}>, { updateInternalDependencies, onlyUpdatePeerDependentsWhenOutOfRange }: {
    updateInternalDependencies: "patch" | "minor";
    onlyUpdatePeerDependentsWhenOutOfRange: boolean;
}): {
    packageJson: PackageJSON;
    name: string;
    type: VersionType;
    oldVersion: string;
    newVersion: string;
    changesets: string[];
    changelog: string;
    dir: string;
};
