"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var yaml = _interopDefault(require("js-yaml"));

const mdRegex = /\s*---([^]*?)\n\s*---\n([^]*)/;

function parseChangesetFile(contents) {
  const execResult = mdRegex.exec(contents);
  if (!execResult) throw new Error(`could not parse changeset - invalid frontmatter: ${contents}`);
  let releases, [, roughReleases, roughSummary] = execResult, summary = roughSummary.trim();
  try {
    const yamlStuff = yaml.safeLoad(roughReleases);
    releases = yamlStuff ? Object.entries(yamlStuff).map(([name, type]) => ({
      name: name,
      type: type
    })) : [];
  } catch (e) {
    throw new Error(`could not parse changeset - invalid frontmatter: ${contents}`);
  }
  if (!releases) throw new Error(`could not parse changeset - unknown error: ${contents}`);
  return {
    releases: releases,
    summary: summary
  };
}

exports.default = parseChangesetFile;
