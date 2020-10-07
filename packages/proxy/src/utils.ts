export const encode = function (thing): string {
  return encodeURIComponent(thing).replace(/^%40/, '@');
};
