import {
  ReleasePlan,
  Config,
  ChangelogFunctions,
  NewChangeset,
  ModCompWithPackage
} from "@changesets/types";

import { defaultConfig } from "@changesets/config";
import * as git from "@changesets/git";
import resolveFrom from "resolve-from";
import { Packages } from "@manypkg/get-packages";

import fs from "fs-extra";
import path from "path";
import prettier from "prettier";

import versionPackage from "./version-package";
import createVersionCommit from "./createVersionCommit";
import getChangelogEntry from "./get-changelog-entry";

async function getCommitThatAddsChangeset(changesetId: string, cwd: string) {
  let commit = await git.getCommitThatAddsFile(
    `.changeset/${changesetId}.md`,
    cwd
  );
  if (commit) {
    return commit;
  }
  let commitForOldChangeset = await git.getCommitThatAddsFile(
    `.changeset/${changesetId}/changes.json`,
    cwd
  );
  if (commitForOldChangeset) {
    return commitForOldChangeset;
  }
}

export default async function applyReleasePlan(
  releasePlan: ReleasePlan,
  packages: Packages,
  config: Config = defaultConfig,
  snapshot?: string | boolean
) {
  let cwd = packages.root.dir;

  let touchedFiles = [];

  const packagesByName = new Map(
    packages.packages.map(x => [x.packageJson.name, x])
  );

  let { releases, changesets } = releasePlan;

  const versionCommit = createVersionCommit(releasePlan, config.commit);

  let releaseWithPackages = releases.map(release => {
    let pkg = packagesByName.get(release.name);
    if (!pkg)
      throw new Error(
        `Could not find matching package for release of: ${release.name}`
      );
    return {
      ...release,
      ...pkg
    };
  });

  // I think this might be the wrong place to do this, but gotta do it somewhere -  add changelog entries to releases
  let releaseWithChangelogs = await getNewChangelogEntry(
    releaseWithPackages,
    changesets,
    config,
    cwd
  );

  if (releasePlan.preState !== undefined && snapshot === undefined) {
    if (releasePlan.preState.mode === "exit") {
      await fs.remove(path.join(cwd, ".changeset", "pre.json"));
    } else {
      await fs.writeFile(
        path.join(cwd, ".changeset", "pre.json"),
        JSON.stringify(releasePlan.preState, null, 2) + "\n"
      );
    }
  }

  let versionsToUpdate = releases.map(({ name, newVersion, type }) => ({
    name,
    version: newVersion,
    type
  }));

  // iterate over releases updating packages
  let finalisedRelease = releaseWithChangelogs.map(release => {
    return versionPackage(release, versionsToUpdate, {
      updateInternalDependencies: config.updateInternalDependencies,
      onlyUpdatePeerDependentsWhenOutOfRange:
        config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH
          .onlyUpdatePeerDependentsWhenOutOfRange
    });
  });

  let prettierConfig = await prettier.resolveConfig(cwd);

  for (let release of finalisedRelease) {
    let { changelog, packageJson, dir, name } = release;
    let pkgJSONPath = path.resolve(dir, "package.json");

    let changelogPath = path.resolve(dir, "CHANGELOG.md");

    let parsedConfig = prettier.format(JSON.stringify(packageJson), {
      ...prettierConfig,
      filepath: pkgJSONPath,
      parser: "json",
      printWidth: 20
    });

    await fs.writeFile(pkgJSONPath, parsedConfig);
    touchedFiles.push(pkgJSONPath);

    if (changelog && changelog.length > 0) {
      await updateChangelog(changelogPath, changelog, name, prettierConfig);
      touchedFiles.push(changelogPath);
    }
  }

  if (
    releasePlan.preState === undefined ||
    releasePlan.preState.mode === "exit"
  ) {
    let changesetFolder = path.resolve(cwd, ".changeset");
    await Promise.all(
      changesets.map(async changeset => {
        let changesetPath = path.resolve(changesetFolder, `${changeset.id}.md`);
        let changesetFolderPath = path.resolve(changesetFolder, changeset.id);
        if (await fs.pathExists(changesetPath)) {
          // DO NOT remove changeset for ignored packages
          // Mixed changeset that contains both ignored packages and not ignored packages are disallowed
          // At this point, we know there is no such changeset, because otherwise the program would've already failed,
          // so we just check if any ignored package exists in this changeset, and only remove it if none exists
          // Ignored list is added in v2, so we don't need to do it for v1 changesets
          if (
            !changeset.releases.find(release =>
              config.ignore.includes(release.name)
            )
          ) {
            touchedFiles.push(changesetPath);
            await fs.remove(changesetPath);
          }
          // TO REMOVE LOGIC - this works to remove v1 changesets. We should be removed in the future
        } else if (await fs.pathExists(changesetFolderPath)) {
          touchedFiles.push(changesetFolderPath);
          await fs.remove(changesetFolderPath);
        }
      })
    );
  }

  if (config.commit) {
    let newTouchedFilesArr = [...touchedFiles];
    // Note, git gets angry if you try and have two git actions running at once
    // So we need to be careful that these iterations are properly sequential
    while (newTouchedFilesArr.length > 0) {
      let file = newTouchedFilesArr.shift();
      await git.add(path.relative(cwd, file!), cwd);
    }

    let commit = await git.commit(versionCommit, cwd);

    if (!commit) {
      console.error("Changesets ran into trouble committing your files");
    }
  }

  // We return the touched files mostly for testing purposes
  return touchedFiles;
}

