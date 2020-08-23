import fixtures from "fixturez";

import fs from "fs-extra";
import path from "path";
import parse from "@changesets/parse";
import { Release } from "@changesets/types";
import writeChangeset from "./";

import humanId from "human-id";

const f = fixtures(__dirname);

jest.mock("human-id");

const simpleChangeset: { summary: string; releases: Release[] } = {
  summary: "This is a summary",
  releases: [{ name: "pkg-a", type: "minor" }]
};

const emptyChangeset: { summary: string; releases: Release[] } = {
  summary: "",
  releases: []
};

describe("simple project", () => {
  let cwd: string;

  beforeEach(async () => {
    cwd = await f.copy("simple-project");
  });

  it("should write a changeset", async () => {
    const changesetID = "ascii";
    // @ts-ignore
    humanId.mockReturnValueOnce(changesetID);

    await writeChangeset(simpleChangeset, cwd);

    const mdPath = path.join(cwd, ".changeset", `${changesetID}.md`);
    const mdContent = await fs.readFile(mdPath, "utf-8");

    expect(parse(mdContent)).toEqual(simpleChangeset);
  });
  it("should write an empty changeset", async () => {
    const changesetID = "ascii";
    // @ts-ignore
    humanId.mockReturnValueOnce(changesetID);

    await writeChangeset(emptyChangeset, cwd);

    const mdPath = path.join(cwd, ".changeset", `${changesetID}.md`);
    const mdContent = await fs.readFile(mdPath, "utf-8");

    expect(parse(mdContent)).toEqual(emptyChangeset);
  });
});
