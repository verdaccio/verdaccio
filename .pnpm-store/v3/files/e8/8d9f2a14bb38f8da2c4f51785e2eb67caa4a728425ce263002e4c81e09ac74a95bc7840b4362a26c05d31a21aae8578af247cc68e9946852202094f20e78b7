import fs from "fs-extra";
import path from "path";
import prettier from "prettier";
import humanId from "human-id";
import { Changeset } from "@changesets/types";

async function writeChangeset(
  changeset: Changeset,
  cwd: string
): Promise<string> {
  const { summary, releases } = changeset;

  const changesetBase = path.resolve(cwd, ".changeset");

  // Worth understanding that the ID merely needs to be a unique hash to avoid git conflicts
  // experimenting with human readable ids to make finding changesets easier
  const changesetID = humanId({
    separator: "-",
    capitalize: false
  });

  const prettierConfig = await prettier.resolveConfig(cwd);

  const newChangesetPath = path.resolve(changesetBase, `${changesetID}.md`);

  // NOTE: The quotation marks in here are really important even though they are
  // not spec for yaml. This is because package names can contain special
  // characters that will otherwise break the parsing step
  const changesetContents = `---
${releases.map(release => `"${release.name}": ${release.type}`).join("\n")}
---

${summary}
  `;

  await fs.writeFile(
    newChangesetPath,
    prettier.format(changesetContents, {
      ...prettierConfig,
      parser: "markdown"
    })
  );

  return changesetID;
}

export default writeChangeset;
