import fixturez from "fixturez";
import { enterPre, exitPre, readPreState } from "./index";
import * as fs from "fs-extra";
import path from "path";
import { PreState } from "@changesets/types";
import {
  PreEnterButInPreModeError,
  PreExitButNotInPreModeError
} from "@changesets/errors/src";

let f = fixturez(__dirname);

let preStateForSimpleProject: PreState = {
  changesets: [],
  initialVersions: {
    "pkg-a": "1.0.0",
    "pkg-b": "1.0.0"
  },
  mode: "pre",
  tag: "next"
};

describe("enterPre", () => {
  it("should enter", async () => {
    let cwd = f.copy("simple-project");
    await enterPre(cwd, "next");

    expect(await fs.readJson(path.join(cwd, ".changeset", "pre.json"))).toEqual(
      preStateForSimpleProject
    );
  });
  it("should throw if already in pre", async () => {
    let cwd = f.copy("simple-project");
    await fs.writeJSON(
      path.join(cwd, ".changeset", "pre.json"),
      preStateForSimpleProject
    );
    await expect(enterPre(cwd, "some-tag")).rejects.toBeInstanceOf(
      PreEnterButInPreModeError
    );
  });
});

describe("exitPre", () => {
  it("should exit", async () => {
    let cwd = f.copy("simple-project");
    await fs.writeJSON(
      path.join(cwd, ".changeset", "pre.json"),
      preStateForSimpleProject
    );
    await exitPre(cwd);

    expect(await fs.readJson(path.join(cwd, ".changeset", "pre.json"))).toEqual(
      { ...preStateForSimpleProject, mode: "exit" }
    );
  });
  it("should throw if not in pre", async () => {
    let cwd = f.copy("simple-project");
    await expect(exitPre(cwd)).rejects.toBeInstanceOf(
      PreExitButNotInPreModeError
    );
  });
});

test("readPreState reads the pre state", async () => {
  let cwd = f.copy("simple-project");
  await fs.writeJSON(
    path.join(cwd, ".changeset", "pre.json"),
    preStateForSimpleProject
  );
  expect(await readPreState(cwd)).toEqual(preStateForSimpleProject);
});
