export default (function (o, c, dayjs) {
  // locale needed later
  var proto = c.prototype;

  var getShort = function getShort(ins, target, full, num) {
    var locale = ins.$locale();

    if (!locale[target]) {
      return locale[full].map(function (f) {
        return f.substr(0, num);
      });
    }

    return locale[target];
  };

  var localeData = function localeData() {
    var _this = this;

    return {
      months: function months(instance) {
        return instance ? instance.format('MMMM') : getShort(_this, 'months');
      },
      monthsShort: function monthsShort(instance) {
        return instance ? instance.format('MMM') : getShort(_this, 'monthsShort', 'months', 3);
      },
      firstDayOfWeek: function firstDayOfWeek() {
        return _this.$locale().weekStart || 0;
      },
      weekdaysMin: function weekdaysMin(instance) {
        return instance ? instance.format('dd') : getShort(_this, 'weekdaysMin', 'weekdays', 2);
      },
      weekdaysShort: function weekdaysShort(instance) {
        return instance ? instance.format('ddd') : getShort(_this, 'weekdaysShort', 'weekdays', 3);
      },
      longDateFormat: function longDateFormat(format) {
        return _this.$locale().formats[format];
      }
    };
  };

  proto.localeData = function () {
    return localeData.bind(this)();
  };

  dayjs.localeData = function () {
    var localeObject = dayjs.Ls[dayjs.locale()];
    return {
      firstDayOfWeek: function firstDayOfWeek() {
        return localeObject.weekStart || 0;
      }
    };
  };
});