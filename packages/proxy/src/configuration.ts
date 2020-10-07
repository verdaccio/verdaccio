import _ from 'lodash';

import { Config } from '@verdaccio/types';

export const DEFAULT_CONFIG: ProxyConfiguration = {
  maxage: '2m',
  timeout: '30s',
  max_fails: 2,
  fail_timeout: '5m',
  strict_ssl: true,
  agent_options: {},
};

export type ProxyConfiguration = {
  maxage: string;
  timeout: string;
  max_fails: number;
  fail_timeout: string;
  strict_ssl: boolean;
  agent_options: any;
};

export function parseConfiguration(config: Partial<Config>): ProxyConfiguration {
  const configKeys = Object.keys(DEFAULT_CONFIG);
  if (_.isEmpty(config)) {
    return DEFAULT_CONFIG;
  }

  return configKeys.reduce((pre, current) => {
    if (_.isNil(config[current]) === false) {
      pre[current] = config[current];
    }

    return pre;
  }, DEFAULT_CONFIG);
}
