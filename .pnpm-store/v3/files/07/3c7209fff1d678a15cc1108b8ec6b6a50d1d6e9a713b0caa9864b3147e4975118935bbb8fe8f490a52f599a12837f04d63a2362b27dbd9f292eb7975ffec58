import { Logger, IPluginMiddleware, IBasicAuth, PluginOptions } from '@verdaccio/types';
import { ConfigAudit } from './types';
export default class ProxyAudit implements IPluginMiddleware<ConfigAudit> {
    enabled: boolean;
    logger: Logger;
    strict_ssl: boolean;
    constructor(config: ConfigAudit, options: PluginOptions<ConfigAudit>);
    register_middlewares(app: any, auth: IBasicAuth<ConfigAudit>): void;
}
