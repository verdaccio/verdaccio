var formattingTokens = /(\[[^[]*\])|([-:/.()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g;
var match1 = /\d/; // 0 - 9

var match2 = /\d\d/; // 00 - 99

var match3 = /\d{3}/; // 000 - 999

var match4 = /\d{4}/; // 0000 - 9999

var match1to2 = /\d\d?/; // 0 - 99

var matchUpperCaseAMPM = /[AP]M/;
var matchLowerCaseAMPM = /[ap]m/;
var matchSigned = /[+-]?\d+/; // -inf - inf

var matchOffset = /[+-]\d\d:?\d\d/; // +00:00 -00:00 +0000 or -0000

var matchWord = /\d*[^\s\d-:/.()]+/; // Word

var locale;

function offsetFromString(string) {
  var parts = string.match(/([+-]|\d\d)/g);
  var minutes = +(parts[1] * 60) + +parts[2];
  return minutes === 0 ? 0 : parts[0] === '+' ? -minutes : minutes; // eslint-disable-line no-nested-ternary
}

var addInput = function addInput(property) {
  return function (input) {
    this[property] = +input;
  };
};

var zoneExpressions = [matchOffset, function (input) {
  var zone = this.zone || (this.zone = {});
  zone.offset = offsetFromString(input);
}];
var expressions = {
  A: [matchUpperCaseAMPM, function (input) {
    this.afternoon = input === 'PM';
  }],
  a: [matchLowerCaseAMPM, function (input) {
    this.afternoon = input === 'pm';
  }],
  S: [match1, function (input) {
    this.milliseconds = +input * 100;
  }],
  SS: [match2, function (input) {
    this.milliseconds = +input * 10;
  }],
  SSS: [match3, function (input) {
    this.milliseconds = +input;
  }],
  s: [match1to2, addInput('seconds')],
  ss: [match1to2, addInput('seconds')],
  m: [match1to2, addInput('minutes')],
  mm: [match1to2, addInput('minutes')],
  H: [match1to2, addInput('hours')],
  h: [match1to2, addInput('hours')],
  HH: [match1to2, addInput('hours')],
  hh: [match1to2, addInput('hours')],
  D: [match1to2, addInput('day')],
  DD: [match2, addInput('day')],
  Do: [matchWord, function (input) {
    var _locale = locale,
        ordinal = _locale.ordinal;

    var _input$match = input.match(/\d+/);

    this.day = _input$match[0];
    if (!ordinal) return;

    for (var i = 1; i <= 31; i += 1) {
      if (ordinal(i).replace(/\[|\]/g, '') === input) {
        this.day = i;
      }
    }
  }],
  M: [match1to2, addInput('month')],
  MM: [match2, addInput('month')],
  MMM: [matchWord, function (input) {
    var _locale2 = locale,
        months = _locale2.months,
        monthsShort = _locale2.monthsShort;
    var matchIndex = monthsShort ? monthsShort.findIndex(function (month) {
      return month === input;
    }) : months.findIndex(function (month) {
      return month.substr(0, 3) === input;
    });

    if (matchIndex < 0) {
      throw new Error();
    }

    this.month = matchIndex + 1;
  }],
  MMMM: [matchWord, function (input) {
    var _locale3 = locale,
        months = _locale3.months;
    var matchIndex = months.indexOf(input);

    if (matchIndex < 0) {
      throw new Error();
    }

    this.month = matchIndex + 1;
  }],
  Y: [matchSigned, addInput('year')],
  YY: [match2, function (input) {
    input = +input;
    this.year = input + (input > 68 ? 1900 : 2000);
  }],
  YYYY: [match4, addInput('year')],
  Z: zoneExpressions,
  ZZ: zoneExpressions
};

function correctHours(time) {
  var afternoon = time.afternoon;

  if (afternoon !== undefined) {
    var hours = time.hours;

    if (afternoon) {
      if (hours < 12) {
        time.hours += 12;
      }
    } else if (hours === 12) {
      time.hours = 0;
    }

    delete time.afternoon;
  }
}

function makeParser(format) {
  var array = format.match(formattingTokens);
  var length = array.length;

  for (var i = 0; i < length; i += 1) {
    var token = array[i];
    var parseTo = expressions[token];
    var regex = parseTo && parseTo[0];
    var parser = parseTo && parseTo[1];

    if (parser) {
      array[i] = {
        regex: regex,
        parser: parser
      };
    } else {
      array[i] = token.replace(/^\[|\]$/g, '');
    }
  }

  return function (input) {
    var time = {};

    for (var _i = 0, start = 0; _i < length; _i += 1) {
      var _token = array[_i];

      if (typeof _token === 'string') {
        start += _token.length;
      } else {
        var _regex = _token.regex,
            _parser = _token.parser;
        var part = input.substr(start);

        var match = _regex.exec(part);

        var value = match[0];

        _parser.call(time, value);

        input = input.replace(value, '');
      }
    }

    correctHours(time);
    return time;
  };
}

var parseFormattedInput = function parseFormattedInput(input, format, utc) {
  try {
    var parser = makeParser(format);

    var _parser2 = parser(input),
        year = _parser2.year,
        month = _parser2.month,
        day = _parser2.day,
        hours = _parser2.hours,
        minutes = _parser2.minutes,
        seconds = _parser2.seconds,
        milliseconds = _parser2.milliseconds,
        zone = _parser2.zone;

    if (zone) {
      return new Date(Date.UTC(year, month - 1, day, hours || 0, minutes || 0, seconds || 0, milliseconds || 0) + zone.offset * 60 * 1000);
    }

    var now = new Date();
    var d = day || (!year && !month ? now.getDate() : 1);
    var y = year || now.getFullYear();
    var M = month > 0 ? month - 1 : now.getMonth();
    var h = hours || 0;
    var m = minutes || 0;
    var s = seconds || 0;
    var ms = milliseconds || 0;

    if (utc) {
      return new Date(Date.UTC(y, M, d, h, m, s, ms));
    }

    return new Date(y, M, d, h, m, s, ms);
  } catch (e) {
    return new Date(''); // Invalid Date
  }
};

export default (function (o, C, d) {
  var proto = C.prototype;
  var oldParse = proto.parse;

  proto.parse = function (cfg) {
    var date = cfg.date,
        format = cfg.format,
        pl = cfg.pl,
        utc = cfg.utc;
    this.$u = utc;

    if (format) {
      locale = pl ? d.Ls[pl] : this.$locale();
      this.$d = parseFormattedInput(date, format, utc);
      this.init(cfg);
      if (pl) this.$L = pl;
    } else {
      oldParse.call(this, cfg);
    }
  };
});