import { create, insert, remove, search } from '@orama/orama';
import buildDebug from 'debug';

import { Logger, Version } from '@verdaccio/types';

const debug = buildDebug('verdaccio:search:indexer');

type Results = any;

class SearchMemoryIndexer {
  private database: any | undefined;
  private storage: any;
  private logger: Logger | undefined;

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
      });

      return searchResult;
    }
  }

  private prepareKeywords(keywords?: string[] | string): string {
    if (typeof keywords === 'undefined') {
      return '';
    } else if (typeof keywords === 'string') {
      return keywords;
    }
    return keywords.join(',');
  }

  /**
   * Add a new element to index
   * @param {*} pkg the package
   */
  public async add(pkg: Version): Promise<void> {
    if (this.database) {
      const name = pkg.name;
      debug('adding item %s to the indexer', name);
      const item = {
        id: name,
        name: name,
        description: pkg.description,
        version: pkg.version,
        keywords: this.prepareKeywords(pkg.keywords),
        author: pkg._npmUser ? pkg._npmUser.name : '',
      };
      await insert(this.database, item);
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
  public async reindex(): Promise<void> {
    debug('reindexing search indexer');
    this.storage?.getLocalDatabase(async (error, packages): Promise<void> => {
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
        try {
          await this.add(pkg);
        } catch (err: any) {
          this.logger?.error({ err: err.message }, 'error @{err} indexing package');
        }
      }
      debug('reindexed search indexer');
    });
  }

  public async init(logger: Logger) {
    this.logger = logger;
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
