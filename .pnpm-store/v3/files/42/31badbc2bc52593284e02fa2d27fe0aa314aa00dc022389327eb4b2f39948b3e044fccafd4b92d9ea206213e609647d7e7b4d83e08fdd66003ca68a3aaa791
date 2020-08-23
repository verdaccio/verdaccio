import fixtures from "fixturez";
import spawn from "spawndamnit";

import {
  getCommitThatAddsFile,
  getChangedFilesSince,
  add,
  commit,
  tag,
  getDivergedCommit,
  getChangedPackagesSinceRef,
  getChangedChangesetFilesSinceRef
} from "./";

const f = fixtures(__dirname);

async function getCurrentCommit(cwd: string) {
  const cmd = await spawn("git", ["rev-parse", "HEAD"], { cwd });
  return cmd.stdout.toString().trim();
}

describe("git", () => {
  let cwd: string;
  beforeEach(async () => {
    cwd = await f.copy("with-git");
    await spawn("git", ["init"], { cwd });
    await spawn("git", ["config", "user.email", "x@y.z"], { cwd });
    await spawn("git", ["config", "user.name", "xyz"], { cwd });
    await spawn("git", ["config", "commit.gpgSign", "false"], { cwd });
    await spawn("git", ["config", "tag.gpgSign", "false"], { cwd });
    await spawn("git", ["config", "tag.forceSignAnnotated", "false"], { cwd });
  });

  describe("getDivergedCommit", () => {
    it("should return same commit when branches have not diverged", async () => {
      await add("packages/pkg-a/package.json", cwd);
      await commit("added packageA package.json", cwd);

      const firstSha = await getCurrentCommit(cwd);

      await add("packages/pkg-b/package.json", cwd);
      await commit("added packageB package.json", cwd);

      const secondSha = await getCurrentCommit(cwd);
      const divergedSha = await getDivergedCommit(cwd, "master");
      expect(firstSha).not.toBe(secondSha);
      expect(divergedSha).toBe(secondSha);
    });

    it("should find commit where branch diverged", async () => {
      await add("packages/pkg-a/package.json", cwd);
      await commit("added packageA package.json", cwd);

      // This is the first commit. We branch (diverge) from here.
      const masterSha = await getCurrentCommit(cwd);

      // Create a new branch, and add a commit to it.
      await spawn("git", ["checkout", "-b", "my-branch"], { cwd });
      await add("packages/pkg-b/package.json", cwd);
      await commit("added packageB package.json", cwd);

      // Now, get the latest commit from our new branch.
      const branchSha = await getCurrentCommit(cwd);

      // Finally, get the divergent commit.
      const divergedSha = await getDivergedCommit(cwd, "master");
      expect(masterSha).not.toBe(branchSha);
      expect(divergedSha).toBe(masterSha);
    });
  });

  describe("add", () => {
    it("should add a file to the staging area", async () => {
      await add("packages/pkg-a/package.json", cwd);

      const gitCmd = await spawn("git", ["diff", "--name-only", "--cached"], {
        cwd
      });
      const stagedFiles = gitCmd.stdout
        .toString()
        .split("\n")
        .filter(a => a);

      expect(stagedFiles).toHaveLength(1);
      expect(stagedFiles[0]).toEqual("packages/pkg-a/package.json");
    });

    it("should add multiple files to the staging area", async () => {
      await add("package.json", cwd);
      await add("packages/pkg-a/package.json", cwd);
      await add("packages/pkg-b/package.json", cwd);

      const gitCmd = await spawn("git", ["diff", "--name-only", "--cached"], {
        cwd
      });
      const stagedFiles = gitCmd.stdout
        .toString()
        .split("\n")
        .filter(a => a);

      expect(stagedFiles).toHaveLength(3);
      expect(stagedFiles[0]).toEqual("package.json");
      expect(stagedFiles[1]).toEqual("packages/pkg-a/package.json");
      expect(stagedFiles[2]).toEqual("packages/pkg-b/package.json");
    });

    it("should add a directory", async () => {
      await add("packages", cwd);

      const gitCmd = await spawn("git", ["diff", "--name-only", "--cached"], {
        cwd
      });
      const stagedFiles = gitCmd.stdout
        .toString()
        .split("\n")
        .filter(a => a);

      expect(stagedFiles).toEqual([
        "packages/package.json",
        "packages/pkg-a/index.js",
        "packages/pkg-a/package.json",
        "packages/pkg-b/index.js",
        "packages/pkg-b/package.json"
      ]);
    });
  });

  describe("commit", () => {
    it("should commit a file", async () => {
      await add("packages/pkg-a/package.json", cwd);
      await commit("added packageA package.json", cwd);

      const gitCmd = await spawn("git", ["log", "-1", "--pretty=%B"], {
        cwd
      });
      const commitMessage = gitCmd.stdout.toString().trim();

      expect(commitMessage).toEqual("added packageA package.json");
    });
  });

  describe("tag", () => {
    beforeEach(async () => {
      await add("packages/pkg-a/package.json", cwd);
      await commit("added packageA package.json", cwd);
    });

    it("should create a tag for the current head", async () => {
      const head = await spawn("git", ["rev-parse", "HEAD"], { cwd });
      await tag("tag_message", cwd);

      // Gets the hash of the commit the tag is referring to, not the hash of the tag itself
      const tagRef = await spawn(
        "git",
        ["rev-list", "-n", "1", "tag_message"],
        { cwd }
      );
      expect(tagRef).toEqual(head);
    });

    it("should create a tag, make a new commit, then create a second tag", async () => {
      const initialHead = await spawn("git", ["rev-parse", "HEAD"], {
        cwd
      });
      await tag("tag_message", cwd);
      await add("packages/pkg-b/package.json", cwd);
      await commit("added packageB package.json", cwd);
      const newHead = await spawn("git", ["rev-parse", "HEAD"], { cwd });
      await tag("new_tag", cwd);

      // Gets the hash of the commit the tag is referring to, not the hash of the tag itself
      const firstTagRef = await spawn(
        "git",
        ["rev-list", "-n", "1", "tag_message"],
        { cwd }
      );
      const secondTagRef = await spawn(
        "git",
        ["rev-list", "-n", "1", "new_tag"],
        { cwd }
      );

      expect(firstTagRef).toEqual(initialHead);
      expect(secondTagRef).toEqual(newHead);
    });
  });

  describe("getCommitThatAddsFile", () => {
    it("should commit a file and get the hash of that commit", async () => {
      await add("packages/pkg-b/package.json", cwd);
      await commit("added packageB package.json", cwd);
      const head = await spawn("git", ["rev-parse", "--short", "HEAD"], {
        cwd
      });

      const commitHash = await getCommitThatAddsFile(
        "packages/pkg-b/package.json",
        cwd
      );

      expect(commitHash).toEqual(head.stdout.toString().trim());
    });
  });

  describe("getChangedFilesSince", () => {
    beforeEach(async () => {
      await add("packages/pkg-a/package.json", cwd);
      await commit("added packageA package.json", cwd);
    });

    it("should be empty if no changes (partial path)", async () => {
      const head = await spawn("git", ["rev-parse", "HEAD"], { cwd });
      const changedFiles = await getChangedFilesSince({
        ref: head.stdout.toString().trim(),
        cwd,
        fullPath: false
      });
      expect(changedFiles).toHaveLength(0);
    });

    it("should be empty if no changes (full path)", async () => {
      const head = await spawn("git", ["rev-parse", "HEAD"], { cwd });
      const changedFiles = await getChangedFilesSince({
        ref: head.stdout.toString().trim(),
        cwd,
        fullPath: true
      });
      expect(changedFiles).toHaveLength(0);
    });

    it("should get list of files that have been committed", async () => {
      const firstRef = await spawn("git", ["rev-parse", "HEAD"], { cwd });
      await add("packages/pkg-a/index.js", cwd);
      await commit("added packageA index", cwd);

      const secondRef = await spawn("git", ["rev-parse", "HEAD"], { cwd });
      await add("packages/pkg-b/index.js", cwd);
      await add("packages/pkg-b/package.json", cwd);
      await commit("added packageB files", cwd);

      const filesChangedSinceFirstRef = await getChangedFilesSince({
        ref: firstRef.stdout.toString().trim(),
        cwd
      });
      expect(filesChangedSinceFirstRef[0]).toEqual("packages/pkg-a/index.js");
      expect(filesChangedSinceFirstRef[1]).toEqual("packages/pkg-b/index.js");
      expect(filesChangedSinceFirstRef[2]).toEqual(
        "packages/pkg-b/package.json"
      );

      const filesChangedSinceSecondRef = await getChangedFilesSince({
        ref: secondRef.stdout.toString().trim(),
        cwd
      });
      expect(filesChangedSinceSecondRef[0]).toEqual("packages/pkg-b/index.js");
      expect(filesChangedSinceSecondRef[1]).toEqual(
        "packages/pkg-b/package.json"
      );
    });
  });

  describe("getChangedPackagesSinceRef", () => {
    beforeEach(async () => {
      await add("packages/pkg-a/package.json", cwd);
      await commit("added packageA package.json", cwd);
    });

    it("should return an empty list if no packages have changed", async () => {
      await spawn("git", ["checkout", "-b", "new-branch"], { cwd });
      const changedPackages = await getChangedPackagesSinceRef({
        cwd,
        ref: "master"
      });
      expect(changedPackages).toHaveLength(0);
    });

    it("should check changed packages on a branch against master", async () => {
      await spawn("git", ["checkout", "-b", "new-branch"], { cwd });
      await add("packages/pkg-a/index.js", cwd);
      await commit("added packageA index", cwd);

      await add("packages/pkg-b/index.js", cwd);
      await add("packages/pkg-b/package.json", cwd);
      await commit("added packageB files", cwd);

      const changedPackages = await getChangedPackagesSinceRef({
        cwd,
        ref: "master"
      });

      expect(changedPackages).toHaveLength(2);
      expect(changedPackages[0].packageJson.name).toEqual("pkg-a");
      expect(changedPackages[1].packageJson.name).toEqual("pkg-b");
    });
  });

  describe("getChangedChangesetFilesSinceRef", () => {
    it("should be empty if no changeset files have been added", async () => {
      await add("packages/pkg-a/package.json", cwd);
      await commit("added packageA package.json", cwd);

      const files = await getChangedChangesetFilesSinceRef({
        cwd,
        ref: "master"
      });
      expect(files).toHaveLength(0);
    });

    it("should get the relative path to the changeset file", async () => {
      await add("packages/pkg-a/package.json", cwd);
      await commit("added packageA package.json", cwd);
      await add(".changeset", cwd);

      const files = await getChangedChangesetFilesSinceRef({
        cwd,
        ref: "master"
      });
      expect(files).toHaveLength(2);
      expect(files[1]).toEqual(".changeset/quick-lions-devour.md");
    });
    it("should work on a ref that isn't master", async () => {
      await spawn("git", ["checkout", "-b", "some-branch"], { cwd });
      await add("packages/pkg-a/package.json", cwd);
      await commit("added packageA package.json", cwd);
      await add(".changeset", cwd);

      const files = await getChangedChangesetFilesSinceRef({
        cwd,
        ref: "some-branch"
      });
      expect(files).toHaveLength(2);
      expect(files[1]).toEqual(".changeset/quick-lions-devour.md");
    });
  });
});
