import outdent from "outdent";

import parse from "./";

describe("parsing a changeset", () => {
  it("should parse a changeset", () => {
    const changesetMd = outdent`---
    "cool-package": minor
    ---

    Nice simple summary
    `;

    const changeset = parse(changesetMd);
    expect(changeset).toEqual({
      releases: [{ name: "cool-package", type: "minor" }],
      summary: "Nice simple summary"
    });
  });
  it("should parse major, minor, and patch changes", () => {
    const changesetMd = outdent`---
    "cool-package": minor
    "cool-package2": major
    "cool-package3": patch
    ---

    Nice simple summary
    `;

    const changeset = parse(changesetMd);
    expect(changeset).toEqual({
      releases: [
        { name: "cool-package", type: "minor" },
        { name: "cool-package2", type: "major" },
        { name: "cool-package3", type: "patch" }
      ],
      summary: "Nice simple summary"
    });
  });
  it("should parse a changeset with a scoped package", () => {
    const changesetMd = outdent`---
    "@cool/package": minor
    ---

    Nice simple summary
    `;

    const changeset = parse(changesetMd);
    expect(changeset).toEqual({
      releases: [{ name: "@cool/package", type: "minor" }],
      summary: "Nice simple summary"
    });
  });
  it("should parse a changeset with multiline summary", () => {
    const expectedSummary = outdent`Let us go then you and I,
    When the evening is spread out against the sky
    Like a patient, etherized upon a table.

    - The Lovesong of J Alfred Prufrock, T. S. Eliot`;

    const changesetMd = outdent`---
    "cool-package": minor
    ---

    Let us go then you and I,
    When the evening is spread out against the sky
    Like a patient, etherized upon a table.

    - The Lovesong of J Alfred Prufrock, T. S. Eliot
    `;

    const changeset = parse(changesetMd);
    expect(changeset).toEqual({
      releases: [{ name: "cool-package", type: "minor" }],
      summary: expectedSummary
    });
  });
  it("should parse a changeset with multiple packages and multiline summary", () => {
    const expectedSummary = outdent`Let us go then you and I,
    When the evening is spread out against the sky
    Like a patient, etherized upon a table.

    - The Lovesong of J Alfred Prufrock, T. S. Eliot`;

    const changesetMd = outdent`---
    "cool-package": minor
    "best-package": patch
    ---

    Let us go then you and I,
    When the evening is spread out against the sky
    Like a patient, etherized upon a table.

    - The Lovesong of J Alfred Prufrock, T. S. Eliot
    `;

    const changeset = parse(changesetMd);
    expect(changeset).toEqual({
      releases: [
        { name: "cool-package", type: "minor" },
        { name: "best-package", type: "patch" }
      ],
      summary: expectedSummary
    });
  });
  it("should be fine if a packageName includes ---", () => {
    const changesetMd = outdent`---
    "cool---package": minor
    ---

    Nice simple summary
    `;

    const changeset = parse(changesetMd);
    expect(changeset).toEqual({
      releases: [{ name: "cool---package", type: "minor" }],
      summary: "Nice simple summary"
    });
  });
  it("should be fine if the summary body includes ---", () => {
    const expectedSummary = outdent`---
    Nice simple summary---that has this`;

    const changesetMd = outdent`---
    "cool-package": minor
    ---

    ---
    Nice simple summary---that has this

    `;

    const changeset = parse(changesetMd);
    expect(changeset).toEqual({
      releases: [{ name: "cool-package", type: "minor" }],
      summary: expectedSummary
    });
  });
  it("should be fine if the changeset is empty", () => {
    const changesetMd = outdent`---
    ---

    `;

    const changeset = parse(changesetMd);
    expect(changeset).toEqual({
      releases: [],
      summary: ""
    });
  });
});
