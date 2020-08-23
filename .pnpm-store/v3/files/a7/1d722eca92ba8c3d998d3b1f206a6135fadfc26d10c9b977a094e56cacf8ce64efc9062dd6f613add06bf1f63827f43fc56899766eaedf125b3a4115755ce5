# Suggest using `toBeUndefined()` (prefer-to-be-undefined)

In order to have a better failure message, `toBeUndefined()` should be used upon
asserting expections on undefined value.

## Rule details

This rule triggers a warning if `toBe()`, `toEqual()` or `toStrictEqual()` is
used to assert an undefined value.

```js
expect(undefined).toBe(undefined);
```

This rule is enabled by default.

### Default configuration

The following patterns are considered warnings:

```js
expect(undefined).toBe(undefined);

expect(undefined).toEqual(undefined);

expect(undefined).toStrictEqual(undefined);
```

The following pattern is not warning:

```js
expect(undefined).toBeUndefined();
```
