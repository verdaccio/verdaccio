import { MS, Y, D, W } from '../../constant';
export default (function (o, c, d) {
  var proto = c.prototype;

  proto.week = function (week) {
    if (week === void 0) {
      week = null;
    }

    if (week !== null) {
      return this.add((week - this.week()) * 7, 'day');
    }

    var weekStart = this.$locale().weekStart || 0;
    var startOfYear = d(this).startOf(Y);
    var compareDay = startOfYear.subtract(startOfYear.day() - weekStart, D).subtract(1, MS);
    var diffInWeek = this.diff(compareDay, W, true);
    var result = Math.ceil(diffInWeek);
    return result > 52 ? 1 : result;
  };

  proto.weeks = function (week) {
    if (week === void 0) {
      week = null;
    }

    return this.week(week);
  };
});