import outdent from "outdent";
import createReleaseCommit from "./createVersionCommit";
import { NewChangeset, ReleasePlan } from "@changesets/types";

const simpleChangeset: NewChangeset = {
  summary: "This is a summary",
  releases: [{ name: "package-a", type: "minor" }],
  id: "abc123xy"
};

const simpleChangeset2: NewChangeset = {
  summary: "This is another summary",
  releases: [
    { name: "package-a", type: "patch" },
    { name: "package-b", type: "minor" }
  ],
  id: "abc123fh"
};

let simpleReleasePlan: ReleasePlan = {
  changesets: [simpleChangeset],
  releases: [
    {
      name: "package-a",
      type: "minor",
      oldVersion: "1.0.0",
      newVersion: "1.1.0",
      changesets: [simpleChangeset.id]
    }
  ],
  preState: undefined
};

let secondReleasePlan: ReleasePlan = {
  changesets: [simpleChangeset, simpleChangeset2],
  releases: [
    {
      name: "package-a",
      type: "minor",
      oldVersion: "1.0.0",
      newVersion: "1.1.0",
      changesets: [simpleChangeset.id]
    },
    {
      name: "package-b",
      type: "minor",
      oldVersion: "1.0.0",
      newVersion: "1.1.0",
      changesets: [simpleChangeset2.id]
    }
  ],
  preState: undefined
};

describe("createReleaseCommit", () => {
  it("should handle a single simple releaseObject with one released package", () => {
    const commitStr = createReleaseCommit(simpleReleasePlan, false);
    expect(commitStr).toEqual(outdent`
      RELEASING: Releasing 1 package(s)

      Releases:
        package-a@1.1.0
      
      `);
  });
  it("should skip CI when the flag is passed", () => {
    const commitStr = createReleaseCommit(simpleReleasePlan, true);

    expect(commitStr).toEqual(outdent`
      RELEASING: Releasing 1 package(s)

      Releases:
        package-a@1.1.0

      [skip ci]
    
      `);
  });

  it("should handle a multiple releases from one changeset", () => {
    let releasePlan: ReleasePlan = {
      changesets: [simpleChangeset, simpleChangeset2],
      releases: [
        {
          name: "package-a",
          type: "patch",
          oldVersion: "1.0.0",
          newVersion: "1.0.1",
          changesets: [simpleChangeset.id]
        },
        {
          name: "package-b",
          type: "minor",
          oldVersion: "1.0.0",
          newVersion: "1.1.0",
          changesets: [simpleChangeset2.id]
        }
      ],
      preState: undefined
    };
    const commitStr = createReleaseCommit(releasePlan, false);
    expect(commitStr).toEqual(outdent`
      RELEASING: Releasing 2 package(s)

      Releases:
        package-a@1.0.1
        package-b@1.1.0

    `);
  });

  it("should handle a merging releases from multiple changesets", () => {
    const commitStr = createReleaseCommit(secondReleasePlan, false);

    expect(commitStr).toEqual(outdent`
      RELEASING: Releasing 2 package(s)

      Releases:
        package-a@1.1.0
        package-b@1.1.0

    `);
  });
});
