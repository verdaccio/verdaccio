// NB: Bolt check uses a different dependnecy set to every other package.
// You need think before you use this.
const DEPENDENCY_TYPES = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
] as const;

export type VersionType = "major" | "minor" | "patch";

export type DependencyType = typeof DEPENDENCY_TYPES[number];

export type AccessType = "public" | "restricted";

export type Release = { name: string; type: VersionType };

// This is a release that has been modified to include all relevant information
// about releasing - it is calculated and doesn't make sense as an artefact
export type ComprehensiveRelease = {
  name: string;
  type: VersionType;
  oldVersion: string;
  newVersion: string;
  changesets: string[];
};

export type NewChangeset = {
  id: string;
  summary: string;
  releases: Array<Release>;
};

export type ReleasePlan = {
  changesets: NewChangeset[];
  releases: ComprehensiveRelease[];
  preState: PreState | undefined;
};

export type PackageJSON = {
  name: string;
  version: string;
  dependencies?: { [key: string]: string };
  peerDependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  optionalDependencies?: { [key: string]: string };
  private?: boolean;
  publishConfig?: {
    access?: AccessType;
  };
};

export type Linked = ReadonlyArray<ReadonlyArray<string>>;

export type Config = {
  changelog: false | readonly [string, any];
  commit: boolean;
  linked: Linked;
  access: AccessType;
};

export type WrittenConfig = {
  changelog?: false | readonly [string, any] | string;
  commit?: boolean;
  linked?: Linked;
  access?: AccessType;
};

export type Workspace = { config: PackageJSON; name: string; dir: string };

export type NewChangesetWithCommit = NewChangeset & { commit?: string };

export type ModCompWithWorkspace = ComprehensiveRelease & {
  config: PackageJSON;
  dir: string;
};

export type GetReleaseLine = (
  changeset: NewChangesetWithCommit,
  type: VersionType,
  changelogOpts: any
) => Promise<string>;

export type GetDependencyReleaseLine = (
  changesets: NewChangesetWithCommit[],
  dependenciesUpdated: ModCompWithWorkspace[],
  changelogOpts: any
) => Promise<string>;

export type ChangelogFunctions = {
  getReleaseLine: GetReleaseLine;
  getDependencyReleaseLine: GetDependencyReleaseLine;
};

export type PreState = {
  mode: "pre" | "exit";
  tag: string;
  initialVersions: {
    [pkgName: string]: string;
  };
  changesets: string[];
};
