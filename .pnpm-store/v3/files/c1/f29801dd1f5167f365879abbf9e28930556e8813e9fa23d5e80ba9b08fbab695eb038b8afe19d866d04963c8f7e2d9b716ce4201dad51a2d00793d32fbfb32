import { Package } from "@manypkg/get-packages";
declare function add(pathToFile: string, cwd: string): Promise<boolean>;
declare function commit(message: string, cwd: string): Promise<boolean>;
declare function tag(tagStr: string, cwd: string): Promise<boolean>;
export declare function getDivergedCommit(cwd: string, ref: string): Promise<string>;
declare function getCommitThatAddsFile(gitPath: string, cwd: string): Promise<string>;
declare function getChangedFilesSince({ cwd, ref, fullPath }: {
    cwd: string;
    ref: string;
    fullPath?: boolean;
}): Promise<Array<string>>;
declare function getChangedChangesetFilesSinceRef({ cwd, ref }: {
    cwd: string;
    ref: string;
}): Promise<Array<string>>;
declare function getChangedPackagesSinceRef({ cwd, ref }: {
    cwd: string;
    ref: string;
}): Promise<Package[]>;
export { getCommitThatAddsFile, getChangedFilesSince, add, commit, tag, getChangedPackagesSinceRef, getChangedChangesetFilesSinceRef };
