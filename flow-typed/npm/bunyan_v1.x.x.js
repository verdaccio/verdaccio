// flow-typed signature: b3827b7e37fa457f58d7a6656d830369
// flow-typed version: da30fe6876/bunyan_v1.x.x/flow_>=v0.25.x

declare module "bunyan" {
  declare var TRACE: 10;
  declare var DEBUG: 20;
  declare var INFO: 30;
  declare var WARN: 40;
  declare var ERROR: 50;
  declare var FATAL: 60;

  declare type BunyanLogLevels =
    | 60 // fatal
    | 50 // error
    | 40 // warn
    | 30 // info
    | 20 // debug
    | 10; // info
  declare type BunyanRecord = {
    v: number,
    level: BunyanLogLevels,
    name: string,
    hostname: string,
    pid: string,
    time: Date,
    msg: string,
    src: string,
    err?: {
      message: string,
      name: string,
      code: any,
      signal: any,
      stack: string
    },
    [key: string]: any
  };
  declare type Writable = {
    write(rec: BunyanRecord): void
  };
  declare class Logger extends events$EventEmitter {
    constructor(options: LoggerOptions): any;
    addStream(stream: Stream): void;
    addSerializers(serializers: Serializers): void;
    child(opts?: LoggerOptions, simple?: boolean): Logger;
    reopenFileStreams(): void;
    level(): string | number;
    level(value: number | string): void;
    levels(name: number | string, value: number | string): void;
    trace(...params: Array<void>): boolean;
    trace(error: Error, format?: any, ...params: Array<any>): void;
    trace(buffer: Buffer, format?: any, ...params: Array<any>): void;
    trace(obj: Object, format?: any, ...params: Array<any>): void;
    trace(format: string, ...params: Array<any>): void;
    debug(...params: Array<void>): boolean;
    debug(error: Error, format?: any, ...params: Array<any>): void;
    debug(buffer: Buffer, format?: any, ...params: Array<any>): void;
    debug(obj: Object, format?: any, ...params: Array<any>): void;
    debug(format: string, ...params: Array<any>): void;
    info(...params: Array<void>): boolean;
    info(error: Error, format?: any, ...params: Array<any>): void;
    info(buffer: Buffer, format?: any, ...params: Array<any>): void;
    info(obj: Object, format?: any, ...params: Array<any>): void;
    info(format: string, ...params: Array<any>): void;
    warn(...params: Array<void>): boolean;
    warn(error: Error, format?: any, ...params: Array<any>): void;
    warn(buffer: Buffer, format?: any, ...params: Array<any>): void;
    warn(obj: Object, format?: any, ...params: Array<any>): void;
    warn(format: string, ...params: Array<any>): void;
    error(...params: Array<void>): boolean;
    error(error: Error, format?: any, ...params: Array<any>): void;
    error(buffer: Buffer, format?: any, ...params: Array<any>): void;
    error(obj: Object, format?: any, ...params: Array<any>): void;
    error(format: string, ...params: Array<any>): void;
    fatal(...params: Array<void>): boolean;
    fatal(error: Error, format?: any, ...params: Array<any>): void;
    fatal(buffer: Buffer, format?: any, ...params: Array<any>): void;
    fatal(obj: Object, format?: any, ...params: Array<any>): void;
    fatal(format: string, ...params: Array<any>): void;
    static stdSerializers: {
      req: (
        req: http$ClientRequest
      ) => {
        method: string,
        url: string,
        headers: mixed,
        remoteAddress: string,
        remotePort: number
      },
      res: (
        res: http$IncomingMessage
      ) => { statusCode: number, header: string },
      err: (
        err: Error
      ) => {
        message: string,
        name: string,
        stack: string,
        code: string,
        signal: string
      }
    };
  }
  declare interface LoggerOptions {
    streams?: Array<Stream>;
    level?: BunyanLogLevels | string;
    stream?: stream$Writable;
    serializers?: Serializers;
    src?: boolean;
  }
  declare type Serializers = {
    [key: string]: (input: any) => mixed
  };
  declare type Stream = {
    type?: string,
    level?: number | string,
    path?: string,
    stream?: stream$Writable | tty$WriteStream | Stream | Writable,
    closeOnExit?: boolean,
    period?: string,
    count?: number
  };
  declare var stdSerializers: Serializers;
  declare function resolveLevel(value: number | string): number;
  declare function createLogger(
    options: LoggerOptions & { name: string }
  ): Logger;
  declare class RingBuffer extends events$EventEmitter {
    constructor(options: RingBufferOptions): any;
    writable: boolean;
    records: Array<any>;
    write(record: BunyanRecord): void;
    end(record?: any): void;
    destroy(): void;
    destroySoon(): void;
  }
  declare interface RingBufferOptions {
    limit: number;
  }
  declare function safeCycles(): (key: string, value: any) => any;
  declare class ConsoleRawStream {
    write(rec: BunyanRecord): void;
  }
  declare var levelFromName: {
    trace: typeof TRACE,
    debug: typeof DEBUG,
    info: typeof INFO,
    warn: typeof WARN,
    error: typeof ERROR,
    fatal: typeof FATAL
  };
  declare var nameFromLevel: {
    [key: BunyanLogLevels]: string
  };
  declare var VERSION: string;
  declare var LOG_VERSION: string;
}
