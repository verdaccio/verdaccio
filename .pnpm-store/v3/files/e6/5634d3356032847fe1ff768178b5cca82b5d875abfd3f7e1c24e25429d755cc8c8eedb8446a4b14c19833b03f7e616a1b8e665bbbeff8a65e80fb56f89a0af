'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const getReleaseLine = async (changeset, type) => {
  const [firstLine, ...futureLines] = changeset.summary.split("\n").map(l => l.trimRight());
  let returnVal = `- ${changeset.commit ? `${changeset.commit}: ` : ""}${firstLine}`;

  if (futureLines.length > 0) {
    returnVal += `\n${futureLines.map(l => `  ${l}`).join("\n")}`;
  }

  return returnVal;
};

const getDependencyReleaseLine = async (changesets, dependenciesUpdated) => {
  if (dependenciesUpdated.length === 0) return "";
  const changesetLinks = changesets.map(changeset => `- Updated dependencies [${changeset.commit}]`);
  const updatedDepenenciesList = dependenciesUpdated.map(dependency => `  - ${dependency.name}@${dependency.newVersion}`);
  return [...changesetLinks, ...updatedDepenenciesList].join("\n");
};

const defaultChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine
};

exports.default = defaultChangelogFunctions;
