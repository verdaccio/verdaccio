"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var config = require("@changesets/config"), git = require("@changesets/git"), resolveFrom = _interopDefault(require("resolve-from")), fs = _interopDefault(require("fs-extra")), path = _interopDefault(require("path")), prettier = _interopDefault(require("prettier")), getVersionRangeType = _interopDefault(require("@changesets/get-version-range-type")), semver = require("semver"), semver__default = _interopDefault(semver), outdent = _interopDefault(require("outdent")), startCase = _interopDefault(require("lodash.startcase"));

const bumpTypes = [ "none", "patch", "minor", "major" ];

function getBumpLevel(type) {
  const level = bumpTypes.indexOf(type);
  if (level < 0) throw new Error(`Unrecognised bump type ${type}`);
  return level;
}

function shouldUpdateDependencyBasedOnConfig(release, {depVersionRange: depVersionRange, depType: depType}, {minReleaseType: minReleaseType, onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange}) {
  if (!semver__default.satisfies(release.version, depVersionRange)) return !0;
  const minLevel = getBumpLevel(minReleaseType);
  let shouldUpdate = getBumpLevel(release.type) >= minLevel;
  return "peerDependencies" === depType && (shouldUpdate = !onlyUpdatePeerDependentsWhenOutOfRange), 
  shouldUpdate;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter((function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    }))), keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach((function(key) {
      _defineProperty(target, key, source[key]);
    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach((function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    }));
  }
  return target;
}

function _defineProperty(obj, key, value) {
  return key in obj ? Object.defineProperty(obj, key, {
    value: value,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : obj[key] = value, obj;
}

const DEPENDENCY_TYPES = [ "dependencies", "devDependencies", "peerDependencies", "optionalDependencies" ];

function versionPackage(release, versionsToUpdate, {updateInternalDependencies: updateInternalDependencies, onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange}) {
  let {newVersion: newVersion, packageJson: packageJson} = release;
  packageJson.version = newVersion;
  for (let depType of DEPENDENCY_TYPES) {
    let deps = packageJson[depType];
    if (deps) for (let {name: name, version: version, type: type} of versionsToUpdate) {
      let depCurrentVersion = deps[name];
      if (!depCurrentVersion || depCurrentVersion.startsWith("file:") || depCurrentVersion.startsWith("link:") || !shouldUpdateDependencyBasedOnConfig({
        version: version,
        type: type
      }, {
        depVersionRange: depCurrentVersion,
        depType: depType
      }, {
        minReleaseType: updateInternalDependencies,
        onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange
      })) continue;
      const usesWorkspaceRange = depCurrentVersion.startsWith("workspace:");
      if (usesWorkspaceRange && (depCurrentVersion = depCurrentVersion.substr(10)), "" !== new semver.Range(depCurrentVersion).range) {
        let newNewRange = `${getVersionRangeType(depCurrentVersion)}${version}`;
        usesWorkspaceRange && (newNewRange = `workspace:${newNewRange}`), deps[name] = newNewRange;
      }
    }
  }
  return _objectSpread({}, release, {
    packageJson: packageJson
  });
}

function createReleaseCommit(releasePlan, commit) {
  const publishableReleases = releasePlan.releases.filter(release => "none" !== release.type), numPackagesReleased = publishableReleases.length, releasesLines = publishableReleases.map(release => `  ${release.name}@${release.newVersion}`).join("\n");
  return outdent`
    RELEASING: Releasing ${numPackagesReleased} package(s)

    Releases:
    ${releasesLines}
    ${commit ? "\n[skip ci]\n" : ""}
`;
}

async function generateChangesForVersionTypeMarkdown(obj, type) {
  let releaseLines = await Promise.all(obj[type]);
  if (releaseLines = releaseLines.filter(x => x), releaseLines.length) return `### ${startCase(type)} Changes\n\n${releaseLines.join("\n")}\n`;
}

async function generateMarkdown(release, releases, changesets, changelogFuncs, changelogOpts, {updateInternalDependencies: updateInternalDependencies, onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange}) {
  if ("none" === release.type) return null;
  const releaseObj = {
    major: [],
    minor: [],
    patch: []
  };
  changesets.forEach(cs => {
    const rls = cs.releases.find(r => r.name === release.name);
    rls && "none" !== rls.type && releaseObj[rls.type].push(changelogFuncs.getReleaseLine(cs, rls.type, changelogOpts));
  });
  let dependentReleases = releases.filter(rel => {
    const dependencyVersionRange = release.packageJson.dependencies ? release.packageJson.dependencies[rel.name] : null, peerDependencyVersionRange = release.packageJson.peerDependencies ? release.packageJson.peerDependencies[rel.name] : null, versionRange = dependencyVersionRange || peerDependencyVersionRange;
    return versionRange && shouldUpdateDependencyBasedOnConfig({
      type: rel.type,
      version: rel.newVersion
    }, {
      depVersionRange: versionRange,
      depType: dependencyVersionRange ? "dependencies" : "peerDependencies"
    }, {
      minReleaseType: updateInternalDependencies,
      onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange
    });
  }), relevantChangesetIds = new Set;
  dependentReleases.forEach(rel => {
    rel.changesets.forEach(cs => {
      relevantChangesetIds.add(cs);
    });
  });
  let relevantChangesets = changesets.filter(cs => relevantChangesetIds.has(cs.id));
  return releaseObj.patch.push(changelogFuncs.getDependencyReleaseLine(relevantChangesets, dependentReleases, changelogOpts)), 
  [ `## ${release.newVersion}`, await generateChangesForVersionTypeMarkdown(releaseObj, "major"), await generateChangesForVersionTypeMarkdown(releaseObj, "minor"), await generateChangesForVersionTypeMarkdown(releaseObj, "patch") ].filter(line => line).join("\n");
}

function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter((function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    }))), keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys$1(Object(source), !0).forEach((function(key) {
      _defineProperty$1(target, key, source[key]);
    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach((function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    }));
  }
  return target;
}

