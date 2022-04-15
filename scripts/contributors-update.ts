import contributors from '@dianmora/contributors';
import fs from 'fs/promises';
import path from 'path';

const token = process.env.TOKEN;
const excludebots = [
  'verdacciobot',
  'github-actions[bot]',
  'dependabot-preview[bot]',
  'dependabot[bot]',
  '64b2b6d12bfe4baae7dad3d01',
  'greenkeeper[bot]',
  'snyk-bot',
  'allcontributors[bot]',
  'renovate[bot]',
  'undefined',
  'renovate-bot',
];

(async () => {
  try {
    // Awesome script made by https://github.com/dianmorales
    const result = await contributors({
      token: token as string,
      organization: 'verdaccio',
      excludebots,
      allowFork: false,
      allowPrivateRepo: false,
    });
    const pathContributorsFile = path.join(
      __dirname,
      '../packages/tools/docusaurus-plugin-contributors/src/contributors.json'
    );
    // for the website
    await fs.writeFile(pathContributorsFile, JSON.stringify(result, null, 4));
    const contributorsListId = result.map((contributor: any) => {
      return { username: contributor?.login, id: contributor.id };
    });
    // .sort()
    // .slice(0, 15);
    // for the  ui, list of ids to be added on the contributors.
    const pathContributorsUIFile = path.join(
      __dirname,
      '../packages/plugins/ui-theme/src/App/Header/generated_contributors_list.json'
    );
    await fs.writeFile(pathContributorsUIFile, JSON.stringify(contributorsListId, null, 4));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('error on update', err);
    process.exit(1);
  }
})();
