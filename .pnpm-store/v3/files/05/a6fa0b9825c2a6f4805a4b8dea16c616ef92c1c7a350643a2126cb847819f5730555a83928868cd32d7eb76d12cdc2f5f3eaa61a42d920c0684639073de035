import _bindInstanceProperty from "../../core-js/instance/bind";
import _getIterator from "../../core-js/get-iterator";
import _Array$isArray from "../../core-js/array/is-array";
import _getIteratorMethod from "../../core-js/get-iterator-method";
import _Symbol from "../../core-js/symbol";
import unsupportedIterableToArray from "./unsupportedIterableToArray";
export default function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var _context;

  var it;

  if (typeof _Symbol === "undefined" || _getIteratorMethod(o) == null) {
    if (_Array$isArray(o) || (it = unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = _getIterator(o);
  return _bindInstanceProperty(_context = it.next).call(_context, it);
}