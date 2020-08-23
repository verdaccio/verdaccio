// Original definitions in https://github.com/DefinitelyTyped/DefinitelyTyped by: David Muller <https://github.com/davidm77>

/// <reference types="node" />

import * as stream from "stream";

export = parse;

declare function parse(input: Buffer | string, options?: parse.Options, callback?: parse.Callback): parse.Parser;
declare function parse(input: Buffer | string, callback?: parse.Callback): parse.Parser;
declare function parse(options?: parse.Options, callback?: parse.Callback): parse.Parser;
declare function parse(callback?: parse.Callback): parse.Parser;
declare namespace parse {

    type Callback = (err: Error | undefined, records: any | undefined, info: Info) => void;

    interface Parser extends stream.Transform {}

    class Parser {
        constructor(options: Options);
        
        __push(line: any): any;
        
        __write(chars: any, end: any, callback: any): any;
        
        readonly options: Options
        
        readonly info: Info;
    }

    interface CastingContext {
        readonly column: number | string;
        readonly empty_lines: number;
        readonly header: boolean;
        readonly index: number;
        readonly quoting: boolean;
        readonly lines: number;
        readonly records: number;
        readonly invalid_field_length: number;
    }

    type CastingFunction = (value: string, context: CastingContext) => any;

    type CastingDateFunction = (value: string, context: CastingContext) => Date;

    type ColumnOption = string | undefined | null | false | { name: string };

    interface Options {
        /**
         * If true, the parser will attempt to convert read data types to native types.
         * @deprecated Use {@link cast}
         */
        auto_parse?: boolean | CastingFunction;
        autoParse?: boolean | CastingFunction;
        /**
         * If true, the parser will attempt to convert read data types to dates. It requires the "auto_parse" option.
         * @deprecated Use {@link cast_date}
         */
        auto_parse_date?: boolean | CastingDateFunction;
        autoParseDate?: boolean | CastingDateFunction;
        /**
         * If true, detect and exclude the byte order mark (BOM) from the CSV input if present.
         */
        bom?: boolean;
        /**
         * If true, the parser will attempt to convert input string to native types.
         * If a function, receive the value as first argument, a context as second argument and return a new value. More information about the context properties is available below.
         */
        cast?: boolean | CastingFunction;
        /**
         * If true, the parser will attempt to convert input string to dates.
         * If a function, receive the value as argument and return a new value. It requires the "auto_parse" option. Be careful, it relies on Date.parse.
         */
        cast_date?: boolean | CastingDateFunction;
        castDate?: boolean | CastingDateFunction;
        /**
         * List of fields as an array,
         * a user defined callback accepting the first line and returning the column names or true if autodiscovered in the first CSV line,
         * default to null,
         * affect the result data set in the sense that records will be objects instead of arrays.
         */
        columns?: ColumnOption[] | boolean | ((record: any) => ColumnOption[]);
        /**
         * Convert values into an array of values when columns are activated and
         * when multiple columns of the same name are found.
         */
        columns_duplicates_to_array?: boolean;
        columnsDuplicatesToArray?: boolean;
        /**
         * Treat all the characters after this one as a comment, default to '' (disabled).
         */
        comment?: string;
        /**
         * Set the field delimiter. One character only, defaults to comma.
         */
        delimiter?: string | string[] | Buffer;
        /**
         * Set the escape character, one character only, defaults to double quotes.
         */
        escape?: string | Buffer;
        /**
         * Start handling records from the requested number of records.
         */
        from?: number;
        /**
         * Start handling records from the requested line number.
         */
        from_line?: number;
        fromLine?: number;
        /**
         * Generate two properties `info` and `record` where `info` is a snapshot of the info object at the time the record was created and `record` is the parsed array or object.
         */
        info?: boolean;
        /**
         * If true, ignore whitespace immediately following the delimiter (i.e. left-trim all fields), defaults to false.
         * Does not remove whitespace in a quoted field.
         */
        ltrim?: boolean;
        /**
         * Maximum numer of characters to be contained in the field and line buffers before an exception is raised,
         * used to guard against a wrong delimiter or record_delimiter,
         * default to 128000 characters.
         */
        max_record_size?: number;
        maxRecordSize?: number;
        /**
         * Name of header-record title to name objects by.
         */
        objname?: string;
        /**
         * Alter and filter records by executing a user defined function.
         */
        on_record?: (record: any, context: CastingContext) => any;
        onRecord?: (record: any, context: CastingContext) => any;
        /**
         * Optional character surrounding a field, one character only, defaults to double quotes.
         */
        quote?: string | boolean | Buffer | null;
        /**
         * Generate two properties raw and row where raw is the original CSV row content and row is the parsed array or object.
         */
        raw?: boolean;
        /**
         * Preserve quotes inside unquoted field.
         */
        relax?: boolean;
        /**
         * Discard inconsistent columns count, default to false.
         */
        relax_column_count?: boolean;
        relaxColumnCount?: boolean;
        /**
         * Discard inconsistent columns count when the record contains less fields than expected, default to false.
         */
        relax_column_count_less?: boolean;
        relaxColumnCountLess?: boolean;
        /**
         * Discard inconsistent columns count when the record contains more fields than expected, default to false.
         */
        relax_column_count_more?: boolean;
        relaxColumnCountMore?: boolean;
        /**
         * One or multiple characters used to delimit record rows; defaults to auto discovery if not provided.
         * Supported auto discovery method are Linux ("\n"), Apple ("\r") and Windows ("\r\n") row delimiters.
         */
        record_delimiter?: string | string[] | Buffer | Buffer[];
        recordDelimiter?: string | string[] | Buffer | Buffer[];
        /**
         * If true, ignore whitespace immediately preceding the delimiter (i.e. right-trim all fields), defaults to false.
         * Does not remove whitespace in a quoted field.
         */
        rtrim?: boolean;
        /**
         * Dont generate empty values for empty lines.
         * Defaults to false
         */
        skip_empty_lines?: boolean;
        skipEmptyLines?: boolean;
        /**
         * Skip a line with error found inside and directly go process the next line.
         */
        skip_lines_with_error?: boolean;
        skipLinesWithError?: boolean;
        /**
         * Don't generate records for lines containing empty column values (column matching /\s*\/), defaults to false.
         */
        skip_lines_with_empty_values?: boolean;
        skipLinesWithEmptyValues?: boolean;
        /**
         * Stop handling records after the requested number of records.
         */
        to?: number;
        /**
         * Stop handling records after the requested line number.
         */
        to_line?: number;
        toLine?: number;
        /**
         * If true, ignore whitespace immediately around the delimiter, defaults to false.
         * Does not remove whitespace in a quoted field.
         */
        trim?: boolean;
    }

