import _getIterator from "../../core-js/get-iterator";
import _isIterable from "../../core-js/is-iterable";
import _Symbol from "../../core-js/symbol";
export default function _iterableToArrayLimitLoose(arr, i) {
  if (typeof _Symbol === "undefined" || !_isIterable(Object(arr))) return;
  var _arr = [];

  for (var _iterator = _getIterator(arr), _step; !(_step = _iterator.next()).done;) {
    _arr.push(_step.value);

    if (i && _arr.length === i) break;
  }

  return _arr;
}