import spawn from "spawndamnit";
import path from "path";
import { getPackages, Package } from "@manypkg/get-packages";
import { GitError } from "@changesets/errors";
import isSubdir from "is-subdir";

const isInDir = (dir: string) => (subdir: string) => isSubdir(dir, subdir);

async function add(pathToFile: string, cwd: string) {
  const gitCmd = await spawn("git", ["add", pathToFile], { cwd });

  if (gitCmd.code !== 0) {
    console.log(pathToFile, gitCmd.stderr.toString());
  }
  return gitCmd.code === 0;
}

async function commit(message: string, cwd: string) {
  const gitCmd = await spawn(
    "git",
    ["commit", "-m", message, "--allow-empty"],
    { cwd }
  );
  return gitCmd.code === 0;
}

// used to create a single tag at a time for the current head only
async function tag(tagStr: string, cwd: string) {
  // NOTE: it's important we use the -m flag otherwise 'git push --follow-tags' wont actually push
  // the tags
  const gitCmd = await spawn("git", ["tag", tagStr, "-m", tagStr], { cwd });
  return gitCmd.code === 0;
}

// Find the commit where we diverged from `ref` at using `git merge-base`
export async function getDivergedCommit(cwd: string, ref: string) {
  const cmd = await spawn("git", ["merge-base", ref, "HEAD"], { cwd });
  if (cmd.code !== 0) {
    throw new Error(
      `Failed to find where HEAD diverged from ${ref}. Does ${ref} exist?`
    );
  }
  return cmd.stdout.toString().trim();
}

async function getCommitThatAddsFile(gitPath: string, cwd: string) {
  const gitCmd = await spawn(
    "git",
    ["log", "--diff-filter=A", "--max-count=1", "--pretty=format:%h", gitPath],
    { cwd }
  );
  return gitCmd.stdout.toString();
}

async function getChangedFilesSince({
  cwd,
  ref,
  fullPath = false
}: {
  cwd: string;
  ref: string;
  fullPath?: boolean;
}): Promise<Array<string>> {
  const divergedAt = await getDivergedCommit(cwd, ref);
  // Now we can find which files we added
  const cmd = await spawn("git", ["diff", "--name-only", divergedAt], { cwd });
  if (cmd.code !== 0) {
    throw new Error(
      `Failed to diff against ${divergedAt}. Is ${divergedAt} a valid ref?`
    );
  }

  const files = cmd.stdout
    .toString()
    .trim()
    .split("\n")
    .filter(a => a);
  if (!fullPath) return files;
  return files.map(file => path.resolve(cwd, file));
}

// below are less generic functions that we use in combination with other things we are doing
async function getChangedChangesetFilesSinceRef({
  cwd,
  ref
}: {
  cwd: string;
  ref: string;
}): Promise<Array<string>> {
  try {
    const divergedAt = await getDivergedCommit(cwd, ref);
    // Now we can find which files we added
    const cmd = await spawn(
      "git",
      ["diff", "--name-only", "--diff-filter=d", divergedAt],
      {
        cwd
      }
    );

    let tester = /.changeset\/[^/]+\.md$/;

    const files = cmd.stdout
      .toString()
      .trim()
      .split("\n")
      .filter(file => tester.test(file));
    return files;
  } catch (err) {
    if (err instanceof GitError) return [];
    throw err;
  }
}

async function getChangedPackagesSinceRef({
  cwd,
  ref
}: {
  cwd: string;
  ref: string;
}) {
  const changedFiles = await getChangedFilesSince({ ref, cwd, fullPath: true });
  let packages = await getPackages(cwd);

  const fileToPackage: Record<string, Package> = {};

  packages.packages.forEach(pkg =>
    changedFiles.filter(isInDir(pkg.dir)).forEach(fileName => {
      const prevPkg = fileToPackage[fileName] || { dir: "" };
      if (pkg.dir.length > prevPkg.dir.length) fileToPackage[fileName] = pkg;
    })
  );

  return (
    Object.values(fileToPackage)
      // filter, so that we have only unique packages
      .filter((pkg, idx, packages) => packages.indexOf(pkg) === idx)
  );
}

export {
  getCommitThatAddsFile,
  getChangedFilesSince,
  add,
  commit,
  tag,
  getChangedPackagesSinceRef,
  getChangedChangesetFilesSinceRef
};
