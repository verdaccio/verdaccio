import { Octokit } from '@octokit/rest';

const [, , /* node */ /* file */ tag] = process.argv;
// eslint-disable-next-line no-console
console.log('tag', tag);

const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_TOKEN}`,
});

(async () => {
  try {
    // eslint-disable-next-line no-console
    await octokit.repos.createRelease({
      owner: 'verdaccio',
      repo: 'verdaccio',
      tag_name: tag,
      body: '## Release /n TBA',
      draft: true,
      discussion_category_name: 'Announcements',
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`release script has failed, details: ${err}`);
    process.exit(1);
  }
})();
