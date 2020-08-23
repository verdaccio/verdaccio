/// <reference types="node" />

import * as stream from "stream";
export = transform

// transform([records], [options], handler, [callback])

declare function transform(handler: transform.Handler, callback?: transform.Callback): transform.Transformer
declare function transform(records: Array<any>, handler: transform.Handler, callback?: transform.Callback): transform.Transformer
declare function transform(options: transform.Options, handler: transform.Handler, callback?: transform.Callback): transform.Transformer
declare function transform(records: Array<any>, options: transform.Options, handler: transform.Handler, callback?: transform.Callback): transform.Transformer
declare namespace transform {
    type Handler = (record: Array<any>, callback: HandlerCallback, params?: any) => any
    type HandlerCallback = (err?: null | Error, record?: any) => void
    type Callback = (err?: null | Error, output?: string) => void
    interface Options {
        /**
         * In the absence of a consumer, like a `stream.Readable`, trigger the consumption of the stream.
         */
        consume?: boolean
        /**
         * The number of transformation callbacks to run in parallel; only apply with asynchronous handlers; default to "100".
         */
        parallel?: number
        /**
         * Pass user defined parameters to the user handler as last argument.
         */
        params?: any
    }
    interface State {
      finished: number
      running: number
      started: number
    }
    class Transformer extends stream.Transform {
        constructor(options: Options)
        readonly options: Options
        readonly state: State
    }
}
