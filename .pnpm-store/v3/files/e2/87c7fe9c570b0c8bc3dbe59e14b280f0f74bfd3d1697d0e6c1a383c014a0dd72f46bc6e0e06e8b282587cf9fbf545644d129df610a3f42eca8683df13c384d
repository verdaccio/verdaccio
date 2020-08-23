/// <reference types="node" />
import { PassThrough, TransformOptions } from 'stream';
export interface IReadTarball {
    abort?: () => void;
}
export interface IUploadTarball {
    done?: () => void;
    abort?: () => void;
}
/**
 * This stream is used to read tarballs from repository.
 * @param {*} options
 * @return {Stream}
 */
declare class ReadTarball extends PassThrough implements IReadTarball {
    /**
     *
     * @param {Object} options
     */
    constructor(options: TransformOptions);
    abort(): void;
}
/**
 * This stream is used to upload tarballs to a repository.
 * @param {*} options
 * @return {Stream}
 */
declare class UploadTarball extends PassThrough implements IUploadTarball {
    /**
     *
     * @param {Object} options
     */
    constructor(options: any);
    abort(): void;
    done(): void;
}
export { ReadTarball, UploadTarball };
