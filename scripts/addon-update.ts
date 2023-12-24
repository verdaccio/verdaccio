import fs from 'fs/promises';
import got from 'got';
import path from 'path';

(async () => {
  const data = require('../website/src/components/EcosystemSearch/addons.json');
  for (let item of data.addons) {
    try {
      const d = await got(`https://registry.npmjs.org/${item.name}`).json();
      const apiDownloads = await got(
        `https://api.npmjs.org/downloads/point/last-month/${item.name}`
      ).json();
      // @ts-ignore
      item.description = d.description;
      // remove html tags from description (e.g. <h1...>)
      // CodeQL js/incomplete-multi-character-sanitization
      let previous;
      do {
        previous = item.description;
        item.description = item.description.replace(/<[^>]*>?/gm, '');
      } while (item.description !== previous);
      // remove markdown links from description (e.g. [link](url))
      item.description = item.description.trim().replace(/\[(.*?)\]\(.*?\)/gm, '$1');
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
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('error for %s', item.name, err);
    }
  }
  await fs.writeFile(
    path.join(__dirname, '../website/src/components/EcosystemSearch/addons.json'),
    JSON.stringify({ ...data }, null, 4)
  );
})();
