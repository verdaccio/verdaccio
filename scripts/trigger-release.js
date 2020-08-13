/**
 * @prettier
 */

'use strict';

const [, , /* node */ /* file */ tag] = process.argv;

const getStdin = require('get-stdin');
const Octokit = require('@octokit/rest');
const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_TOKEN}`,
});

const [repoOwner, repoName] = process.env.GITHUB_REPOSITORY.split('/');

getStdin()
  .then((changelog) =>
    octokit.repos.createRelease({
      owner: repoOwner,
      repo: repoName,
      tag_name: tag,
      body: changelog,
      draft: false,
    })
  )
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
