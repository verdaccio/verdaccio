define(['exports'], function (exports) {
  'use strict';

  exports.__esModule = true;
  var dangerousPropertyRegex = /^(constructor|__defineGetter__|__defineSetter__|__lookupGetter__|__proto__)$/;

  exports.dangerousPropertyRegex = dangerousPropertyRegex;

  exports['default'] = function (instance) {
    instance.registerHelper('lookup', function (obj, field) {
      if (!obj) {
        return obj;
      }
      if (dangerousPropertyRegex.test(String(field)) && !Object.prototype.propertyIsEnumerable.call(obj, field)) {
        return undefined;
      }
      return obj[field];
    });
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvbG9va3VwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBTyxNQUFNLHNCQUFzQixHQUFHLDhFQUE4RSxDQUFDOzs7O3VCQUV0RyxVQUFTLFFBQVEsRUFBRTtBQUNoQyxZQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxVQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDckQsVUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLGVBQU8sR0FBRyxDQUFDO09BQ1o7QUFDRCxVQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtBQUN6RyxlQUFPLFNBQVMsQ0FBQztPQUNsQjtBQUNELGFBQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ25CLENBQUMsQ0FBQztHQUNKIiwiZmlsZSI6Imxvb2t1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBkYW5nZXJvdXNQcm9wZXJ0eVJlZ2V4ID0gL14oY29uc3RydWN0b3J8X19kZWZpbmVHZXR0ZXJfX3xfX2RlZmluZVNldHRlcl9ffF9fbG9va3VwR2V0dGVyX198X19wcm90b19fKSQvO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9va3VwJywgZnVuY3Rpb24ob2JqLCBmaWVsZCkge1xuICAgIGlmICghb2JqKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAoZGFuZ2Vyb3VzUHJvcGVydHlSZWdleC50ZXN0KFN0cmluZyhmaWVsZCkpICYmICFPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqLCBmaWVsZCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBvYmpbZmllbGRdO1xuICB9KTtcbn1cbiJdfQ==
