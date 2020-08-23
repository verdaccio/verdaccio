import _Reflect$construct from "../../core-js/reflect/construct";
import getPrototypeOf from "./getPrototypeOf";
import isNativeReflectConstruct from "./isNativeReflectConstruct";
import possibleConstructorReturn from "./possibleConstructorReturn";
export default function _createSuper(Derived) {
  var hasNativeReflectConstruct = isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = getPrototypeOf(this).constructor;
      result = _Reflect$construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return possibleConstructorReturn(this, result);
  };
}