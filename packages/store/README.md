# Verdaccio Search API

The **Search** class in Verdaccio provides a convenient API for searching packages across both configured proxies and local storage. It enables efficient package discovery and retrieval by aggregating search results from multiple upstream sources.

## Installation

```bash
npm install @verdaccio/search
```

## Usage

```ts
import { Config } from '@verdaccio/config';
import { logger } from '@verdaccio/logger';
import { Search } from '@verdaccio/search';

const config = new Config(configYaml);
// Instantiate Search class
const search = new Search(config, logger);

// Define search parameters
const searchParams = {
  // specify search parameters as needed
};

// Perform a search and retrieve the results
const searchResults = await search.search(searchParams);
```

## Donations

Verdaccio is run by **volunteers**; nobody is working full-time on it. If you find this project to be useful and would like to support its development, consider making a donation - **your logo might end up in this readme.** 😉

**[Donate](https://opencollective.com/verdaccio)** 💵👍🏻 starting from _\$1/month_ or just one single contribution.

### License

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)

The Verdaccio documentation and logos (excluding /thanks, e.g., .md, .png, .sketch) files within the /assets folder) is
[Creative Commons licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE-docs).
