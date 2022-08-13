// @deprecated add proper type fot the callback
export type Callback = Function;
// FIXME: err should be something flexible enough for any implementation
export type CallbackAction = (err: any | null) => void;
// eslint-disable-next-line no-undef
export type CallbackError = (err: NodeJS.ErrnoException) => void;

export interface RemoteUser {
  real_groups: string[];
  groups: string[];
  name: string | void;
  error?: string;
}

export type StringValue = string | void | null;

// FIXME: error should be export type `VerdaccioError = HttpError & { code: number };`
// instead of AuthError
// but this type is on @verdaccio/core and cannot be used here yet (I don't know why)
export interface HttpError extends Error {
  status: number;
  statusCode: number;
  expose: boolean;
  headers?: {
    [key: string]: string;
  };
  [key: string]: any;
}

export type URLPrefix = {
  // if is false, it would be relative by default
  absolute: boolean;
  // base path
  // eg: absolute: true, https://somedomain.com/xxx/
  // eg: absolute: false, /xxx/ (default) if url_prefix is an string instead an object
  basePath: string;
};
