
/*
CSV Parse

Please look at the [project documentation](https://csv.js.org/parse/) for
additional information.
*/

const { Transform } = require('stream')
const ResizeableBuffer = require('./ResizeableBuffer')

const tab = 9
const nl = 10
const np = 12
const cr = 13
const space = 32
const bom_utf8 = Buffer.from([239, 187, 191])

class Parser extends Transform {
  constructor(opts = {}){
    super({...{readableObjectMode: true}, ...opts})
    const options = {}
    // Merge with user options
    for(let opt in opts){
      options[underscore(opt)] = opts[opt]
    }
    // Normalize option `bom`
    if(options.bom === undefined || options.bom === null || options.bom === false){
      options.bom = false
    }else if(options.bom !== true){
      throw new CsvError('CSV_INVALID_OPTION_BOM', [
        'Invalid option bom:', 'bom must be true,',
        `got ${JSON.stringify(options.bom)}`
      ])
    }
    // Normalize option `cast`
    let fnCastField = null
    if(options.cast === undefined || options.cast === null || options.cast === false || options.cast === ''){
      options.cast = undefined
    }else if(typeof options.cast === 'function'){
      fnCastField = options.cast
      options.cast = true
    }else if(options.cast !== true){
      throw new CsvError('CSV_INVALID_OPTION_CAST', [
        'Invalid option cast:', 'cast must be true or a function,',
        `got ${JSON.stringify(options.cast)}`
      ])
    }
    // Normalize option `cast_date`
    if(options.cast_date === undefined || options.cast_date === null || options.cast_date === false || options.cast_date === ''){
      options.cast_date = false
    }else if(options.cast_date === true){
      options.cast_date = function(value){
        const date = Date.parse(value)
        return !isNaN(date) ? new Date(date) : value
      }
    }else if(typeof options.cast_date !== 'function'){
      throw new CsvError('CSV_INVALID_OPTION_CAST_DATE', [
        'Invalid option cast_date:', 'cast_date must be true or a function,',
        `got ${JSON.stringify(options.cast_date)}`
      ])
    }
    // Normalize option `columns`
    let fnFirstLineToHeaders = null
    if(options.columns === true){
      // Fields in the first line are converted as-is to columns
      fnFirstLineToHeaders = undefined
    }else if(typeof options.columns === 'function'){
      fnFirstLineToHeaders = options.columns
      options.columns = true
    }else if(Array.isArray(options.columns)){
      options.columns = normalizeColumnsArray(options.columns)
    }else if(options.columns === undefined || options.columns === null || options.columns === false){
      options.columns = false
    }else{
      throw new CsvError('CSV_INVALID_OPTION_COLUMNS', [
        'Invalid option columns:',
        'expect an object, a function or true,',
        `got ${JSON.stringify(options.columns)}`
      ])
    }
    // Normalize option `columns_duplicates_to_array`
    if(options.columns_duplicates_to_array === undefined || options.columns_duplicates_to_array === null || options.columns_duplicates_to_array === false){
      options.columns_duplicates_to_array = false
    }else if(options.columns_duplicates_to_array !== true){
      throw new CsvError('CSV_INVALID_OPTION_COLUMNS_DUPLICATES_TO_ARRAY', [
        'Invalid option columns_duplicates_to_array:',
        'expect an boolean,',
        `got ${JSON.stringify(options.columns_duplicates_to_array)}`
      ])
    }
    // Normalize option `comment`
    if(options.comment === undefined || options.comment === null || options.comment === false || options.comment === ''){
      options.comment = null
    }else{
      if(typeof options.comment === 'string'){
        options.comment = Buffer.from(options.comment)
      }
      if(!Buffer.isBuffer(options.comment)){
        throw new CsvError('CSV_INVALID_OPTION_COMMENT', [
          'Invalid option comment:',
          'comment must be a buffer or a string,',
          `got ${JSON.stringify(options.comment)}`
        ])
      }
    }
    // Normalize option `delimiter`
    const delimiter_json = JSON.stringify(options.delimiter)
    if(!Array.isArray(options.delimiter)) options.delimiter = [options.delimiter]
    if(options.delimiter.length === 0){
      throw new CsvError('CSV_INVALID_OPTION_DELIMITER', [
        'Invalid option delimiter:',
        'delimiter must be a non empty string or buffer or array of string|buffer,',
        `got ${delimiter_json}`
      ])
    }
    options.delimiter = options.delimiter.map(function(delimiter){
      if(delimiter === undefined || delimiter === null || delimiter === false){
        return Buffer.from(',')
      }
      if(typeof delimiter === 'string'){
        delimiter = Buffer.from(delimiter)
      }
      if( !Buffer.isBuffer(delimiter) || delimiter.length === 0){
        throw new CsvError('CSV_INVALID_OPTION_DELIMITER', [
          'Invalid option delimiter:',
          'delimiter must be a non empty string or buffer or array of string|buffer,',
          `got ${delimiter_json}`
        ])
      }
      return delimiter
    })
    // Normalize option `escape`
    if(options.escape === undefined || options.escape === true){
      options.escape = Buffer.from('"')
    }else if(typeof options.escape === 'string'){
      options.escape = Buffer.from(options.escape)
    }else if (options.escape === null || options.escape === false){
      options.escape = null
    }
    if(options.escape !== null){
      if(!Buffer.isBuffer(options.escape)){
        throw new Error(`Invalid Option: escape must be a buffer, a string or a boolean, got ${JSON.stringify(options.escape)}`)
      }else if(options.escape.length !== 1){
        throw new Error(`Invalid Option Length: escape must be one character, got ${options.escape.length}`)
      }else{
        options.escape = options.escape[0]
      }
    }
    // Normalize option `from`
    if(options.from === undefined || options.from === null){
      options.from = 1
    }else{
      if(typeof options.from === 'string' && /\d+/.test(options.from)){
        options.from = parseInt(options.from)
      }
      if(Number.isInteger(options.from)){
        if(options.from < 0){
          throw new Error(`Invalid Option: from must be a positive integer, got ${JSON.stringify(opts.from)}`)
        }
      }else{
        throw new Error(`Invalid Option: from must be an integer, got ${JSON.stringify(options.from)}`)
      }
    }
    // Normalize option `from_line`
    if(options.from_line === undefined || options.from_line === null){
      options.from_line = 1
    }else{
      if(typeof options.from_line === 'string' && /\d+/.test(options.from_line)){
        options.from_line = parseInt(options.from_line)
      }
      if(Number.isInteger(options.from_line)){
        if(options.from_line <= 0){
          throw new Error(`Invalid Option: from_line must be a positive integer greater than 0, got ${JSON.stringify(opts.from_line)}`)
        }
      }else{
        throw new Error(`Invalid Option: from_line must be an integer, got ${JSON.stringify(opts.from_line)}`)
      }
    }
    // Normalize option `info`
    if(options.info === undefined || options.info === null || options.info === false){
      options.info = false
    }else if(options.info !== true){
      throw new Error(`Invalid Option: info must be true, got ${JSON.stringify(options.info)}`)
    }
    // Normalize option `max_record_size`
    if(options.max_record_size === undefined || options.max_record_size === null || options.max_record_size === false){
      options.max_record_size = 0
    }else if(Number.isInteger(options.max_record_size) && options.max_record_size >= 0){
      // Great, nothing to do
    }else if(typeof options.max_record_size === 'string' && /\d+/.test(options.max_record_size)){
      options.max_record_size = parseInt(options.max_record_size)
    }else{
      throw new Error(`Invalid Option: max_record_size must be a positive integer, got ${JSON.stringify(options.max_record_size)}`)
    }
    // Normalize option `objname`
    if(options.objname === undefined || options.objname === null || options.objname === false){
      options.objname = undefined
    }else if(Buffer.isBuffer(options.objname)){
      if(options.objname.length === 0){
        throw new Error(`Invalid Option: objname must be a non empty buffer`)
      }
      options.objname = options.objname.toString()
    }else if(typeof options.objname === 'string'){
      if(options.objname.length === 0){
        throw new Error(`Invalid Option: objname must be a non empty string`)
      }
      // Great, nothing to do
    }else{
      throw new Error(`Invalid Option: objname must be a string or a buffer, got ${options.objname}`)
    }
    // Normalize option `on_record`
    if(options.on_record === undefined || options.on_record === null){
      options.on_record = undefined
    }else if(typeof options.on_record !== 'function'){
      throw new CsvError('CSV_INVALID_OPTION_ON_RECORD', [
        'Invalid option `on_record`:',
        'expect a function,',
        `got ${JSON.stringify(options.on_record)}`
      ])
    }
    // Normalize option `quote`
    if(options.quote === null || options.quote === false || options.quote === ''){
      options.quote = null
    }else{
      if(options.quote === undefined || options.quote === true){
        options.quote = Buffer.from('"')
      }else if(typeof options.quote === 'string'){
        options.quote = Buffer.from(options.quote)
      }
      if(!Buffer.isBuffer(options.quote)){
        throw new Error(`Invalid Option: quote must be a buffer or a string, got ${JSON.stringify(options.quote)}`)
      }else if(options.quote.length !== 1){
        throw new Error(`Invalid Option Length: quote must be one character, got ${options.quote.length}`)
      }else{
        options.quote = options.quote[0]
      }
    }
    // Normalize option `raw`
    if(options.raw === undefined || options.raw === null || options.raw === false){
      options.raw = false
    }else if(options.raw !== true){
      throw new Error(`Invalid Option: raw must be true, got ${JSON.stringify(options.raw)}`)
    }
    // Normalize option `record_delimiter`
    if(!options.record_delimiter){
      options.record_delimiter = []
    }else if(!Array.isArray(options.record_delimiter)){
      options.record_delimiter = [options.record_delimiter]
    }
    options.record_delimiter = options.record_delimiter.map( function(rd){
      if(typeof rd === 'string'){
        rd = Buffer.from(rd)
      }
      return rd
    })
    // Normalize option `relax`
    if(typeof options.relax === 'boolean'){
      // Great, nothing to do
    }else if(options.relax === undefined || options.relax === null){
      options.relax = false
    }else{
      throw new Error(`Invalid Option: relax must be a boolean, got ${JSON.stringify(options.relax)}`)
    }
    // Normalize option `relax_column_count`
    if(typeof options.relax_column_count === 'boolean'){
      // Great, nothing to do
    }else if(options.relax_column_count === undefined || options.relax_column_count === null){
      options.relax_column_count = false
    }else{
      throw new Error(`Invalid Option: relax_column_count must be a boolean, got ${JSON.stringify(options.relax_column_count)}`)
    }
    if(typeof options.relax_column_count_less === 'boolean'){
      // Great, nothing to do
    }else if(options.relax_column_count_less === undefined || options.relax_column_count_less === null){
      options.relax_column_count_less = false
    }else{
      throw new Error(`Invalid Option: relax_column_count_less must be a boolean, got ${JSON.stringify(options.relax_column_count_less)}`)
    }
    if(typeof options.relax_column_count_more === 'boolean'){
      // Great, nothing to do
    }else if(options.relax_column_count_more === undefined || options.relax_column_count_more === null){
      options.relax_column_count_more = false
    }else{
      throw new Error(`Invalid Option: relax_column_count_more must be a boolean, got ${JSON.stringify(options.relax_column_count_more)}`)
    }
    // Normalize option `skip_empty_lines`
    if(typeof options.skip_empty_lines === 'boolean'){
      // Great, nothing to do
    }else if(options.skip_empty_lines === undefined || options.skip_empty_lines === null){
      options.skip_empty_lines = false
    }else{
      throw new Error(`Invalid Option: skip_empty_lines must be a boolean, got ${JSON.stringify(options.skip_empty_lines)}`)
    }
    // Normalize option `skip_lines_with_empty_values`
    if(typeof options.skip_lines_with_empty_values === 'boolean'){
      // Great, nothing to do
    }else if(options.skip_lines_with_empty_values === undefined || options.skip_lines_with_empty_values === null){
      options.skip_lines_with_empty_values = false
    }else{
      throw new Error(`Invalid Option: skip_lines_with_empty_values must be a boolean, got ${JSON.stringify(options.skip_lines_with_empty_values)}`)
    }
    // Normalize option `skip_lines_with_error`
    if(typeof options.skip_lines_with_error === 'boolean'){
      // Great, nothing to do
    }else if(options.skip_lines_with_error === undefined || options.skip_lines_with_error === null){
      options.skip_lines_with_error = false
    }else{
      throw new Error(`Invalid Option: skip_lines_with_error must be a boolean, got ${JSON.stringify(options.skip_lines_with_error)}`)
    }
    // Normalize option `rtrim`
    if(options.rtrim === undefined || options.rtrim === null || options.rtrim === false){
      options.rtrim = false
    }else if(options.rtrim !== true){
      throw new Error(`Invalid Option: rtrim must be a boolean, got ${JSON.stringify(options.rtrim)}`)
    }
    // Normalize option `ltrim`
    if(options.ltrim === undefined || options.ltrim === null || options.ltrim === false){
      options.ltrim = false
    }else if(options.ltrim !== true){
      throw new Error(`Invalid Option: ltrim must be a boolean, got ${JSON.stringify(options.ltrim)}`)
    }
    // Normalize option `trim`
    if(options.trim === undefined || options.trim === null || options.trim === false){
      options.trim = false
    }else if(options.trim !== true){
      throw new Error(`Invalid Option: trim must be a boolean, got ${JSON.stringify(options.trim)}`)
    }
    // Normalize options `trim`, `ltrim` and `rtrim`
    if(options.trim === true && opts.ltrim !== false){
      options.ltrim = true
    }else if(options.ltrim !== true){
      options.ltrim = false
    }
    if(options.trim === true && opts.rtrim !== false){
      options.rtrim = true
    }else if(options.rtrim !== true){
      options.rtrim = false
    }
    // Normalize option `to`
    if(options.to === undefined || options.to === null){
      options.to = -1
    }else{
      if(typeof options.to === 'string' && /\d+/.test(options.to)){
        options.to = parseInt(options.to)
      }
      if(Number.isInteger(options.to)){
        if(options.to <= 0){
          throw new Error(`Invalid Option: to must be a positive integer greater than 0, got ${JSON.stringify(opts.to)}`)
        }
      }else{
        throw new Error(`Invalid Option: to must be an integer, got ${JSON.stringify(opts.to)}`)
      }
    }
    // Normalize option `to_line`
    if(options.to_line === undefined || options.to_line === null){
      options.to_line = -1
    }else{
      if(typeof options.to_line === 'string' && /\d+/.test(options.to_line)){
        options.to_line = parseInt(options.to_line)
      }
      if(Number.isInteger(options.to_line)){
        if(options.to_line <= 0){
          throw new Error(`Invalid Option: to_line must be a positive integer greater than 0, got ${JSON.stringify(opts.to_line)}`)
        }
      }else{
        throw new Error(`Invalid Option: to_line must be an integer, got ${JSON.stringify(opts.to_line)}`)
      }
    }
    this.info = {
      comment_lines: 0,
      empty_lines: 0,
      invalid_field_length: 0,
      lines: 1,
      records: 0
    }
    this.options = options
    this.state = {
      bomSkipped: false,
      castField: fnCastField,
      commenting: false,
      enabled: options.from_line === 1,
      escaping: false,
      escapeIsQuote: options.escape === options.quote,
      expectedRecordLength: options.columns === null ? 0 : options.columns.length,
      field: new ResizeableBuffer(20),
      firstLineToHeaders: fnFirstLineToHeaders,
      info: Object.assign({}, this.info),
      previousBuf: undefined,
      quoting: false,
      stop: false,
      rawBuffer: new ResizeableBuffer(100),
      record: [],
      recordHasError: false,
      record_length: 0,
      recordDelimiterMaxLength: options.record_delimiter.length === 0 ? 2 : Math.max(...options.record_delimiter.map( (v) => v.length)),
      trimChars: [Buffer.from(' ')[0], Buffer.from('\t')[0]],
      wasQuoting: false,
      wasRowDelimiter: false
    }
  }
  // Implementation of `Transform._transform`
  _transform(buf, encoding, callback){
    if(this.state.stop === true){
      return
    }
    const err = this.__parse(buf, false)
    if(err !== undefined){
      this.state.stop = true
    }
    callback(err)
  }
  // Implementation of `Transform._flush`
  _flush(callback){
    if(this.state.stop === true){
      return
    }
    const err = this.__parse(undefined, true)
    callback(err)
  }
  // Central parser implementation
  __parse(nextBuf, end){
    const {bom, comment, escape, from_line, info, ltrim, max_record_size, quote, raw, relax, rtrim, skip_empty_lines, to, to_line} = this.options
    let {record_delimiter} = this.options
    const {bomSkipped, previousBuf, rawBuffer, escapeIsQuote} = this.state
    let buf
    if(previousBuf === undefined){
      if(nextBuf === undefined){
        // Handle empty string
        this.push(null)
        return
      }else{
        buf = nextBuf
      }
    }else if(previousBuf !== undefined && nextBuf === undefined){
      buf = previousBuf
    }else{
      buf = Buffer.concat([previousBuf, nextBuf])
    }
    // Handle UTF BOM
    if(bomSkipped === false){
      if(bom === false){
        this.state.bomSkipped = true
      }else if(buf.length < 3){
        // No enough data
        if(end === false){
          // Wait for more data
          this.state.previousBuf = buf
          return
        }
        // skip BOM detect because data length < 3
      }else{
        if(bom_utf8.compare(buf, 0, 3) === 0){
          // Skip BOM
          buf = buf.slice(3)
        }
        this.state.bomSkipped = true
      }
    }
    const bufLen = buf.length
    let pos
    for(pos = 0; pos < bufLen; pos++){
      // Ensure we get enough space to look ahead
      // There should be a way to move this out of the loop
      if(this.__needMoreData(pos, bufLen, end)){
        break
      }
      if(this.state.wasRowDelimiter === true){
        this.info.lines++
        if(info === true && this.state.record.length === 0 && this.state.field.length === 0 && this.state.wasQuoting === false){
          this.state.info = Object.assign({}, this.info)
        }
        this.state.wasRowDelimiter = false
      }
      if(to_line !== -1 && this.info.lines > to_line){
        this.state.stop = true
        this.push(null)
        return
      }
      // Auto discovery of record_delimiter, unix, mac and windows supported
      if(this.state.quoting === false && record_delimiter.length === 0){
        const record_delimiterCount = this.__autoDiscoverRowDelimiter(buf, pos)
        if(record_delimiterCount){
          record_delimiter = this.options.record_delimiter
        }
      }
      const chr = buf[pos]
      if(raw === true){
        rawBuffer.append(chr)
      }
      if((chr === cr || chr === nl) && this.state.wasRowDelimiter === false ){
        this.state.wasRowDelimiter = true
      }
      // Previous char was a valid escape char
      // treat the current char as a regular char
      if(this.state.escaping === true){
        this.state.escaping = false
      }else{
        // Escape is only active inside quoted fields
        // We are quoting, the char is an escape chr and there is a chr to escape
        if(escape !== null && this.state.quoting === true && chr === escape && pos + 1 < bufLen){
          if(escapeIsQuote){
            if(buf[pos+1] === quote){
              this.state.escaping = true
              continue
            }
          }else{
            this.state.escaping = true
            continue
          }
        }
        // Not currently escaping and chr is a quote
        // TODO: need to compare bytes instead of single char
        if(this.state.commenting === false && chr === quote){
          if(this.state.quoting === true){
            const nextChr = buf[pos+1]
            const isNextChrTrimable = rtrim && this.__isCharTrimable(nextChr)
            // const isNextChrComment = nextChr === comment
            const isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos+1, nextChr)
            const isNextChrDelimiter = this.__isDelimiter(nextChr, buf, pos+1)
            const isNextChrRowDelimiter = record_delimiter.length === 0 ? this.__autoDiscoverRowDelimiter(buf, pos+1) : this.__isRecordDelimiter(nextChr, buf, pos+1)
            // Escape a quote
            // Treat next char as a regular character
            // TODO: need to compare bytes instead of single char
            if(escape !== null && chr === escape && nextChr === quote){
              pos++
            }else if(!nextChr || isNextChrDelimiter || isNextChrRowDelimiter || isNextChrComment || isNextChrTrimable){
              this.state.quoting = false
              this.state.wasQuoting = true
              continue
            }else if(relax === false){
              const err = this.__error(
                new CsvError('CSV_INVALID_CLOSING_QUOTE', [
                  'Invalid Closing Quote:',
                  `got "${String.fromCharCode(nextChr)}"`,
                  `at line ${this.info.lines}`,
                  'instead of delimiter, row delimiter, trimable character',
                  '(if activated) or comment',
                ], this.__context())
              )
              if(err !== undefined) return err
            }else{
              this.state.quoting = false
              this.state.wasQuoting = true
              // continue
              this.state.field.prepend(quote)
            }
          }else{
            if(this.state.field.length !== 0){
              // In relax mode, treat opening quote preceded by chrs as regular
              if( relax === false ){
                const err = this.__error(
                  new CsvError('INVALID_OPENING_QUOTE', [
                    'Invalid Opening Quote:',
                    `a quote is found inside a field at line ${this.info.lines}`,
                  ], this.__context(), {
                    field: this.state.field,
                  })
                )
                if(err !== undefined) return err
              }
            }else{
              this.state.quoting = true
              continue
            }
          }
        }
        if(this.state.quoting === false){
          let recordDelimiterLength = this.__isRecordDelimiter(chr, buf, pos)
          if(recordDelimiterLength !== 0){
            // Do not emit comments which take a full line
            const skipCommentLine = this.state.commenting && (this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0)
            if(skipCommentLine){
              this.info.comment_lines++
              // Skip full comment line
            }else{
              // Skip if line is empty and skip_empty_lines activated
              if(skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0){
                this.info.empty_lines++
                pos += recordDelimiterLength - 1
                continue
              }
              // Activate records emition if above from_line
              if(this.state.enabled === false && this.info.lines + (this.state.wasRowDelimiter === true ? 1: 0 ) >= from_line){
                this.state.enabled = true
                this.__resetField()
                this.__resetRow()
                pos += recordDelimiterLength - 1
                continue
              }else{
                const errField = this.__onField()
                if(errField !== undefined) return errField
                const errRecord = this.__onRow()
                if(errRecord !== undefined) return errRecord
              }
              if(to !== -1 && this.info.records >= to){
                this.state.stop = true
                this.push(null)
                return
              }
            }
            this.state.commenting = false
            pos += recordDelimiterLength - 1
            continue
          }
          if(this.state.commenting){
            continue
          }
          const commentCount = comment === null ? 0 : this.__compareBytes(comment, buf, pos, chr)
          if(commentCount !== 0){
            this.state.commenting = true
            continue
          }
          let delimiterLength = this.__isDelimiter(chr, buf, pos)
          if(delimiterLength !== 0){
            const errField = this.__onField()
            if(errField !== undefined) return errField
            pos += delimiterLength - 1
            continue
          }
        }
      }
      if(this.state.commenting === false){
        if(max_record_size !== 0 && this.state.record_length + this.state.field.length > max_record_size){
          const err = this.__error(
            new CsvError('CSV_MAX_RECORD_SIZE', [
              'Max Record Size:',
              'record exceed the maximum number of tolerated bytes',
              `of ${max_record_size}`,
              `at line ${this.info.lines}`,
            ], this.__context())
          )
          if(err !== undefined) return err
        }
      }

      const lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(chr)
      // rtrim in non quoting is handle in __onField
      const rappend = rtrim === false || this.state.wasQuoting === false
      if( lappend === true && rappend === true ){
        this.state.field.append(chr)
      }else if(rtrim === true && !this.__isCharTrimable(chr)){
        const err = this.__error(
          new CsvError('CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE', [
            'Invalid Closing Quote:',
            'found non trimable byte after quote',
            `at line ${this.info.lines}`,
          ], this.__context())
        )
        if(err !== undefined) return err
      }
    }
    if(end === true){
      // Ensure we are not ending in a quoting state
      if(this.state.quoting === true){
        const err = this.__error(
          new CsvError('CSV_QUOTE_NOT_CLOSED', [
            'Quote Not Closed:',
            `the parsing is finished with an opening quote at line ${this.info.lines}`,
          ], this.__context())
        )
        if(err !== undefined) return err
      }else{
        // Skip last line if it has no characters
        if(this.state.wasQuoting === true || this.state.record.length !== 0 || this.state.field.length !== 0){
          const errField = this.__onField()
          if(errField !== undefined) return errField
          const errRecord = this.__onRow()
          if(errRecord !== undefined) return errRecord
        }else if(this.state.wasRowDelimiter === true){
          this.info.empty_lines++
        }else if(this.state.commenting === true){
          this.info.comment_lines++
        }
      }
    }else{
      this.state.previousBuf = buf.slice(pos)
    }
    if(this.state.wasRowDelimiter === true){
      this.info.lines++
      this.state.wasRowDelimiter = false
    }
  }
  // Helper to test if a character is a space or a line delimiter
  __isCharTrimable(chr){
    return chr === space || chr === tab || chr === cr || chr === nl || chr === np
  }
  __onRow(){
    const {columns, columns_duplicates_to_array, info, from, relax_column_count, relax_column_count_less, relax_column_count_more, raw, skip_lines_with_empty_values} = this.options
    const {enabled, record} = this.state
    if(enabled === false){
      return this.__resetRow()
    }
    // Convert the first line into column names
    const recordLength = record.length
    if(columns === true){
      if(isRecordEmpty(record)){
        this.__resetRow()
        return
      }
      return this.__firstLineToColumns(record)
    }
    if(columns === false && this.info.records === 0){
      this.state.expectedRecordLength = recordLength
    }
    if(recordLength !== this.state.expectedRecordLength){
      if(relax_column_count === true || 
        (relax_column_count_less === true && recordLength < this.state.expectedRecordLength) ||
        (relax_column_count_more === true && recordLength > this.state.expectedRecordLength) ){
        this.info.invalid_field_length++
      }else{
        if(columns === false){
          const err = this.__error(
            new CsvError('CSV_INCONSISTENT_RECORD_LENGTH', [
              'Invalid Record Length:',
              `expect ${this.state.expectedRecordLength},`,
              `got ${recordLength} on line ${this.info.lines}`,
            ], this.__context(), {
              record: record,
            })
          )
          if(err !== undefined) return err
        }else{
          const err = this.__error(
            // CSV_INVALID_RECORD_LENGTH_DONT_MATCH_COLUMNS
            new CsvError('CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH', [
              'Invalid Record Length:',
              `columns length is ${columns.length},`, // rename columns
              `got ${recordLength} on line ${this.info.lines}`,
            ], this.__context(), {
              record: record,
            })
          )
          if(err !== undefined) return err
        }
      }
    }
    if(skip_lines_with_empty_values === true){
      if(isRecordEmpty(record)){
        this.__resetRow()
        return
      }
    }
    if(this.state.recordHasError === true){
      this.__resetRow()
      this.state.recordHasError = false
      return
    }
    this.info.records++
    if(from === 1 || this.info.records >= from){
      if(columns !== false){
        const obj = {}
        // Transform record array to an object
        for(let i = 0, l = record.length; i < l; i++){
          if(columns[i] === undefined || columns[i].disabled) continue
          // obj[columns[i].name] = record[i]
          // Turn duplicate columns into an array
          if (columns_duplicates_to_array === true && obj[columns[i].name]) {
            if (Array.isArray(obj[columns[i].name])) {
              obj[columns[i].name] = obj[columns[i].name].concat(record[i])
            } else {
              obj[columns[i].name] = [obj[columns[i].name], record[i]]
            }
          } else {
            obj[columns[i].name] = record[i]
          }
        }
        const {objname} = this.options
        if(objname === undefined){
          if(raw === true || info === true){
            const err = this.__push(Object.assign(
              {record: obj},
              (raw === true ? {raw: this.state.rawBuffer.toString()}: {}),
              (info === true ? {info: this.state.info}: {})
            ))
            if(err){
              return err
            }
          }else{
            const err = this.__push(obj)
            if(err){
              return err
            }
          }
        }else{
          if(raw === true || info === true){
            const err = this.__push(Object.assign(
              {record: [obj[objname], obj]},
              raw === true ? {raw: this.state.rawBuffer.toString()}: {},
              info === true ? {info: this.state.info}: {}
            ))
            if(err){
              return err
            }
          }else{
            const err = this.__push([obj[objname], obj])
            if(err){
              return err
            }
          }
        }
      }else{
        if(raw === true || info === true){
          const err = this.__push(Object.assign(
            {record: record},
            raw === true ? {raw: this.state.rawBuffer.toString()}: {},
            info === true ? {info: this.state.info}: {}
          ))
          if(err){
            return err
          }
        }else{
          const err = this.__push(record)
          if(err){
            return err
          }
        }
      }
    }
    this.__resetRow()
  }
  __firstLineToColumns(record){
    const {firstLineToHeaders} = this.state
    try{
      const headers = firstLineToHeaders === undefined ? record : firstLineToHeaders.call(null, record)
      if(!Array.isArray(headers)){
        return this.__error(
          new CsvError('CSV_INVALID_COLUMN_MAPPING', [
            'Invalid Column Mapping:',
            'expect an array from column function,',
            `got ${JSON.stringify(headers)}`
          ], this.__context(), {
            headers: headers,
          })
        )
      }
      const normalizedHeaders = normalizeColumnsArray(headers)
      this.state.expectedRecordLength = normalizedHeaders.length
      this.options.columns = normalizedHeaders
      this.__resetRow()
      return
    }catch(err){
      return err
    }
  }
  __resetRow(){
    if(this.options.raw === true){
      this.state.rawBuffer.reset()
    }
    this.state.record = []
    this.state.record_length = 0
  }
  __onField(){
    const {cast, rtrim, max_record_size} = this.options
    const {enabled, wasQuoting} = this.state
    // Short circuit for the from_line options
    if(enabled === false){ /* this.options.columns !== true && */
      return this.__resetField()
    }
    let field = this.state.field.toString()
    if(rtrim === true && wasQuoting === false){
      field = field.trimRight()
    }
    if(cast === true){
      const [err, f] = this.__cast(field)
      if(err !== undefined) return err
      field = f
    }
    this.state.record.push(field)
    // Increment record length if record size must not exceed a limit
    if(max_record_size !== 0 && typeof field === 'string'){
      this.state.record_length += field.length
    }
    this.__resetField()
  }
  __resetField(){
    this.state.field.reset()
    this.state.wasQuoting = false
  }
  __push(record){
    const {on_record} = this.options
    if(on_record !== undefined){
      const context = this.__context()
      try{
        record = on_record.call(null, record, context)
      }catch(err){
        return err
      }
      if(record === undefined || record === null){ return }
    }
    this.push(record)
  }
  // Return a tuple with the error and the casted value
  __cast(field){
    const {columns, relax_column_count} = this.options
    const isColumns = Array.isArray(columns)
    // Dont loose time calling cast
    // because the final record is an object
    // and this field can't be associated to a key present in columns
    if( isColumns === true && relax_column_count && this.options.columns.length <= this.state.record.length ){
      return [undefined, undefined]
    }
    const context = this.__context()
    if(this.state.castField !== null){
      try{
        return [undefined, this.state.castField.call(null, field, context)]
      }catch(err){
        return [err]
      }
    }
    if(this.__isFloat(field)){
      return [undefined, parseFloat(field)]
    }else if(this.options.cast_date !== false){
      return [undefined, this.options.cast_date.call(null, field, context)]
    }
    return [undefined, field]
  }
  // Keep it in case we implement the `cast_int` option
  // __isInt(value){
  //   // return Number.isInteger(parseInt(value))
  //   // return !isNaN( parseInt( obj ) );
  //   return /^(\-|\+)?[1-9][0-9]*$/.test(value)
  // }
  __isFloat(value){
    return (value - parseFloat( value ) + 1) >= 0 // Borrowed from jquery
  }
  __compareBytes(sourceBuf, targetBuf, pos, firtByte){
    if(sourceBuf[0] !== firtByte) return 0
    const sourceLength = sourceBuf.length
    for(let i = 1; i < sourceLength; i++){
      if(sourceBuf[i] !== targetBuf[pos+i]) return 0
    }
    return sourceLength
  }
  __needMoreData(i, bufLen, end){
    if(end){
      return false
    }
    const {comment, delimiter} = this.options
    const {quoting, recordDelimiterMaxLength} = this.state
    const numOfCharLeft = bufLen - i - 1
    const requiredLength = Math.max(
      // Skip if the remaining buffer smaller than comment
      comment ? comment.length : 0,
      // Skip if the remaining buffer smaller than row delimiter
      recordDelimiterMaxLength,
      // Skip if the remaining buffer can be row delimiter following the closing quote
      // 1 is for quote.length
      quoting ? (1 + recordDelimiterMaxLength) : 0,
      // Skip if the remaining buffer can be delimiter
      delimiter.length,
      // Skip if the remaining buffer can be escape sequence
      // 1 is for escape.length
      1
    )
    return numOfCharLeft < requiredLength
  }
  __isDelimiter(chr, buf, pos){
    const {delimiter} = this.options
    loop1: for(let i = 0; i < delimiter.length; i++){
      const del = delimiter[i]
      if(del[0] === chr){
        for(let j = 1; j < del.length; j++){
          if(del[j] !== buf[pos+j]) continue loop1
        }
        return del.length
      }
    }
    return 0
  }
  __isRecordDelimiter(chr, buf, pos){
    const {record_delimiter} = this.options
    const recordDelimiterLength = record_delimiter.length
    loop1: for(let i = 0; i < recordDelimiterLength; i++){
      const rd = record_delimiter[i]
      const rdLength = rd.length
      if(rd[0] !== chr){
        continue
      }
      for(let j = 1; j < rdLength; j++){
        if(rd[j] !== buf[pos+j]){
          continue loop1
        }
      }
      return rd.length
    }
    return 0
  }
  __autoDiscoverRowDelimiter(buf, pos){
    const chr = buf[pos]
    if(chr === cr){
      if(buf[pos+1] === nl){
        this.options.record_delimiter.push(Buffer.from('\r\n'))
        this.state.recordDelimiterMaxLength = 2
        return 2
      }else{
        this.options.record_delimiter.push(Buffer.from('\r'))
        this.state.recordDelimiterMaxLength = 1
        return 1
      }
    }else if(chr === nl){
      this.options.record_delimiter.push(Buffer.from('\n'))
      this.state.recordDelimiterMaxLength = 1
      return 1
    }
    return 0
  }
  __error(msg){
    const {skip_lines_with_error} = this.options
    const err = typeof msg === 'string' ? new Error(msg) : msg
    if(skip_lines_with_error){
      this.state.recordHasError = true
      this.emit('skip', err)
      return undefined
    }else{
      return err
    }
  }
  __context(){
    const {columns} = this.options
    const isColumns = Array.isArray(columns)
    return {
      column: isColumns === true ?
        ( columns.length > this.state.record.length ?
          columns[this.state.record.length].name :
          null
        ) :
        this.state.record.length,
      empty_lines: this.info.empty_lines,
      header: columns === true,
      index: this.state.record.length,
      invalid_field_length: this.info.invalid_field_length,
      quoting: this.state.wasQuoting,
      lines: this.info.lines,
      records: this.info.records
    }
  }
}

