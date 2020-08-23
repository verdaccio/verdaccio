"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var spawn = _interopDefault(require("spawndamnit")), path = _interopDefault(require("path")), getPackages = require("@manypkg/get-packages"), errors = require("@changesets/errors"), isSubdir = _interopDefault(require("is-subdir"));

const isInDir = dir => subdir => isSubdir(dir, subdir);

async function add(pathToFile, cwd) {
  const gitCmd = await spawn("git", [ "add", pathToFile ], {
    cwd: cwd
  });
  return 0 !== gitCmd.code && console.log(pathToFile, gitCmd.stderr.toString()), 0 === gitCmd.code;
}

async function commit(message, cwd) {
  return 0 === (await spawn("git", [ "commit", "-m", message, "--allow-empty" ], {
    cwd: cwd
  })).code;
}

async function tag(tagStr, cwd) {
  return 0 === (await spawn("git", [ "tag", tagStr, "-m", tagStr ], {
    cwd: cwd
  })).code;
}

async function getDivergedCommit(cwd, ref) {
  const cmd = await spawn("git", [ "merge-base", ref, "HEAD" ], {
    cwd: cwd
  });
  if (0 !== cmd.code) throw new Error(`Failed to find where HEAD diverged from ${ref}. Does ${ref} exist?`);
  return cmd.stdout.toString().trim();
}

async function getCommitThatAddsFile(gitPath, cwd) {
  return (await spawn("git", [ "log", "--diff-filter=A", "--max-count=1", "--pretty=format:%h", gitPath ], {
    cwd: cwd
  })).stdout.toString();
}

async function getChangedFilesSince({cwd: cwd, ref: ref, fullPath: fullPath = !1}) {
  const divergedAt = await getDivergedCommit(cwd, ref), cmd = await spawn("git", [ "diff", "--name-only", divergedAt ], {
    cwd: cwd
  });
  if (0 !== cmd.code) throw new Error(`Failed to diff against ${divergedAt}. Is ${divergedAt} a valid ref?`);
  const files = cmd.stdout.toString().trim().split("\n").filter(a => a);
  return fullPath ? files.map(file => path.resolve(cwd, file)) : files;
}

async function getChangedChangesetFilesSinceRef({cwd: cwd, ref: ref}) {
  try {
    const divergedAt = await getDivergedCommit(cwd, ref), cmd = await spawn("git", [ "diff", "--name-only", "--diff-filter=d", divergedAt ], {
      cwd: cwd
    });
    let tester = /.changeset\/[^/]+\.md$/;
    return cmd.stdout.toString().trim().split("\n").filter(file => tester.test(file));
  } catch (err) {
    if (err instanceof errors.GitError) return [];
    throw err;
  }
}

async function getChangedPackagesSinceRef({cwd: cwd, ref: ref}) {
  const changedFiles = await getChangedFilesSince({
    ref: ref,
    cwd: cwd,
    fullPath: !0
  });
  let packages = await getPackages.getPackages(cwd);
  const fileToPackage = {};
  return packages.packages.forEach(pkg => {
    return changedFiles.filter((dir = pkg.dir, subdir => isSubdir(dir, subdir))).forEach(fileName => {
      const prevPkg = fileToPackage[fileName] || {
        dir: ""
      };
      pkg.dir.length > prevPkg.dir.length && (fileToPackage[fileName] = pkg);
    });
    var dir;
  }), Object.values(fileToPackage).filter((pkg, idx, packages) => packages.indexOf(pkg) === idx);
}

exports.add = add, exports.commit = commit, exports.getChangedChangesetFilesSinceRef = getChangedChangesetFilesSinceRef, 
exports.getChangedFilesSince = getChangedFilesSince, exports.getChangedPackagesSinceRef = getChangedPackagesSinceRef, 
exports.getCommitThatAddsFile = getCommitThatAddsFile, exports.getDivergedCommit = getDivergedCommit, 
exports.tag = tag;