async function getNewChangelogEntry(
  releasesWithPackage: ModCompWithPackage[],
  changesets: NewChangeset[],
  config: Config,
  cwd: string
) {
  let getChangelogFuncs: ChangelogFunctions = {
    getReleaseLine: () => Promise.resolve(""),
    getDependencyReleaseLine: () => Promise.resolve("")
  };
  let changelogOpts: any;
  if (config.changelog) {
    changelogOpts = config.changelog[1];
    let changesetPath = path.join(cwd, ".changeset");
    let changelogPath = resolveFrom(changesetPath, config.changelog[0]);

    let possibleChangelogFunc = require(changelogPath);
    if (possibleChangelogFunc.default) {
      possibleChangelogFunc = possibleChangelogFunc.default;
    }
    if (
      typeof possibleChangelogFunc.getReleaseLine === "function" &&
      typeof possibleChangelogFunc.getDependencyReleaseLine === "function"
    ) {
      getChangelogFuncs = possibleChangelogFunc;
    } else {
      throw new Error("Could not resolve changelog generation functions");
    }
  }

  let moddedChangesets = await Promise.all(
    changesets.map(async cs => ({
      ...cs,
      commit: await getCommitThatAddsChangeset(cs.id, cwd)
    }))
  );

  return Promise.all(
    releasesWithPackage.map(async release => {
      let changelog = await getChangelogEntry(
        release,
        releasesWithPackage,
        moddedChangesets,
        getChangelogFuncs,
        changelogOpts,
        {
          updateInternalDependencies: config.updateInternalDependencies,
          onlyUpdatePeerDependentsWhenOutOfRange:
            config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH
              .onlyUpdatePeerDependentsWhenOutOfRange
        }
      );

      return {
        ...release,
        changelog
      };
    })
  ).catch(e => {
    console.error(
      "The following error was encountered while generating changelog entries"
    );
    console.error(
      "We have escaped applying the changesets, and no files should have been affected"
    );
    throw e;
  });
}

async function updateChangelog(
  changelogPath: string,
  changelog: string,
  name: string,
  prettierConfig: prettier.Options | null
) {
  let templateString = `\n\n${changelog.trim()}\n`;

  try {
    if (fs.existsSync(changelogPath)) {
      await prependFile(changelogPath, templateString, name, prettierConfig);
    } else {
      await fs.writeFile(changelogPath, `# ${name}${templateString}`);
    }
  } catch (e) {
    console.warn(e);
  }
}

async function prependFile(
  filePath: string,
  data: string,
  name: string,
  prettierConfig?: prettier.Options | null
) {
  const fileData = fs.readFileSync(filePath).toString();
  // if the file exists but doesn't have the header, we'll add it in
  if (!fileData) {
    const completelyNewChangelog = `# ${name}${data}`;
    await fs.writeFile(
      filePath,
      prettier.format(completelyNewChangelog, {
        ...prettierConfig,
        filepath: filePath,
        parser: "markdown"
      })
    );
    return;
  }
  const newChangelog = fileData.replace("\n", data);

  await fs.writeFile(
    filePath,
    prettier.format(newChangelog, {
      ...prettierConfig,
      filepath: filePath,
      parser: "markdown"
    })
  );
}
