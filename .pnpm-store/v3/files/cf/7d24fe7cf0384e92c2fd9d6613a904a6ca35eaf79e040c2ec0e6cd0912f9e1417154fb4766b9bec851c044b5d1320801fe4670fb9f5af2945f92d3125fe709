
/// <reference types="node" />

import * as stream from "stream";

export = generate;

declare function generate(options?: generate.Options, callback?: generate.Callback): generate.Generator;
declare function generate(callback?: generate.Callback): generate.Generator;
declare namespace generate {

    type Callback = (err?: Error, records?: any) => void;

    type MatcherFunc = (value: any) => boolean;

    class Generator extends stream.Readable {
        constructor(options?: Options);
        
        readonly options: Options;
    }

    interface Options {

        /**
         * Define the number of generated fields and the generation method.
         */
        columns?: number | string[];

        /**
         * Set the field delimiter.
         */
        delimiter?: string;

        /**
         * Period to run in milliseconds.
         */
        duration?: number;

        /**
         * If specified, then buffers will be decoded to strings using the specified encoding.
         */
        encoding?: string;
        
        /**
         * When to stop the generation.
         */
        end?: number | Date;

        /**
         * One or multiple characters to print at the end of the file; only apply when objectMode is disabled.
         */
        eof?: boolean | string;

        /**
         * Generate buffers equals length as defined by the `highWaterMark` option.
         */
        fixed_size?: boolean;
        fixedSize?: boolean;
        
        /**
         * The maximum number of bytes to store in the internal buffer before ceasing to read from the underlying resource.
         */
        high_water_mark?: number;
        highWaterMark?: number;

        /**
         * Number of lines or records to generate.
         */
        length?: number;

        /**
         * Maximum number of characters per word. 
         */
        max_word_length?: number;
        maxWordLength?: number;
        
        /**
         * Whether this stream should behave as a stream of objects.
         */
        object_mode?: boolean
        objectMode?: boolean;

        /**
         * One or multiple characters used to delimit records.
         */
        row_delimiter?: string;

        /**
         * Generate idempotent random characters if a number provided.
         */
        seed?: boolean | number;
        
        /**
         * The time to wait between the generation of each records
         */
        sleep?: number;
    }
}
