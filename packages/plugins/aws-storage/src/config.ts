import { Config } from '@verdaccio/types';

export type S3Configuration = {
  bucket: string;
  keyPrefix: string;
  endpoint?: string;
  region?: string;
  // @deprecated
  s3ForcePathStyle?: boolean;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  // use .verdaccio-db.json instead dynamodb
  useDBFile?: boolean;
  tableName?: string;
} & Config;