    interface Info {
        /**
         * Count the number of lines being fully commented.
         */
        readonly comment_lines: number;
        /**
         * Count the number of processed empty lines.
         */
        readonly empty_lines: number;
        /**
         * The number of lines encountered in the source dataset, start at 1 for the first line.
         */
        readonly lines: number;
        /**
         * Count the number of processed records.
         */
        readonly records: number;
        /**
         * Number of non uniform records when `relax_column_count` is true.
         */
        readonly invalid_field_length: number;
    }
    
    class CsvError extends Error {
        readonly code: CsvErrorCode;
        [key: string]: any;
    
        constructor(code: CsvErrorCode, message: string | string[], ...contexts: any[]);
    }
    
    type CsvErrorCode = 
        'CSV_INVALID_OPTION_BOM'
        | 'CSV_INVALID_OPTION_CAST'
        | 'CSV_INVALID_OPTION_CAST_DATE'
        | 'CSV_INVALID_OPTION_COLUMNS'
        | 'CSV_INVALID_OPTION_COLUMNS_DUPLICATES_TO_ARRAY'
        | 'CSV_INVALID_OPTION_COMMENT'
        | 'CSV_INVALID_OPTION_DELIMITER'
        | 'CSV_INVALID_OPTION_ON_RECORD'
        | 'CSV_INVALID_CLOSING_QUOTE'
        | 'INVALID_OPENING_QUOTE'
        | 'CSV_INVALID_COLUMN_MAPPING'
        | 'CSV_INVALID_ARGUMENT'
        | 'CSV_INVALID_COLUMN_DEFINITION'
        | 'CSV_MAX_RECORD_SIZE'
        | 'CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE'
        | 'CSV_QUOTE_NOT_CLOSED'
        | 'CSV_INCONSISTENT_RECORD_LENGTH'
        | 'CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH'
        | 'CSV_OPTION_COLUMNS_MISSING_NAME'
}
