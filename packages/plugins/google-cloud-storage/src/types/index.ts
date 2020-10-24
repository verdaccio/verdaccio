import { Datastore } from '@google-cloud/datastore';
import { Config } from '@verdaccio/types';

export interface VerdaccioConfigGoogleStorage extends Config {
  // https://cloud.google.com/nodejs/docs/reference/storage/1.6.x/Bucket
  bucket: string;
  // TODO: add description
  projectId?: string;
  // https://cloud.google.com/datastore/docs/reference/data/rest/v1/Key
  kind?: string;
  // for local development
  keyFilename?: string;
  // disable bucket validation
  validation?: GoogleValidation;
  /** Enable/disable resumable uploads to GC Storage */
  resumable?: boolean;
}

export type GoogleValidation = boolean | string;

export interface GoogleDataStorage {
  secret: string;
  storage: any;
  datastore: Datastore;
}
