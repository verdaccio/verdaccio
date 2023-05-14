import type { Orama, Results } from '@orama/orama';
import buildDebug from 'debug';

import { Version } from '@verdaccio/types';

import Storage from './storage';

const debug = buildDebug('verdaccio:search:indexer');
const { create, insert, remove, search } = require('@orama/orama');

class SearchMemoryIndexer {
  private database: Orama | undefined;
  private storage: Storage | undefined;

  /**
   * Set up the {Storage}
   * @param {*} storage An storage reference.
   */
  public configureStorage(storage): void {
    this.storage = storage;
  }

  /**
   * Performs a query to the indexer.
   * If the keyword is a * it returns all local elements
   * otherwise performs a search
   * @param {*} q the keyword
   * @return {Array} list of results.
   */
  public async query(term: string): Promise<Results | void> {
    if (this.database) {
      debug('searching %s at indexer', term);
      const searchResult = await search(this.database, {
        term,
        properties: '*',
      });

      return searchResult;
    }
  }

  /**
   * Add a new element to index
   * @param {*} pkg the package
   */
  public async add(pkg: Version): Promise<void> {
    if (this.database) {
      const name = pkg.name;
      debug('adding item %s to the indexer', name);
      insert(this.database, {
        id: name,
        name: name,
        description: pkg.description,
        version: `v${pkg.version}`,
        keywords: pkg.keywords,
        author: pkg._npmUser ? pkg._npmUser.name : '???',
      });
    }
  }

  /**
   * Remove an element from the index.
   * @param {*} name the id element
   */
  public async remove(name: string): Promise<void> {
    if (this.database) {
      debug('removing item %s to the indexer', name);
      await remove(this.database, name);
    }
  }

  /**
   * Force a re-index.
   */
  public reindex(): void {
    debug('reindexing search indexer');
    this.storage?.getLocalDatabase((error, packages): void => {
      if (error) {
        // that function shouldn't produce any
        throw error;
      }
      let i = packages.length;
      if (i === 0) {
        debug('no packages to index');
      }

      while (i--) {
        const pkg = packages[i];
        debug('indexing package %s', pkg?.name);
        this.add(pkg);
      }
      debug('reindexed search indexer');
    });
  }

  public async init() {
    this.database = await create({
      schema: {
        id: 'string',
        name: 'string',
        description: 'string',
        keywords: 'string',
        version: 'string',
        readme: 'string',
      },
    });

    this.reindex();
  }
}

export default new SearchMemoryIndexer();

export { Results };
