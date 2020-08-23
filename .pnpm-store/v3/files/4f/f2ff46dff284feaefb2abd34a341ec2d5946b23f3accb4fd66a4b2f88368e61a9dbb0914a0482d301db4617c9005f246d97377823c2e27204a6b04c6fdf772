import { defaultConfig } from '@changesets/config';
import { add, commit, getCommitThatAddsFile } from '@changesets/git';
import resolveFrom from 'resolve-from';
import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';
import getVersionRangeType from '@changesets/get-version-range-type';
import semver, { Range } from 'semver';
import outdent from 'outdent';
import startCase from 'lodash.startcase';

/**
 * Shared utility functions and business logic
 */
const bumpTypes = ["none", "patch", "minor", "major"];
/* Converts a bump type into a numeric level to indicate order */

function getBumpLevel(type) {
  const level = bumpTypes.indexOf(type);

  if (level < 0) {
    throw new Error(`Unrecognised bump type ${type}`);
  }

  return level;
}

function shouldUpdateDependencyBasedOnConfig(release, {
  depVersionRange,
  depType
}, {
  minReleaseType,
  onlyUpdatePeerDependentsWhenOutOfRange
}) {
  if (!semver.satisfies(release.version, depVersionRange)) {
    // Dependencies leaving semver range should always be updated
    return true;
  }

  const minLevel = getBumpLevel(minReleaseType);
  let shouldUpdate = getBumpLevel(release.type) >= minLevel;

  if (depType === "peerDependencies") {
    shouldUpdate = !onlyUpdatePeerDependentsWhenOutOfRange;
  }

  return shouldUpdate;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
const DEPENDENCY_TYPES = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
function versionPackage(release, versionsToUpdate, {
  updateInternalDependencies,
  onlyUpdatePeerDependentsWhenOutOfRange
}) {
  let {
    newVersion,
    packageJson
  } = release;
  packageJson.version = newVersion;

  for (let depType of DEPENDENCY_TYPES) {
    let deps = packageJson[depType];

    if (deps) {
      for (let {
        name,
        version,
        type
      } of versionsToUpdate) {
        let depCurrentVersion = deps[name];
        if (!depCurrentVersion || depCurrentVersion.startsWith("file:") || depCurrentVersion.startsWith("link:") || !shouldUpdateDependencyBasedOnConfig({
          version,
          type
        }, {
          depVersionRange: depCurrentVersion,
          depType
        }, {
          minReleaseType: updateInternalDependencies,
          onlyUpdatePeerDependentsWhenOutOfRange
        })) continue;
        const usesWorkspaceRange = depCurrentVersion.startsWith("workspace:");

        if (usesWorkspaceRange) {
          depCurrentVersion = depCurrentVersion.substr(10);
        }

        if ( // an empty string is the normalised version of x/X/*
        // we don't want to change these versions because they will match
        // any version and if someone makes the range that
        // they probably want it to stay like that
        new Range(depCurrentVersion).range !== "") {
          let rangeType = getVersionRangeType(depCurrentVersion);
          let newNewRange = `${rangeType}${version}`;
          if (usesWorkspaceRange) newNewRange = `workspace:${newNewRange}`;
          deps[name] = newNewRange;
        }
      }
    }
  }

  return _objectSpread({}, release, {
    packageJson
  });
}

// This data is not depended upon by the publish step, but can be useful for other tools/debugging
// I believe it would be safe to deprecate this format
function createReleaseCommit(releasePlan, commit) {
  const publishableReleases = releasePlan.releases.filter(release => release.type !== "none");
  const numPackagesReleased = publishableReleases.length;
  const releasesLines = publishableReleases.map(release => `  ${release.name}@${release.newVersion}`).join("\n");
  return outdent`
    RELEASING: Releasing ${numPackagesReleased} package(s)

    Releases:
    ${releasesLines}
    ${commit ? "\n[skip ci]\n" : ""}
`;
}

async function generateChangesForVersionTypeMarkdown(obj, type) {
  let releaseLines = await Promise.all(obj[type]);
  releaseLines = releaseLines.filter(x => x);

  if (releaseLines.length) {
    return `### ${startCase(type)} Changes\n\n${releaseLines.join("\n")}\n`;
  }
} // release is the package and version we are releasing


async function generateMarkdown(release, releases, changesets, changelogFuncs, changelogOpts, {
  updateInternalDependencies,
  onlyUpdatePeerDependentsWhenOutOfRange
}) {
  if (release.type === "none") return null;
  const releaseObj = {
    major: [],
    minor: [],
    patch: []
  }; // I sort of feel we can do better, as ComprehensiveReleases have an array
  // of the relevant changesets but since we need the version type for the
  // release in the changeset, I don't know if we can
  // We can filter here, but that just adds another iteration over this list

  changesets.forEach(cs => {
    const rls = cs.releases.find(r => r.name === release.name);

    if (rls && rls.type !== "none") {
      releaseObj[rls.type].push(changelogFuncs.getReleaseLine(cs, rls.type, changelogOpts));
    }
  });
  let dependentReleases = releases.filter(rel => {
    const dependencyVersionRange = release.packageJson.dependencies ? release.packageJson.dependencies[rel.name] : null;
    const peerDependencyVersionRange = release.packageJson.peerDependencies ? release.packageJson.peerDependencies[rel.name] : null;
    const versionRange = dependencyVersionRange || peerDependencyVersionRange;
    return versionRange && shouldUpdateDependencyBasedOnConfig({
      type: rel.type,
      version: rel.newVersion
    }, {
      depVersionRange: versionRange,
      depType: dependencyVersionRange ? "dependencies" : "peerDependencies"
    }, {
      minReleaseType: updateInternalDependencies,
      onlyUpdatePeerDependentsWhenOutOfRange
    });
  });
  let relevantChangesetIds = new Set();
  dependentReleases.forEach(rel => {
    rel.changesets.forEach(cs => {
      relevantChangesetIds.add(cs);
    });
  });
  let relevantChangesets = changesets.filter(cs => relevantChangesetIds.has(cs.id));
  releaseObj.patch.push(changelogFuncs.getDependencyReleaseLine(relevantChangesets, dependentReleases, changelogOpts));
  return [`## ${release.newVersion}`, await generateChangesForVersionTypeMarkdown(releaseObj, "major"), await generateChangesForVersionTypeMarkdown(releaseObj, "minor"), await generateChangesForVersionTypeMarkdown(releaseObj, "patch")].filter(line => line).join("\n");
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function getCommitThatAddsChangeset(changesetId, cwd) {
  let commit = await getCommitThatAddsFile(`.changeset/${changesetId}.md`, cwd);

  if (commit) {
    return commit;
  }

  let commitForOldChangeset = await getCommitThatAddsFile(`.changeset/${changesetId}/changes.json`, cwd);

  if (commitForOldChangeset) {
    return commitForOldChangeset;
  }
}

async function applyReleasePlan(releasePlan, packages, config = defaultConfig, snapshot) {
  let cwd = packages.root.dir;
  let touchedFiles = [];
  const packagesByName = new Map(packages.packages.map(x => [x.packageJson.name, x]));
  let {
    releases,
    changesets
  } = releasePlan;
  const versionCommit = createReleaseCommit(releasePlan, config.commit);
  let releaseWithPackages = releases.map(release => {
    let pkg = packagesByName.get(release.name);
    if (!pkg) throw new Error(`Could not find matching package for release of: ${release.name}`);
    return _objectSpread$1({}, release, {}, pkg);
  }); // I think this might be the wrong place to do this, but gotta do it somewhere -  add changelog entries to releases

  let releaseWithChangelogs = await getNewChangelogEntry(releaseWithPackages, changesets, config, cwd);

  if (releasePlan.preState !== undefined && snapshot === undefined) {
    if (releasePlan.preState.mode === "exit") {
      await fs.remove(path.join(cwd, ".changeset", "pre.json"));
    } else {
      await fs.writeFile(path.join(cwd, ".changeset", "pre.json"), JSON.stringify(releasePlan.preState, null, 2) + "\n");
    }
  }

  let versionsToUpdate = releases.map(({
    name,
    newVersion,
    type
  }) => ({
    name,
    version: newVersion,
    type
  })); // iterate over releases updating packages

  let finalisedRelease = releaseWithChangelogs.map(release => {
    return versionPackage(release, versionsToUpdate, {
      updateInternalDependencies: config.updateInternalDependencies,
      onlyUpdatePeerDependentsWhenOutOfRange: config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange
    });
  });
  let prettierConfig = await prettier.resolveConfig(cwd);

  for (let release of finalisedRelease) {
    let {
      changelog,
      packageJson,
      dir,
      name
    } = release;
    let pkgJSONPath = path.resolve(dir, "package.json");
    let changelogPath = path.resolve(dir, "CHANGELOG.md");
    let parsedConfig = prettier.format(JSON.stringify(packageJson), _objectSpread$1({}, prettierConfig, {
      filepath: pkgJSONPath,
      parser: "json",
      printWidth: 20
    }));
    await fs.writeFile(pkgJSONPath, parsedConfig);
    touchedFiles.push(pkgJSONPath);

    if (changelog && changelog.length > 0) {
      await updateChangelog(changelogPath, changelog, name, prettierConfig);
      touchedFiles.push(changelogPath);
    }
  }

  if (releasePlan.preState === undefined || releasePlan.preState.mode === "exit") {
    let changesetFolder = path.resolve(cwd, ".changeset");
    await Promise.all(changesets.map(async changeset => {
      let changesetPath = path.resolve(changesetFolder, `${changeset.id}.md`);
      let changesetFolderPath = path.resolve(changesetFolder, changeset.id);

      if (await fs.pathExists(changesetPath)) {
        // DO NOT remove changeset for ignored packages
        // Mixed changeset that contains both ignored packages and not ignored packages are disallowed
        // At this point, we know there is no such changeset, because otherwise the program would've already failed,
        // so we just check if any ignored package exists in this changeset, and only remove it if none exists
        // Ignored list is added in v2, so we don't need to do it for v1 changesets
        if (!changeset.releases.find(release => config.ignore.includes(release.name))) {
          touchedFiles.push(changesetPath);
          await fs.remove(changesetPath);
        } // TO REMOVE LOGIC - this works to remove v1 changesets. We should be removed in the future

      } else if (await fs.pathExists(changesetFolderPath)) {
        touchedFiles.push(changesetFolderPath);
        await fs.remove(changesetFolderPath);
      }
    }));
  }

  if (config.commit) {
    let newTouchedFilesArr = [...touchedFiles]; // Note, git gets angry if you try and have two git actions running at once
    // So we need to be careful that these iterations are properly sequential

    while (newTouchedFilesArr.length > 0) {
      let file = newTouchedFilesArr.shift();
      await add(path.relative(cwd, file), cwd);
    }

    let commit$1 = await commit(versionCommit, cwd);

    if (!commit$1) {
      console.error("Changesets ran into trouble committing your files");
    }
  } // We return the touched files mostly for testing purposes


  return touchedFiles;
}

async function getNewChangelogEntry(releasesWithPackage, changesets, config, cwd) {
  let getChangelogFuncs = {
    getReleaseLine: () => Promise.resolve(""),
    getDependencyReleaseLine: () => Promise.resolve("")
  };
  let changelogOpts;

  if (config.changelog) {
    changelogOpts = config.changelog[1];
    let changesetPath = path.join(cwd, ".changeset");
    let changelogPath = resolveFrom(changesetPath, config.changelog[0]);

    let possibleChangelogFunc = require(changelogPath);

    if (possibleChangelogFunc.default) {
      possibleChangelogFunc = possibleChangelogFunc.default;
    }

    if (typeof possibleChangelogFunc.getReleaseLine === "function" && typeof possibleChangelogFunc.getDependencyReleaseLine === "function") {
      getChangelogFuncs = possibleChangelogFunc;
    } else {
      throw new Error("Could not resolve changelog generation functions");
    }
  }

  let moddedChangesets = await Promise.all(changesets.map(async cs => _objectSpread$1({}, cs, {
    commit: await getCommitThatAddsChangeset(cs.id, cwd)
  })));
  return Promise.all(releasesWithPackage.map(async release => {
    let changelog = await generateMarkdown(release, releasesWithPackage, moddedChangesets, getChangelogFuncs, changelogOpts, {
      updateInternalDependencies: config.updateInternalDependencies,
      onlyUpdatePeerDependentsWhenOutOfRange: config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange
    });
    return _objectSpread$1({}, release, {
      changelog
    });
  })).catch(e => {
    console.error("The following error was encountered while generating changelog entries");
    console.error("We have escaped applying the changesets, and no files should have been affected");
    throw e;
  });
}

async function updateChangelog(changelogPath, changelog, name, prettierConfig) {
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

async function prependFile(filePath, data, name, prettierConfig) {
  const fileData = fs.readFileSync(filePath).toString(); // if the file exists but doesn't have the header, we'll add it in

  if (!fileData) {
    const completelyNewChangelog = `# ${name}${data}`;
    await fs.writeFile(filePath, prettier.format(completelyNewChangelog, _objectSpread$1({}, prettierConfig, {
      filepath: filePath,
      parser: "markdown"
    })));
    return;
  }

  const newChangelog = fileData.replace("\n", data);
  await fs.writeFile(filePath, prettier.format(newChangelog, _objectSpread$1({}, prettierConfig, {
    filepath: filePath,
    parser: "markdown"
  })));
}

export default applyReleasePlan;
