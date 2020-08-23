"use strict";

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
CSV Stringify

Please look at the [project documentation](https://csv.js.org/stringify/) for
additional information.
*/
var _require = require('stream'),
    Transform = _require.Transform;

var bom_utf8 = Buffer.from([239, 187, 191]);

var Stringifier =
/*#__PURE__*/
function (_Transform) {
  _inherits(Stringifier, _Transform);

  function Stringifier() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Stringifier);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Stringifier).call(this, _objectSpread({}, {
      writableObjectMode: true
    }, {}, opts)));
    var options = {};
    var err; // Merge with user options

    for (var opt in opts) {
      options[underscore(opt)] = opts[opt];
    }

    if (err = _this.normalize(options)) throw err;

    switch (options.record_delimiter) {
      case 'auto':
        options.record_delimiter = null;
        break;

      case 'unix':
        options.record_delimiter = "\n";
        break;

      case 'mac':
        options.record_delimiter = "\r";
        break;

      case 'windows':
        options.record_delimiter = "\r\n";
        break;

      case 'ascii':
        options.record_delimiter = "\x1E";
        break;

      case 'unicode':
        options.record_delimiter = "\u2028";
        break;
    } // Expose options


    _this.options = options; // Internal state

    _this.state = {
      stop: false
    }; // Information

    _this.info = {
      records: 0
    };

    _assertThisInitialized(_this);

    return _this;
  }

  _createClass(Stringifier, [{
    key: "normalize",
    value: function normalize(options) {
      // Normalize option `bom`
      if (options.bom === undefined || options.bom === null || options.bom === false) {
        options.bom = false;
      } else if (options.bom !== true) {
        return new CsvError('CSV_OPTION_BOOLEAN_INVALID_TYPE', ['option `bom` is optional and must be a boolean value,', "got ".concat(JSON.stringify(options.bom))]);
      } // Normalize option `delimiter`


      if (options.delimiter === undefined || options.delimiter === null) {
        options.delimiter = ',';
      } else if (Buffer.isBuffer(options.delimiter)) {
        options.delimiter = options.delimiter.toString();
      } else if (typeof options.delimiter !== 'string') {
        return new CsvError('CSV_OPTION_DELIMITER_INVALID_TYPE', ['option `delimiter` must be a buffer or a string,', "got ".concat(JSON.stringify(options.delimiter))]);
      } // Normalize option `quote`


      if (options.quote === undefined || options.quote === null) {
        options.quote = '"';
      } else if (options.quote === true) {
        options.quote = '"';
      } else if (options.quote === false) {
        options.quote = '';
      } else if (Buffer.isBuffer(options.quote)) {
        options.quote = options.quote.toString();
      } else if (typeof options.quote !== 'string') {
        return new CsvError('CSV_OPTION_QUOTE_INVALID_TYPE', ['option `quote` must be a boolean, a buffer or a string,', "got ".concat(JSON.stringify(options.quote))]);
      } // Normalize option `quoted`


      if (options.quoted === undefined || options.quoted === null) {
        options.quoted = false;
      } else {} // todo
      // Normalize option `quoted_empty`


      if (options.quoted_empty === undefined || options.quoted_empty === null) {
        options.quoted_empty = undefined;
      } else {} // todo
      // Normalize option `quoted_match`


      if (options.quoted_match === undefined || options.quoted_match === null || options.quoted_match === false) {
        options.quoted_match = null;
      } else if (!Array.isArray(options.quoted_match)) {
        options.quoted_match = [options.quoted_match];
      }

      if (options.quoted_match) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = options.quoted_match[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var quoted_match = _step.value;
            var isString = typeof quoted_match === 'string';
            var isRegExp = quoted_match instanceof RegExp;

            if (!isString && !isRegExp) {
              return Error("Invalid Option: quoted_match must be a string or a regex, got ".concat(JSON.stringify(quoted_match)));
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } // Normalize option `quoted_string`


      if (options.quoted_string === undefined || options.quoted_string === null) {
        options.quoted_string = false;
      } else {} // todo
      // Normalize option `eof`


      if (options.eof === undefined || options.eof === null) {
        options.eof = true;
      } else {} // todo
      // Normalize option `escape`


      if (options.escape === undefined || options.escape === null) {
        options.escape = '"';
      } else if (Buffer.isBuffer(options.escape)) {
        options.escape = options.escape.toString();
      } else if (typeof options.escape !== 'string') {
        return Error("Invalid Option: escape must be a buffer or a string, got ".concat(JSON.stringify(options.escape)));
      }

      if (options.escape.length > 1) {
        return Error("Invalid Option: escape must be one character, got ".concat(options.escape.length, " characters"));
      } // Normalize option `header`


      if (options.header === undefined || options.header === null) {
        options.header = false;
      } else {} // todo
      // Normalize option `columns`


      options.columns = this.normalize_columns(options.columns); // Normalize option `quoted`

      if (options.quoted === undefined || options.quoted === null) {
        options.quoted = false;
      } else {} // todo
      // Normalize option `cast`


      if (options.cast === undefined || options.cast === null) {
        options.cast = {};
      } else {} // todo
      // Normalize option cast.bigint


      if (options.cast.bigint === undefined || options.cast.bigint === null) {
        // Cast boolean to string by default
        options.cast.bigint = function (value) {
          return '' + value;
        };
      } // Normalize option cast.boolean


      if (options.cast["boolean"] === undefined || options.cast["boolean"] === null) {
        // Cast boolean to string by default
        options.cast["boolean"] = function (value) {
          return value ? '1' : '';
        };
      } // Normalize option cast.date


      if (options.cast.date === undefined || options.cast.date === null) {
        // Cast date to timestamp string by default
        options.cast.date = function (value) {
          return '' + value.getTime();
        };
      } // Normalize option cast.number


      if (options.cast.number === undefined || options.cast.number === null) {
        // Cast number to string using native casting by default
        options.cast.number = function (value) {
          return '' + value;
        };
      } // Normalize option cast.object


      if (options.cast.object === undefined || options.cast.object === null) {
        // Stringify object as JSON by default
        options.cast.object = function (value) {
          return JSON.stringify(value);
        };
      } // Normalize option cast.string


      if (options.cast.string === undefined || options.cast.string === null) {
        // Leave string untouched
        options.cast.string = function (value) {
          return value;
        };
      } // Normalize option `record_delimiter`


      if (options.record_delimiter === undefined || options.record_delimiter === null) {
        options.record_delimiter = '\n';
      } else if (Buffer.isBuffer(options.record_delimiter)) {
        options.record_delimiter = options.record_delimiter.toString();
      } else if (typeof options.record_delimiter !== 'string') {
        return Error("Invalid Option: record_delimiter must be a buffer or a string, got ".concat(JSON.stringify(options.record_delimiter)));
      }
    }
  }, {
    key: "_transform",
    value: function _transform(chunk, encoding, callback) {
      if (this.state.stop === true) {
        return;
      } // Chunk validation


      if (!Array.isArray(chunk) && _typeof(chunk) !== 'object') {
        this.state.stop = true;
        return callback(Error("Invalid Record: expect an array or an object, got ".concat(JSON.stringify(chunk))));
      } // Detect columns from the first record


      if (this.info.records === 0) {
        if (Array.isArray(chunk)) {
          if (this.options.header === true && !this.options.columns) {
            this.state.stop = true;
            return callback(Error('Undiscoverable Columns: header option requires column option or object records'));
          }
        } else if (this.options.columns === undefined || this.options.columns === null) {
          this.options.columns = this.normalize_columns(Object.keys(chunk));
        }
      } // Emit the header


      if (this.info.records === 0) {
        this.bom();
        this.headers();
      } // Emit and stringify the record if an object or an array


      try {
        this.emit('record', chunk, this.info.records);
      } catch (err) {
        this.state.stop = true;
        return this.emit('error', err);
      } // Convert the record into a string


      if (this.options.eof) {
        chunk = this.stringify(chunk);

        if (chunk === undefined) {
          return;
        } else {
          chunk = chunk + this.options.record_delimiter;
        }
      } else {
        chunk = this.stringify(chunk);

        if (chunk === undefined) {
          return;
        } else {
          if (this.options.header || this.info.records) {
            chunk = this.options.record_delimiter + chunk;
          }
        }
      } // Emit the csv


      this.info.records++;
      this.push(chunk);
      callback();
      null;
    }
  }, {
    key: "_flush",
    value: function _flush(callback) {
      if (this.info.records === 0) {
        this.bom();
        this.headers();
      }

      callback();
      null;
    }
  }, {
    key: "stringify",
    value: function stringify(chunk) {
      var _this2 = this;

      var chunkIsHeader = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (_typeof(chunk) !== 'object') {
        return chunk;
      }

      var _this$options = this.options,
          columns = _this$options.columns,
          header = _this$options.header;
      var record = []; // Record is an array

      if (Array.isArray(chunk)) {
        // We are getting an array but the user has specified output columns. In
        // this case, we respect the columns indexes
        if (columns) {
          chunk.splice(columns.length);
        } // Cast record elements


        for (var _i = 0; _i < chunk.length; _i++) {
          var field = chunk[_i];

          var _this$__cast = this.__cast(field, {
            index: _i,
            column: _i,
            records: this.info.records,
            header: chunkIsHeader
          }),
              _this$__cast2 = _slicedToArray(_this$__cast, 2),
              err = _this$__cast2[0],
              value = _this$__cast2[1];

          if (err) {
            this.emit('error', err);
            return;
          }

          record[_i] = [value, field];
        } // Record is a literal object

      } else {
        if (columns) {
          for (var _i2 = 0; _i2 < columns.length; _i2++) {
            var _field = get(chunk, columns[_i2].key);

            var _this$__cast3 = this.__cast(_field, {
              index: _i2,
              column: columns[_i2].key,
              records: this.info.records,
              header: chunkIsHeader
            }),
                _this$__cast4 = _slicedToArray(_this$__cast3, 2),
                _err = _this$__cast4[0],
                _value = _this$__cast4[1];

            if (_err) {
              this.emit('error', _err);
              return;
            }

            record[_i2] = [_value, _field];
          }
        } else {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = chunk[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var column = _step2.value;
              var _field2 = chunk[column];

              var _this$__cast5 = this.__cast(_field2, {
                index: i,
                column: columns[i].key,
                records: this.info.records,
                header: chunkIsHeader
              }),
                  _this$__cast6 = _slicedToArray(_this$__cast5, 2),
                  _err2 = _this$__cast6[0],
                  _value2 = _this$__cast6[1];

              if (_err2) {
                this.emit('error', _err2);
                return;
              }

              record.push([_value2, _field2]);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      }

      var csvrecord = '';

      var _loop = function _loop(_i3) {
        var options = void 0,
            err = void 0;

        var _record$_i = _slicedToArray(record[_i3], 2),
            value = _record$_i[0],
            field = _record$_i[1];

        if (typeof value === "string") {
          options = _this2.options;
        } else if (isObject(value)) {
          // let { value, ...options } = value
          options = value;
          value = options.value;
          delete options.value;

          if (typeof value !== "string" && value !== undefined && value !== null) {
            _this2.emit("error", Error("Invalid Casting Value: returned value must return a string, null or undefined, got ".concat(JSON.stringify(value))));

            return {
              v: void 0
            };
          }

          options = _objectSpread({}, _this2.options, {}, options);

          if (err = _this2.normalize(options)) {
            _this2.emit("error", err);

            return {
              v: void 0
            };
          }
        } else if (value === undefined || value === null) {
          options = _this2.options;
        } else {
          _this2.emit("error", Error("Invalid Casting Value: returned value must return a string, an object, null or undefined, got ".concat(JSON.stringify(value))));

          return {
            v: void 0
          };
        }

        var _options = options,
            delimiter = _options.delimiter,
            escape = _options.escape,
            quote = _options.quote,
            quoted = _options.quoted,
            quoted_empty = _options.quoted_empty,
            quoted_string = _options.quoted_string,
            quoted_match = _options.quoted_match,
            record_delimiter = _options.record_delimiter;

        if (value) {
          if (typeof value !== 'string') {
            _this2.emit("error", Error("Formatter must return a string, null or undefined, got ".concat(JSON.stringify(value))));

            return {
              v: null
            };
          }

          var containsdelimiter = delimiter.length && value.indexOf(delimiter) >= 0;
          var containsQuote = quote !== '' && value.indexOf(quote) >= 0;
          var containsEscape = value.indexOf(escape) >= 0 && escape !== quote;
          var containsRecordDelimiter = value.indexOf(record_delimiter) >= 0;
          var quotedString = quoted_string && typeof field === 'string';
          var quotedMatch = quoted_match && quoted_match.filter(function (quoted_match) {
            if (typeof quoted_match === 'string') {
              return value.indexOf(quoted_match) !== -1;
            } else {
              return quoted_match.test(value);
            }
          });
          quotedMatch = quotedMatch && quotedMatch.length > 0;
          var shouldQuote = containsQuote === true || containsdelimiter || containsRecordDelimiter || quoted || quotedString || quotedMatch;

          if (shouldQuote === true && containsEscape === true) {
            var regexp = escape === '\\' ? new RegExp(escape + escape, 'g') : new RegExp(escape, 'g');
            value = value.replace(regexp, escape + escape);
          }

          if (containsQuote === true) {
            var _regexp = new RegExp(quote, 'g');

            value = value.replace(_regexp, escape + quote);
          }

          if (shouldQuote === true) {
            value = quote + value + quote;
          }

          csvrecord += value;
        } else if (quoted_empty === true || field === '' && quoted_string === true && quoted_empty !== false) {
          csvrecord += quote + quote;
        }

        if (_i3 !== record.length - 1) {
          csvrecord += delimiter;
        }
      };

      for (var _i3 = 0; _i3 < record.length; _i3++) {
        var _ret = _loop(_i3);

        if (_typeof(_ret) === "object") return _ret.v;
      }

      return csvrecord;
    }
  }, {
    key: "bom",
    value: function bom() {
      if (this.options.bom !== true) {
        return;
      }

      this.push(bom_utf8);
    }
  }, {
    key: "headers",
    value: function headers() {
      if (this.options.header === false) {
        return;
      }

      if (this.options.columns === undefined) {
        return;
      }

      var headers = this.options.columns.map(function (column) {
        return column.header;
      });

      if (this.options.eof) {
        headers = this.stringify(headers, true) + this.options.record_delimiter;
      } else {
        headers = this.stringify(headers);
      }

      this.push(headers);
    }
  }, {
    key: "__cast",
    value: function __cast(value, context) {
      var type = _typeof(value);

      try {
        if (type === 'string') {
          // Fine for 99% of the cases
          return [undefined, this.options.cast.string(value, context)];
        } else if (type === 'bigint') {
          return [undefined, this.options.cast.bigint(value, context)];
        } else if (type === 'number') {
          return [undefined, this.options.cast.number(value, context)];
        } else if (type === 'boolean') {
          return [undefined, this.options.cast["boolean"](value, context)];
        } else if (value instanceof Date) {
          return [undefined, this.options.cast.date(value, context)];
        } else if (type === 'object' && value !== null) {
          return [undefined, this.options.cast.object(value, context)];
        } else {
          return [undefined, value, value];
        }
      } catch (err) {
        return [err];
      }
    }
  }, {
    key: "normalize_columns",
    value: function normalize_columns(columns) {
      if (columns === undefined || columns === null) {
        return undefined;
      }

      if (_typeof(columns) !== 'object') {
        throw Error('Invalid option "columns": expect an array or an object');
      }

      if (!Array.isArray(columns)) {
        var newcolumns = [];

        for (var k in columns) {
          newcolumns.push({
            key: k,
            header: columns[k]
          });
        }

        columns = newcolumns;
      } else {
        var _newcolumns = [];
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = columns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var column = _step3.value;

            if (typeof column === 'string') {
              _newcolumns.push({
                key: column,
                header: column
              });
            } else if (_typeof(column) === 'object' && column !== undefined && !Array.isArray(column)) {
              if (!column.key) {
                throw Error('Invalid column definition: property "key" is required');
              }

              if (column.header === undefined) {
                column.header = column.key;
              }

              _newcolumns.push(column);
            } else {
              throw Error('Invalid column definition: expect a string or an object');
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        columns = _newcolumns;
      }

      return columns;
    }
  }]);

  return Stringifier;
}(Transform);

var stringify = function stringify() {
  var data, options, callback;

  for (var _i4 in arguments) {
    var argument = arguments[_i4];

    var type = _typeof(argument);

    if (data === undefined && Array.isArray(argument)) {
      data = argument;
    } else if (options === undefined && isObject(argument)) {
      options = argument;
    } else if (callback === undefined && type === 'function') {
      callback = argument;
    } else {
      throw new CsvError('CSV_INVALID_ARGUMENT', ['Invalid argument:', "got ".concat(JSON.stringify(argument), " at index ").concat(_i4)]);
    }
  }

  var stringifier = new Stringifier(options);

  if (callback) {
    var chunks = [];
    stringifier.on('readable', function () {
      var chunk;

      while ((chunk = this.read()) !== null) {
        chunks.push(chunk);
      }
    });
    stringifier.on('error', function (err) {
      callback(err);
    });
    stringifier.on('end', function () {
      callback(undefined, chunks.join(''));
    });
  }

  if (data !== undefined) {
    // Give a chance for events to be registered later
    if (typeof setImmediate === 'function') {
      setImmediate(function () {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var record = _step4.value;
            stringifier.write(record);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        stringifier.end();
      });
    } else {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var record = _step5.value;
          stringifier.write(record);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      stringifier.end();
    }
  }

  return stringifier;
};

var CsvError =
/*#__PURE__*/
function (_Error) {
  _inherits(CsvError, _Error);

  function CsvError(code, message) {
    var _this3;

    _classCallCheck(this, CsvError);

    if (Array.isArray(message)) message = message.join(' ');
    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(CsvError).call(this, message));

    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(_assertThisInitialized(_this3), CsvError);
    }

    _this3.code = code;

    for (var _len = arguments.length, contexts = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      contexts[_key - 2] = arguments[_key];
    }

    for (var _i5 = 0, _contexts = contexts; _i5 < _contexts.length; _i5++) {
      var context = _contexts[_i5];

      for (var key in context) {
        var value = context[key];
        _this3[key] = Buffer.isBuffer(value) ? value.toString() : value == null ? value : JSON.parse(JSON.stringify(value));
      }
    }

    return _this3;
  }

  return CsvError;
}(_wrapNativeSuper(Error));

stringify.Stringifier = Stringifier;
stringify.CsvError = CsvError;
module.exports = stringify;

var isObject = function isObject(obj) {
  return _typeof(obj) === 'object' && obj !== null && !Array.isArray(obj);
};

var underscore = function underscore(str) {
  return str.replace(/([A-Z])/g, function (_, match) {
    return '_' + match.toLowerCase();
  });
}; // Lodash implementation of `get`


var charCodeOfDot = '.'.charCodeAt(0);
var reEscapeChar = /\\(\\)?/g;
var rePropName = RegExp( // Match anything that isn't a dot or bracket.
'[^.[\\]]+' + '|' + // Or match property names within brackets.
'\\[(?:' + // Match a non-string expression.
'([^"\'][^[]*)' + '|' + // Or match strings (supports escaping characters).
'(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' + ')\\]' + '|' + // Or match "" as the space between consecutive dots or empty brackets.
'(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))', 'g');
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;

var getTag = function getTag(value) {
  if (!value) value === undefined ? '[object Undefined]' : '[object Null]';
  return Object.prototype.toString.call(value);
};

var isKey = function isKey(value, object) {
  if (Array.isArray(value)) {
    return false;
  }

  var type = _typeof(value);

  if (type === 'number' || type === 'symbol' || type === 'boolean' || !value || isSymbol(value)) {
    return true;
  }

  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
};

var isSymbol = function isSymbol(value) {
  var type = _typeof(value);

  return type === 'symbol' || type === 'object' && value && getTag(value) === '[object Symbol]';
};

var stringToPath = function stringToPath(string) {
  var result = [];

  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push('');
  }

  string.replace(rePropName, function (match, expression, quote, subString) {
    var key = match;

    if (quote) {
      key = subString.replace(reEscapeChar, '$1');
    } else if (expression) {
      key = expression.trim();
    }

    result.push(key);
  });
  return result;
};

var castPath = function castPath(value, object) {
  if (Array.isArray(value)) {
    return value;
  } else {
    return isKey(value, object) ? [value] : stringToPath(value);
  }
};

var toKey = function toKey(value) {
  if (typeof value === 'string' || isSymbol(value)) return value;
  var result = "".concat(value);
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
};

var get = function get(object, path) {
  path = castPath(path, object);
  var index = 0;
  var length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }

  return index && index === length ? object : undefined;
};