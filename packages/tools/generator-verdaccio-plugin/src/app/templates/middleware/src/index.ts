import { Application, NextFunction, Request, Response, Router } from 'express';

import {
  IBasicAuth,
  IPluginMiddleware,
  IStorageManager,
  Logger,
  PluginOptions,
} from '@verdaccio/types';

import { CustomConfig } from '../types/index';

export default class VerdaccioMiddlewarePlugin implements IPluginMiddleware<CustomConfig> {
  public logger: Logger;
  public foo: string;
  public constructor(config: CustomConfig, options: PluginOptions<CustomConfig>) {
    this.foo = config.foo !== undefined ? config.strict_ssl : true;
    this.logger = options.logger;
  }

  public register_middlewares(
    app: Application,
    auth: IBasicAuth<CustomConfig>,
    /* eslint @typescript-eslint/no-unused-vars: off */
    _storage: IStorageManager<CustomConfig>
  ): void {
    /**
     * This is just an example of implementation
    // eslint new-cap:off
      const router = Router();
      router.post(
        '/custom-endpoint',
        (req: Request, res: Response & { report_error?: Function }, next: NextFunction): void => {
          const encryptedString = auth.aesEncrypt(Buffer.from(this.foo, 'utf8'));
          res.setHeader('X-Verdaccio-Token-Plugin', encryptedString.toString());
          next();
        }
      );
      app.use('/-/npm/something-new', router);
    */
  }
}
