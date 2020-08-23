import _bindInstanceProperty from "../../core-js/instance/bind";
import _Reflect$construct from "../../core-js/reflect/construct";
import setPrototypeOf from "./setPrototypeOf";
import isNativeReflectConstruct from "./isNativeReflectConstruct";
export default function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = _Reflect$construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);

      var Constructor = _bindInstanceProperty(Function).apply(Parent, a);

      var instance = new Constructor();
      if (Class) setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}