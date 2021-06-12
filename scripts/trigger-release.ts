import { execSync } from 'child_process';
import { Octokit } from '@octokit/rest';

const [, , /* node */ /* file */ tag] = process.argv;

console.log('tag', tag);

const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_TOKEN}`,
});

// @ts-ignore
const [repoOwner, repoName] = process.env.GITHUB_REPOSITORY.split('/');

console.log('repoName', repoName);
console.log('repoOwner', repoOwner);

(async () => {
  try {
    const changelog = execSync(`git show $GITHUB_SHA --unified=0 CHANGELOG.md | tail +12 | sed -e 's/^\+//'`);
    console.log('changelog', changelog.toString());
    await octokit.repos.createRelease({
      owner: repoOwner,
      repo: repoName,
      tag_name: tag,
      body: changelog.toString(),
      draft: false,
      discussion_category_name: 'Announcements',
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
})();
