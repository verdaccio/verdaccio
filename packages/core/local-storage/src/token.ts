import Path from 'path';
import _ from 'lodash';
import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import FileMemory from 'lowdb/adapters/Memory';
import buildDebug from 'debug';

import { ITokenActions, Config, Token, TokenFilter } from '@verdaccio/types';

const debug = buildDebug('verdaccio:plugin:local-storage:token');

const TOKEN_DB_NAME = '.token-db.json';

export default class TokenActions implements ITokenActions {
  public config: Config;
  public tokenDb: low.LowdbAsync<any> | null;

  public constructor(config: Config) {
    this.config = config;
    this.tokenDb = null;
  }

  public _dbGenPath(dbName: string, config: Config): string {
    return Path.join(
      Path.resolve(Path.dirname(config.config_path || ''), config.storage as string, dbName)
    );
  }

  private async getTokenDb(): Promise<low.LowdbAsync<any>> {
    if (!this.tokenDb) {
      debug('token database is not defined');
      let adapter;
      if (process.env.NODE_ENV === 'test') {
        debug('token memory adapter');
        adapter = new FileMemory('');
      } else {
        debug('token async adapter');
        const pathDb = this._dbGenPath(TOKEN_DB_NAME, this.config);
        adapter = new FileAsync(pathDb);
      }
      debug('token bd generated');
      this.tokenDb = await low(adapter);
    }

    return this.tokenDb;
  }

  public async saveToken(token: Token): Promise<void> {
    debug('token key %o', token.key);
    const db = await this.getTokenDb();
    const userData = await db.get(token.user).value();
    debug('user data %o', userData);
    if (_.isNil(userData)) {
      await db.set(token.user, [token]).write();
      debug('token user %o new database', token.user);
    } else {
      // types does not match with valid implementation
      // @ts-ignore
      await db.get(token.user).push(token).write();
    }
    debug('data %o', await db.getState());
    debug('token saved %o', token.user);
  }

  public async deleteToken(user: string, tokenKey: string): Promise<void> {
    const db = await this.getTokenDb();
    const userTokens = await db.get(user).value();
    if (_.isNil(userTokens)) {
      throw new Error('user not found');
    }
    debug('tokens %o - %o', userTokens, userTokens.length);
    const remainingTokens = userTokens.filter(({ key }) => {
      debug('key %o', key);
      return key !== tokenKey;
    });
    await db.set(user, remainingTokens).write();
    debug('removed tokens key %o', tokenKey);
  }

  public async readTokens(filter: TokenFilter): Promise<Token[]> {
    const { user } = filter;
    debug('read tokens with %o', user);
    const db = await this.getTokenDb();
    const tokens = await db.get(user).value();
    return tokens || [];
  }
}
