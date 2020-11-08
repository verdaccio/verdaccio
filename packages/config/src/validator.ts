import { ConfigYaml } from '@verdaccio/types';
import { object, number, string } from 'yup';

let schema = object().shape({
  storage: string(),
  plugins: string(),
  web: object().shape({
    title: string(),
  }),
  url_prefix: string().notRequired(),
  max_body_size: string().notRequired(),
  http_proxy: string().notRequired(),
  https_proxy: string().notRequired(),
  no_proxy: string().notRequired(),
  auth: object().required(),
  notify: object().notRequired(),
  uplinks: object().required(),
  packages: object().required(),
  // should be array but we need a way for easy migration
  // logs: object().required(),
  i18n: object({
    web: string().notRequired(),
  }).notRequired(),
  server: object({
    keepAliveTimeout: number(),
  }).notRequired(),
  middlewares: object().notRequired(),
  flags: object().notRequired(),
  config_path: string().required(),
});

export async function validateConfig(config: ConfigYaml): Promise<any> {
  return await schema.validate(config, { strict: true });
}