const parse = function(){
  let data, options, callback
  for(let i in arguments){
    const argument = arguments[i]
    const type = typeof argument
    if(data === undefined && (typeof argument === 'string' || Buffer.isBuffer(argument))){
      data = argument
    }else if(options === undefined && isObject(argument)){
      options = argument
    }else if(callback === undefined && type === 'function'){
      callback = argument
    }else{
      throw new CsvError('CSV_INVALID_ARGUMENT', [
        'Invalid argument:',
        `got ${JSON.stringify(argument)} at index ${i}`
      ])
    }
  }
  const parser = new Parser(options)
  if(callback){
    const records = options === undefined || options.objname === undefined ? [] : {}
    parser.on('readable', function(){
      let record
      while((record = this.read()) !== null){
        if(options === undefined || options.objname === undefined){
          records.push(record)
        }else{
          records[record[0]] = record[1]
        }
      }
    })
    parser.on('error', function(err){
      callback(err, undefined, parser.info)
    })
    parser.on('end', function(){
      callback(undefined, records, parser.info)
    })
  }
  if(data !== undefined){
    // Give a chance for events to be registered later
    if(typeof setImmediate === 'function'){
      setImmediate(function(){
        parser.write(data)
        parser.end()
      })
    }else{
      parser.write(data)
      parser.end()
    }
  }
  return parser
}

