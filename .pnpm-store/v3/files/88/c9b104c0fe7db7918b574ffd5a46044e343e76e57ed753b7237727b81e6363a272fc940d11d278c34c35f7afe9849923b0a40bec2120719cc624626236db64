/**
 * Adapted from:
 * https://github.com/yarnpkg/yarn/blob/ddf2f9ade211195372236c2f39a75b00fa18d4de/src/config.js#L612
 * @param {string} [initial]
 * @return {string|null}
 */
export declare function findWorkspaceRoot(initial?: string): string;
export declare namespace findWorkspaceRoot {
    export var findWorkspaceRoot: typeof import("./core").findWorkspaceRoot;
    export var readPackageJSON: typeof import("./core").readPackageJSON;
    export var extractWorkspaces: typeof import("./core").extractWorkspaces;
    export var isMatchWorkspaces: typeof import("./core").isMatchWorkspaces;
    var _a: typeof import("./core").findWorkspaceRoot;
    export { _a as default };
}
export declare function checkWorkspaces(current: string, initial: string): {
    done: boolean;
    found: string;
    relativePath: string;
};
export declare function isMatchWorkspaces(relativePath: string, workspaces: string[]): boolean;
export declare function extractWorkspaces<T extends string[]>(manifest: {
    workspaces?: {
        packages: T;
    };
}): T;
export declare function extractWorkspaces<T extends string[]>(manifest: {
    workspaces?: T;
}): T;
export declare function readPackageJSON<T extends {
    workspaces?: any;
}>(dir: string): T;
export default findWorkspaceRoot;
