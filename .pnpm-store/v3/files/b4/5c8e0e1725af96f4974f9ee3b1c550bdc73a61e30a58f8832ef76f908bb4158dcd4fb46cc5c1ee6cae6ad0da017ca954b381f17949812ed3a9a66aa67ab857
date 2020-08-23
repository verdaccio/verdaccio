declare const DEPENDENCY_TYPES: readonly ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
export declare type VersionType = "major" | "minor" | "patch";
export declare type DependencyType = typeof DEPENDENCY_TYPES[number];
export declare type AccessType = "public" | "restricted";
export declare type Release = {
    name: string;
    type: VersionType;
};
export declare type ComprehensiveRelease = {
    name: string;
    type: VersionType;
    oldVersion: string;
    newVersion: string;
    changesets: string[];
};
export declare type NewChangeset = {
    id: string;
    summary: string;
    releases: Array<Release>;
};
export declare type ReleasePlan = {
    changesets: NewChangeset[];
    releases: ComprehensiveRelease[];
    preState: PreState | undefined;
};
export declare type PackageJSON = {
    name: string;
    version: string;
    dependencies?: {
        [key: string]: string;
    };
    peerDependencies?: {
        [key: string]: string;
    };
    devDependencies?: {
        [key: string]: string;
    };
    optionalDependencies?: {
        [key: string]: string;
    };
    private?: boolean;
    publishConfig?: {
        access?: AccessType;
    };
};
export declare type Linked = ReadonlyArray<ReadonlyArray<string>>;
export declare type Config = {
    changelog: false | readonly [string, any];
    commit: boolean;
    linked: Linked;
    access: AccessType;
};
export declare type WrittenConfig = {
    changelog?: false | readonly [string, any] | string;
    commit?: boolean;
    linked?: Linked;
    access?: AccessType;
};
export declare type Workspace = {
    config: PackageJSON;
    name: string;
    dir: string;
};
export declare type NewChangesetWithCommit = NewChangeset & {
    commit?: string;
};
export declare type ModCompWithWorkspace = ComprehensiveRelease & {
    config: PackageJSON;
    dir: string;
};
export declare type GetReleaseLine = (changeset: NewChangesetWithCommit, type: VersionType, changelogOpts: any) => Promise<string>;
export declare type GetDependencyReleaseLine = (changesets: NewChangesetWithCommit[], dependenciesUpdated: ModCompWithWorkspace[], changelogOpts: any) => Promise<string>;
export declare type ChangelogFunctions = {
    getReleaseLine: GetReleaseLine;
    getDependencyReleaseLine: GetDependencyReleaseLine;
};
export declare type PreState = {
    mode: "pre" | "exit";
    tag: string;
    initialVersions: {
        [pkgName: string]: string;
    };
    changesets: string[];
};
export {};
