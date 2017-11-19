// flow-typed signature: 18dadbe162b608c79b9b31c3d2f1c822
// flow-typed version: b43dff3e0e/body-parser_v1.x.x/flow_>=v0.17.x

import type { Middleware, $Request, $Response } from 'express';

declare type bodyParser$Options = {
  inflate?: boolean;
  limit?: number | string;
  type?: string | string[] | ((req: $Request) => any);
  verify?: (req: $Request, res: $Response, buf: Buffer, encoding: string) => void;
};

declare type bodyParser$OptionsText = bodyParser$Options & {
  reviver?: (key: string, value: any) => any;
  strict?: boolean;
};

declare type bodyParser$OptionsJson = bodyParser$Options & {
  reviver?: (key: string, value: any) => any;
  strict?: boolean;
};

declare type bodyParser$OptionsUrlencoded = bodyParser$Options & {
  extended?: boolean;
  parameterLimit?: number;
};

declare module "body-parser" {

    declare type Options = bodyParser$Options;
    declare type OptionsText = bodyParser$OptionsText;
    declare type OptionsJson = bodyParser$OptionsJson;
    declare type OptionsUrlencoded = bodyParser$OptionsUrlencoded;

    declare function json(options?: OptionsJson): Middleware;

    declare function raw(options?: Options): Middleware;

    declare function text(options?: OptionsText): Middleware;

    declare function urlencoded(options?: OptionsUrlencoded): Middleware;

}
