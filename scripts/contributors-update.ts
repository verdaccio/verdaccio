import contributors from '@dianmora/contributors';
import fs from 'fs/promises';
import path from 'path';

const token = process.env.TOKEN;
const excludebots = [
  'verdacciobot',
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
      token,
      organization: 'verdaccio',
      excludebots,
      allowFork: false,
      allowPrivateRepo: false,
    });
    const pathContributorsFile = path.join(
      __dirname,
      '../packages/tools/docusaurus-plugin-contributors/src/contributors.json'
    );
    await fs.writeFile(pathContributorsFile, JSON.stringify(result, null, 4));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('error on update', err);
    process.exit(1);
  }
})();
