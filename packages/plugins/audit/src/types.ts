// Temporary solution for requiring types will not cause the error.
import { Config } from '@verdaccio/types';

export interface ConfigAudit extends Config {
  enabled: boolean;
  strict_ssl?: boolean | void;
}
