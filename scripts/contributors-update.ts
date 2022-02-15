const token = process.env.VERDACCIO_TOKEN;
const contributors = require('@dianmora/contributors');
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

async () => {
  const result = await contributors({
    token: token,
    organization: 'verdaccio',
    excludebots,
    allowFork: false,
    allowPrivateRepo: false,
  });
  // eslint-disable-next-line no-console
  console.log('JSON', JSON.stringify(result, null, 4));
};