class CsvError extends Error {
  constructor(code, message, ...contexts) {
    if(Array.isArray(message)) message = message.join(' ')
    super(message)
    if(Error.captureStackTrace !== undefined){
      Error.captureStackTrace(this, CsvError)
    }
    this.code = code
    for(const context of contexts){
      for(const key in context){
        const value = context[key]
        this[key] = Buffer.isBuffer(value) ? value.toString() : value == null ? value : JSON.parse(JSON.stringify(value))
      }
    }
  }
}

parse.Parser = Parser

parse.CsvError = CsvError

module.exports = parse

const underscore = function(str){
  return str.replace(/([A-Z])/g, function(_, match){
    return '_' + match.toLowerCase()
  })
}

const isObject = function(obj){
  return (typeof obj === 'object' && obj !== null && !Array.isArray(obj))
}

const isRecordEmpty = function(record){
  return record.every( (field) => field == null || field.toString && field.toString().trim() === '' )
}

const normalizeColumnsArray = function(columns){
  const normalizedColumns = [];
  for(let i = 0, l = columns.length; i < l; i++){
    const column = columns[i]
    if(column === undefined || column === null || column === false){
      normalizedColumns[i] = { disabled: true }
    }else if(typeof column === 'string'){
      normalizedColumns[i] = { name: column }
    }else if(isObject(column)){
      if(typeof column.name !== 'string'){
        throw new CsvError('CSV_OPTION_COLUMNS_MISSING_NAME', [
          'Option columns missing name:',
          `property "name" is required at position ${i}`,
          'when column is an object literal'
        ])
      }
      normalizedColumns[i] = column
    }else{
      throw new CsvError('CSV_INVALID_COLUMN_DEFINITION', [
        'Invalid column definition:',
        'expect a string or a literal object,',
        `got ${JSON.stringify(column)} at position ${i}`
      ])
    }
  }
  return normalizedColumns;
}
