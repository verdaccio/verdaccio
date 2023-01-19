import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

const [, , /* node */ /* file */ tag] = process.argv;
// eslint-disable-next-line no-console
console.log('tag', tag);

const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_TOKEN}`,
});

(async () => {
  try {
    // retrieve the latest changes from CHANGELOG.md
    const changelog = execSync(
      `git show -1 --unified=0  CHANGELOG.md | tail +12 | sed -e 's/^\+//'`
    );
    // eslint-disable-next-line no-console
    console.log('changelog', changelog.toString());
    await octokit.repos.createRelease({
      owner: 'verdaccio',
      repo: 'verdaccio',
      tag_name: tag,
      body: changelog.toString(),
      draft: true,
      discussion_category_name: 'Announcements',
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`release script has failed, details: ${err}`);
    process.exit(1);
  }
})();
