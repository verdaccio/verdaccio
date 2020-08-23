import { Packages } from "@manypkg/get-packages";
import { Config, WrittenConfig } from "@changesets/types";
export declare let defaultWrittenConfig: {
    readonly $schema: string;
    readonly changelog: "@changesets/cli/changelog";
    readonly commit: false;
    readonly linked: readonly (readonly string[])[];
    readonly access: "restricted";
    readonly baseBranch: "master";
    readonly updateInternalDependencies: "patch";
    readonly ignore: readonly string[];
};
export declare let read: (cwd: string, packages: Packages) => Promise<Config>;
export declare let parse: (json: WrittenConfig, packages: Packages) => Config;
export declare let defaultConfig: Config;
