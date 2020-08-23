import fixtures from "fixturez";
import outdent from "outdent";

import read from "./";
import { temporarilySilenceLogs } from "@changesets/test-utils";

const f = fixtures(__dirname);

temporarilySilenceLogs();

describe("read changesets from disc", () => {
  it("should read a changeset from disc", async () => {
    const changesetPath = f.find("easy-read");

    const changesets = await read(changesetPath);
    expect(changesets).toEqual([
      {
        releases: [{ name: "cool-package", type: "minor" }],
        summary: "Nice simple summary",
        id: "basic-changeset"
      }
    ]);
  });
  it("should ignore a readme file", async () => {
    const changesetPath = f.find("with-readme");

    const changesets = await read(changesetPath);
    expect(changesets).toEqual([
      {
        releases: [{ name: "cool-package", type: "minor" }],
        summary: "Nice simple summary",
        id: "basic-changeset"
      }
    ]);
  });
  it("read a changeset that isn't a three word id", async () => {
    // I just want it enshrined in the tests that the file name's format
    // is in no way part of the changeset spec
    const changesetPath = f.find("easy-read");

    const changesets = await read(changesetPath);
    expect(changesets).toEqual([
      {
        releases: [{ name: "cool-package", type: "minor" }],
        summary: "Nice simple summary",
        id: "basic-changeset"
      }
    ]);
  });
  it("should read many changesets from disc", async () => {
    const changesetPath = f.find("multiple-changesets");

    const changesets = await read(changesetPath);
    expect(changesets).toEqual([
      {
        releases: [{ name: "cool-package", type: "minor" }],
        summary: "Nice simple summary",
        id: "first-changeset"
      },
      {
        releases: [{ name: "best-package", type: "patch" }],
        summary:
          "I'm amazed we needed to update the best package, because it was already the best",
        id: "second-changeset"
      }
    ]);
  });
  it("should return an empty array when no changesets are found", async () => {
    const changesetPath = f.find("no-changeset");

    const changesets = await read(changesetPath);
    expect(changesets).toEqual([]);
  });
  it("should error when there is no changeset folder", async () => {
    const changesetPath = f.find("no-changeset-folder");

    try {
      await read(changesetPath);
    } catch (e) {
      expect(e.message).toBe(
        "There is no .changeset directory in this project"
      );
      return;
    }
    expect("never run this because we returned above").toBe(true);
  });
  it("should error on broken changeset?", async () => {
    const changesetPath = f.find("broken-changeset");

    expect(read(changesetPath)).rejects.toThrow(
      outdent`could not parse changeset - invalid frontmatter: ---

      "cool-package": minor
      
      --
      
      Everything is wrong`
    );
  });
  it("should return no releases and empty summary when the changeset is emtpy", async () => {
    const changesetPath = f.find("empty-changeset");

    const changesets = await read(changesetPath);
    expect(changesets).toEqual([
      {
        releases: [],
        summary: "",
        id: "empty-changeset"
      }
    ]);
  });
  it("should read an old changeset", async () => {
    const changesetPath = f.find("old-changeset");

    const changesets = await read(changesetPath);
    expect(changesets).toEqual([
      {
        releases: [{ name: "cool-package", type: "minor" }],
        summary: "Nice simple summary\n",
        id: "basic-changeset"
      }
    ]);
  });
});
