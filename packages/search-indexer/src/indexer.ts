import buildDebug from 'debug';
import Fuse, { type IFuseOptions } from 'fuse.js';

import type { Logger, Version } from '@verdaccio/types';

const debug = buildDebug('verdaccio:search:indexer');

interface IndexedItem {
  id: string;
  name: string;
  description: string;
  version: string;
  keywords: string;
  author: string;
}

type Hit = IndexedItem & { score?: number };
type Results = { hits: Hit[] };

const FUSE_OPTIONS: IFuseOptions<IndexedItem> = {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'keywords', weight: 1.2 },
    { name: 'description', weight: 1 },
    { name: 'author', weight: 0.5 },
  ],
  includeScore: true,
  threshold: 0.4,
  ignoreLocation: true,
};

class SearchMemoryIndexer {
  private fuse: Fuse<IndexedItem> | undefined;
  private storage: any;
  private logger: Logger | undefined;

  public configureStorage(storage): void {
    this.storage = storage;
  }

  public async query(term: string): Promise<Results> {
    if (!this.fuse) {
      return { hits: [] };
    }
    debug('searching %s at indexer', term);
    const results = this.fuse.search(term);
    return {
      hits: results.map((r) => ({ ...r.item, score: r.score })),
    };
  }

  private prepareKeywords(keywords?: string[] | string): string {
    if (typeof keywords === 'undefined') {
      return '';
    } else if (typeof keywords === 'string') {
      return keywords;
    }
    return keywords.join(',');
  }

  public async add(pkg: Version): Promise<void> {
    if (!this.fuse) {
      return;
    }
    const name = pkg.name;
    debug('adding item %s to the indexer', name);
    const item: IndexedItem = {
      id: name,
      name,
      description: pkg.description ?? '',
      version: pkg.version,
      keywords: this.prepareKeywords(pkg.keywords),
      author: pkg._npmUser ? pkg._npmUser.name : '',
    };
    this.fuse.remove((doc) => doc.id === name);
    this.fuse.add(item);
  }

  public async remove(name: string): Promise<void> {
    if (!this.fuse) {
      return;
    }
    debug('removing item %s from the indexer', name);
    this.fuse.remove((doc) => doc.id === name);
  }

  public async reindex(): Promise<void> {
    debug('reindexing search indexer');
    this.storage?.getLocalDatabase(async (error, packages): Promise<void> => {
      if (error) {
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
    this.fuse = new Fuse<IndexedItem>([], FUSE_OPTIONS);
    this.reindex();
  }
}

export default new SearchMemoryIndexer();

export { Results };
