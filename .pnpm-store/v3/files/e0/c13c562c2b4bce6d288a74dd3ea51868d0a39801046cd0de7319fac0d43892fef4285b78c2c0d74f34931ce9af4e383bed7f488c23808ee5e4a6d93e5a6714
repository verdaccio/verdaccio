import { FORMAT_DEFAULT } from '../../constant';
export default (function (o, c, d) {
  var proto = c.prototype;
  var oldFormat = proto.format;
  var englishFormats = {
    LTS: 'h:mm:ss A',
    LT: 'h:mm A',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm A',
    LLLL: 'dddd, MMMM D, YYYY h:mm A'
  };
  d.en.formats = englishFormats;

  var t = function t(format) {
    return format.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function (_, a, b) {
      return a || b.slice(1);
    });
  };

  proto.format = function (formatStr) {
    if (formatStr === void 0) {
      formatStr = FORMAT_DEFAULT;
    }

    var _this$$locale = this.$locale(),
        _this$$locale$formats = _this$$locale.formats,
        formats = _this$$locale$formats === void 0 ? {} : _this$$locale$formats;

    var result = formatStr.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function (_, a, b) {
      var B = b && b.toUpperCase();
      return a || formats[b] || englishFormats[b] || t(formats[B]);
    });
    return oldFormat.call(this, result);
  };
});