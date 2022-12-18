import fs from 'fs/promises';
import got from 'got';
import path from 'path';

(async () => {
  const data = require('../website/src/components/EcosystemSearch/addons.json');
  for (let item of data.addons) {
    const d = await got(`https://registry.npmjs.org/${item.name}`).json();
    const apiDownloads = await got(
      `https://api.npmjs.org/downloads/point/last-month/${item.name}`
    ).json();
    // @ts-ignore
    item.description = d.description;
    item.url = `https://www.npmjs.org/${item.name}`;
    item.registry = `https://registry.npmjs.org/${item.name}`;
    item.bundled = typeof item.bundled === 'boolean' ? item.bundled : false;
    item.origin = item.origin ? item.origin : 'community';
    item.category = item.category ? item.category : 'authentication';
    // @ts-ignore
    item.latest = d['dist-tags'].latest;
    // @ts-ignore
    item.downloads = apiDownloads.downloads;
    // console.log('d', item);
  }
  await fs.writeFile(
    path.join(__dirname, '../website/src/components/EcosystemSearch/addons.json'),
    JSON.stringify({ ...data }, null, 4)
  );
})();