function _defineProperty$1(obj, key, value) {
  return key in obj ? Object.defineProperty(obj, key, {
    value: value,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : obj[key] = value, obj;
}

async function getCommitThatAddsChangeset(changesetId, cwd) {
  let commit = await git.getCommitThatAddsFile(`.changeset/${changesetId}.md`, cwd);
  if (commit) return commit;
  let commitForOldChangeset = await git.getCommitThatAddsFile(`.changeset/${changesetId}/changes.json`, cwd);
  return commitForOldChangeset || void 0;
}

async function applyReleasePlan(releasePlan, packages, config$1 = config.defaultConfig, snapshot) {
  let cwd = packages.root.dir, touchedFiles = [];
  const packagesByName = new Map(packages.packages.map(x => [ x.packageJson.name, x ]));
  let {releases: releases, changesets: changesets} = releasePlan;
  const versionCommit = createReleaseCommit(releasePlan, config$1.commit);
  let releaseWithPackages = releases.map(release => {
    let pkg = packagesByName.get(release.name);
    if (!pkg) throw new Error(`Could not find matching package for release of: ${release.name}`);
    return _objectSpread$1({}, release, {}, pkg);
  }), releaseWithChangelogs = await getNewChangelogEntry(releaseWithPackages, changesets, config$1, cwd);
  void 0 !== releasePlan.preState && void 0 === snapshot && ("exit" === releasePlan.preState.mode ? await fs.remove(path.join(cwd, ".changeset", "pre.json")) : await fs.writeFile(path.join(cwd, ".changeset", "pre.json"), JSON.stringify(releasePlan.preState, null, 2) + "\n"));
  let versionsToUpdate = releases.map(({name: name, newVersion: newVersion, type: type}) => ({
    name: name,
    version: newVersion,
    type: type
  })), finalisedRelease = releaseWithChangelogs.map(release => versionPackage(release, versionsToUpdate, {
    updateInternalDependencies: config$1.updateInternalDependencies,
    onlyUpdatePeerDependentsWhenOutOfRange: config$1.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange
  })), prettierConfig = await prettier.resolveConfig(cwd);
  for (let release of finalisedRelease) {
    let {changelog: changelog, packageJson: packageJson, dir: dir, name: name} = release, pkgJSONPath = path.resolve(dir, "package.json"), changelogPath = path.resolve(dir, "CHANGELOG.md"), parsedConfig = prettier.format(JSON.stringify(packageJson), _objectSpread$1({}, prettierConfig, {
      filepath: pkgJSONPath,
      parser: "json",
      printWidth: 20
    }));
    await fs.writeFile(pkgJSONPath, parsedConfig), touchedFiles.push(pkgJSONPath), changelog && changelog.length > 0 && (await updateChangelog(changelogPath, changelog, name, prettierConfig), 
    touchedFiles.push(changelogPath));
  }
  if (void 0 === releasePlan.preState || "exit" === releasePlan.preState.mode) {
    let changesetFolder = path.resolve(cwd, ".changeset");
    await Promise.all(changesets.map(async changeset => {
      let changesetPath = path.resolve(changesetFolder, `${changeset.id}.md`), changesetFolderPath = path.resolve(changesetFolder, changeset.id);
      await fs.pathExists(changesetPath) ? changeset.releases.find(release => config$1.ignore.includes(release.name)) || (touchedFiles.push(changesetPath), 
      await fs.remove(changesetPath)) : await fs.pathExists(changesetFolderPath) && (touchedFiles.push(changesetFolderPath), 
      await fs.remove(changesetFolderPath));
    }));
  }
  if (config$1.commit) {
    let newTouchedFilesArr = [ ...touchedFiles ];
    for (;newTouchedFilesArr.length > 0; ) {
      let file = newTouchedFilesArr.shift();
      await git.add(path.relative(cwd, file), cwd);
    }
    await git.commit(versionCommit, cwd) || console.error("Changesets ran into trouble committing your files");
  }
  return touchedFiles;
}

async function getNewChangelogEntry(releasesWithPackage, changesets, config, cwd) {
  let changelogOpts, getChangelogFuncs = {
    getReleaseLine: () => Promise.resolve(""),
    getDependencyReleaseLine: () => Promise.resolve("")
  };
  if (config.changelog) {
    changelogOpts = config.changelog[1];
    let changesetPath = path.join(cwd, ".changeset"), changelogPath = resolveFrom(changesetPath, config.changelog[0]), possibleChangelogFunc = require(changelogPath);
    if (possibleChangelogFunc.default && (possibleChangelogFunc = possibleChangelogFunc.default), 
    "function" != typeof possibleChangelogFunc.getReleaseLine || "function" != typeof possibleChangelogFunc.getDependencyReleaseLine) throw new Error("Could not resolve changelog generation functions");
    getChangelogFuncs = possibleChangelogFunc;
  }
  let moddedChangesets = await Promise.all(changesets.map(async cs => _objectSpread$1({}, cs, {
    commit: await getCommitThatAddsChangeset(cs.id, cwd)
  })));
  return Promise.all(releasesWithPackage.map(async release => _objectSpread$1({}, release, {
    changelog: await generateMarkdown(release, releasesWithPackage, moddedChangesets, getChangelogFuncs, changelogOpts, {
      updateInternalDependencies: config.updateInternalDependencies,
      onlyUpdatePeerDependentsWhenOutOfRange: config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange
    })
  }))).catch(e => {
    throw console.error("The following error was encountered while generating changelog entries"), 
    console.error("We have escaped applying the changesets, and no files should have been affected"), 
    e;
  });
}

async function updateChangelog(changelogPath, changelog, name, prettierConfig) {
  let templateString = `\n\n${changelog.trim()}\n`;
  try {
    fs.existsSync(changelogPath) ? await prependFile(changelogPath, templateString, name, prettierConfig) : await fs.writeFile(changelogPath, `# ${name}${templateString}`);
  } catch (e) {
    console.warn(e);
  }
}

async function prependFile(filePath, data, name, prettierConfig) {
  const fileData = fs.readFileSync(filePath).toString();
  if (!fileData) {
    const completelyNewChangelog = `# ${name}${data}`;
    return void await fs.writeFile(filePath, prettier.format(completelyNewChangelog, _objectSpread$1({}, prettierConfig, {
      filepath: filePath,
      parser: "markdown"
    })));
  }
  const newChangelog = fileData.replace("\n", data);
  await fs.writeFile(filePath, prettier.format(newChangelog, _objectSpread$1({}, prettierConfig, {
    filepath: filePath,
    parser: "markdown"
  })));
}

exports.default = applyReleasePlan;
