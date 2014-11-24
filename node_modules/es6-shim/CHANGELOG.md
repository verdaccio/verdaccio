# es6-shim x.x.x (not yet released)

# es6-shim 0.21.0 (21 Nov 2014)
* String#contains → String#includes per 2014-11-19 TC39 meeting
* Use an invalid identifier as the es6-shim iterator key, so it doesn’t show up in the console as easily.

# es6-shim 0.20.4 (20 Nov 2014)
* Performance improvements: avoid slicing arguments, avoid `Function#call` when possible
* Name `String.{fromCodePoint,raw}` for debugging
* Fix `String.raw` to match spec
* Ensure Chrome’s excess Promise methods are purged
* Ensure `Set#keys === Set#values`, per spec

# es6-shim 0.20.3 (19 Nov 2014)
* Fix Set#add and Map#set to always return "this" (#302)
* Clarify TypeError messages thrown by Map/Set
* Fix Chrome 38 bug with Array#values

# es6-shim 0.20.2 (28 Oct 2014)
* Fix AMD (#299)

# es6-shim 0.20.1 (27 Oct 2014)
* Set#delete and Map#delete should return false unless a deletion occurred. (#298)

# es6-shim 0.20.0 (26 Oct 2014)
* Use a more reliable UMD
* export the global object rather than undefined

# es6-shim 0.19.2 (25 Oct 2014)
* Set#delete and Map#delete should return a boolean indicating success. (#298)
* Make style consistent; add jscs

# es6-shim 0.19.1 (14 Oct 2014)
* Fix Map#set and Set#add to be chainable (#295)
* Update mocha

# es6-shim 0.19.0 (9 Oct 2014)
* Detect and override noncompliant Map in Firefox 32 (#294)
* Fix Map and Set for engines that don’t preserve numeric key order (#292, #290)
* Detect and override noncompliant Safari 7.1 Promises (#289)
* Fix Array#keys and Array#entries in Safari 7.1
* General style and whitespace cleanup
* Update dependencies
* Clean up tests for ES3 by removing reserved words

# es6-shim 0.18.0 (6 Sep 2014)
* Speed up String#trim replacement (#284)
* named Array#find and Array#findIndex for easier debugging
* Replace broken native implementation in Firefox 25-31 for Array#find and Array#findIndex
* Ensure String.fromCodePoint has the correct length in Firefox
* List the license in `package.json` for `npm`
* Array.from: fix spec bug with Array.from([], undefined) throwing
* Array.from: fix Firefox Array.from bug wrt swallowing negative lengths vs throwing

# es6-shim 0.17.0 (31 Aug 2014)
* Added es6-sham (#281)
* Fixing some flaky tests (#268)
* Tweaking how ArrayIterator is checked in its "next" function
* Cleaning up some of the logic in Array.from

# es6-shim 0.16.0 (6 Aug 2014)
* Array#find and Array#findIndex: no longer skips holes in sparse arrays, per https://bugs.ecmascript.org/show_bug.cgi?id=3107

# es6-shim 0.15.1 (5 Aug 2014)
* Array.from: now correctly throws if provided `undefined` as a mapper function
* Array.from: now correctly works if provided a falsy `thisArg`
* Fix tests so they work properly when Array#(values|keys|entries) are not present
* Add `npm run lint` to run style checks independently
* Add `test/native.html` so browsers can be easily checked for shim-less compliance.

# es6-shim 0.15.0 (31 Jul 2014)
* Object.assign no longer throws on null or undefined sources, per https://bugs.ecmascript.org/show_bug.cgi?id=3096

# es6-shim 0.14.0 (20 Jul 2014)
* Properly recognize Symbol.iterator when it is present (#277)
* Fix Math.clz’s improper handling of values that coerce to NaN (#269)
* Fix incorrect handling of negative end index on Array#fill (#270)
* Removed Object.getOwnPropertyKeys, which shouldn’t be anywhere (#267)
* Fixed arity of Map and Set constructors, per 2014.04.27 draft spec (rev 24)
* Added a full additional suite of ES6 promise tests (thanks to @smikes!) (#265)
* Make Number.isInteger a bit more efficient (#266)
* Added `npm run test-native` to expose how broken implementations are without the shim ;-)
* Added additional tests

# es6-shim 0.13.0 (11 Jun 2014)
* Adapt to new Array.from changes: mapper function is now called with both value and index (#261, #262)
* More reliably getting the global object in strict mode to fix node-webkit (#258, #259)
* Properly test the global Promise for ignoring non-function callbacks (#258)

# es6-shim 0.12.0 (4 Jun 2014)
* Fix String#trim implementations that incorrectly trim \u0085
* Stop relying on ArrayIterator being a public var, fixing Safari 8

# es6-shim 0.11.1 (2 Jun 2014)
* Make sure to shim Object.assign in all environments, not just true ES5
* Now including minified file and source map

# es6-shim 0.11.0 (11 May 2014)
* Remove `Object.getOwnPropertyDescriptors`, per spec. (#234, #235)
* IE8 fixes. (#163, #236)
* Improve `Promise` scheduling. (#231)
* Add some more standalone shims
* Use an Object.create fallback, for better ES3 compatibility
* Fix Math.expm1 in more browsers (#84)
* Fix es6-shim in Web Workers (#247, #248)
* Correct Object.assign to take multiple sources (#241)

# es6-shim 0.10.1 (13 Mar 2014)
* Update bower.json, component.json, and .npmignore (#229, #230, #233)
* Minor updates to `Promise` implementation and test suite.
* Workaround lack of "strict mode" in IE9. (#232)

# es6-shim 0.10.0 (1 March 2014)
* Implement `Promise`, per spec. (#209, #215, #224, #225)
* Make `Map`/`Set` subclassable; support `iterable` argument to
  constructor (#218)
* Rename `Number#clz` to `Math.clz32` (#217)
* Bug fixes to `Array#find` and `Array#findIndex` on sparse arrays (#213)
* Re-add `Number.isInteger` (mistakenly removed in 0.9.0)
* Allow use of `arguments` as an iterable
* Minor spec-compliance fixes for `String.raw`
* In ES6, `Object.keys` accepts non-Object types (#220)
* Improved browser compatibility with IE 9/10, Opera 12 (#225)

# es6-shim 0.9.3 (5 February 2014)
* Per spec, removed `Object.mixin` (#192)
* Per spec, treat -0 and +0 keys as identical in Map/Set (#129, #204)
* Per spec, `ArrayIterator`/`Array#values()` skips sparse indexes now. (#189)
* Added `Array.from`, supporting Map/Set/Array/String iterators (the String iterator iterates over codepoints, not indexes) (#182)
* Bug fixes to Map/Set iteration after concurrent delete. (#183)
* Bug fixes to `Number.clz`: 0 and 0x100000000 are handled correctly now. (#196)
* Added `Math.fround` to truncate to a 32-bit floating point number. (#140)
* Bug fix for `Math.cosh` (#178)
* Work around Firefox bugs in `String#startsWith` and `String#endsWith` (#172)
* Work around Safari bug in `Math.imul`

# es6-shim 0.9.2 (18 December 2013)
* Negative `String#endsWith` position is now handled properly.
* `TypeError` is now thrown when string methods are called
  on `null` / `undefined`.

# es6-shim 0.9.1 (28 October 2013)
* Added `Array#copyWithin` and `Number.MIN_SAFE_INTEGER`
* Big speed-up of Maps / Sets for string / number keys:
  they are O(1) now.
* Changed `Math.hypot` according to spec.
* Other small fixes.

# es6-shim 0.9.0 (30 August 2013)
* Added Array iteration methods: `Array#keys`, `Array#values`, `Array#entries`, which return an `ArrayIterator`
* Changed `Map` and `Set` constructors to conform to spec when called without `new`
* Added `Math.imul`
* Per spec, removed `Number.toInteger`, `Number.isInteger`, and `Number.MAX_INTEGER`; added `Number.isSafeInteger`, `Number.MAX_SAFE_INTEGER`
* Added extensive additional tests for many methods

# es6-shim 0.8.0 (8 June 2013)
* Added `Object.setPrototypeOf`, `Set#keys`, `Set#values`, `Map#keys`, `Map#values`, `Map#entries`, `Set#entries`.
* Fixed `String#repeat` according to spec.

# es6-shim 0.7.0 (2 April 2013)
* Added `Array#find`, `Array#findIndex`, `Object.assign`, `Object.mixin`,
  `Math.cbrt`, `String.fromCodePoint`, `String#codePointAt`.
* Removed `Object.isnt`.
* Made Math functions fully conform spec.

# es6-shim 0.6.0 (15 January 2013)
* Added `Map#keys`, `Map#values`, `Map#size`, `Set#size`, `Set#clear`.

# es6-shim 0.5.3 (2 September 2012)
* Made `String#startsWith`, `String#endsWith` fully conform spec.

# es6-shim 0.5.2 (17 June 2012)
* Removed `String#toArray` and `Object.isObject` as per spec updates.

# es6-shim 0.5.1 (14 June 2012)
* Made Map and Set follow Spidermonkey implementation instead of V8.
`var m = Map(); m.set('key', void 0); m.has('key');` now gives true.

# es6-shim 0.5.0 (13 June 2012)
* Added Number.MAX_INTEGER, Number.EPSILON, Number.parseInt,
Number.parseFloat, Number.prototype.clz, Object.isObject.

# es6-shim 0.4.1 (11 May 2012)
* Fixed boundary checking in Number.isInteger.

# es6-shim 0.4.0 (8 February 2012)
* Added Math.log10, Math.log2, Math.log1p, Math.expm1, Math.cosh,
Math.sinh, Math.tanh, Math.acosh, Math.asinh, Math.atanh, Math.hypot,
Math.trunc.

# es6-shim 0.3.1 (30 January 2012)
* Added IE8 support.

# es6-shim 0.3.0 (27 January 2012)
* Added Number.isFinite() and Object.isnt().

# es6-shim 0.2.1 (7 January 2012)
* Fixed a bug in String#endsWith().

# es6-shim 0.2.0 (25 December 2011)
* Added browser support.
* Added tests.
* Added Math.sign().

# es6-shim 0.1.0 (25 December 2011)
* Initial release
