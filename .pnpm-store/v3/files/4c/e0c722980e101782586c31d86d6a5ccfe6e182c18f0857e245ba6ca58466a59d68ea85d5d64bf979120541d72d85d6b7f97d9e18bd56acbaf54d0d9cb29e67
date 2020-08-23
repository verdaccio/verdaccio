"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

const getReleaseLine = async (changeset, type) => {
  const [firstLine, ...futureLines] = changeset.summary.split("\n").map(l => l.trimRight());
  let returnVal = `- ${changeset.commit ? `${changeset.commit}: ` : ""}${firstLine}`;
  return futureLines.length > 0 && (returnVal += `\n${futureLines.map(l => `  ${l}`).join("\n")}`), 
  returnVal;
}, getDependencyReleaseLine = async (changesets, dependenciesUpdated) => {
  if (0 === dependenciesUpdated.length) return "";
  return [ ...changesets.map(changeset => `- Updated dependencies [${changeset.commit}]`), ...dependenciesUpdated.map(dependency => `  - ${dependency.name}@${dependency.newVersion}`) ].join("\n");
}, defaultChangelogFunctions = {
  getReleaseLine: getReleaseLine,
  getDependencyReleaseLine: getDependencyReleaseLine
};

exports.default = defaultChangelogFunctions;
