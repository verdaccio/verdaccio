# Prevents conditionals where the type is always truthy or always falsy (`no-unnecessary-condition`)

Any expression being used as a condition must be able to evaluate as truthy or falsy in order to be considered "necessary". Conversely, any expression that always evaluates to truthy or always evaluates to falsy, as determined by the type of the expression, is considered unnecessary and will be flagged by this rule.

The following expressions are checked:

- Arguments to the `&&`, `||` and `?:` (ternary) operators
- Conditions for `if`, `for`, `while`, and `do-while` statements
- Base values of optional chain expressions

Examples of **incorrect** code for this rule:

```ts
function head<T>(items: T[]) {
  // items can never be nullable, so this is unnecessary
  if (items) {
    return items[0].toUpperCase();
  }
}

function foo(arg: 'bar' | 'baz') {
  // arg is never nullable or empty string, so this is unnecessary
  if (arg) {
  }
}

function bar<T>(arg: string) {
  // arg can never be nullish, so ?. is unnecessary
  return arg?.length;
}

// Checks array predicate return types, where possible
[
  [1, 2],
  [3, 4],
].filter(t => t); // number[] is always truthy
```

Examples of **correct** code for this rule:

```ts
function head<T>(items: T[]) {
  // Necessary, since items.length might be 0
  if (items.length) {
    return items[0].toUpperCase();
  }
}

function foo(arg: string) {
  // Necessary, since foo might be ''.
  if (arg) {
  }
}

function bar(arg?: string | null) {
  // Necessary, since arg might be nullish
  return arg?.length;
}

[0, 1, 2, 3].filter(t => t); // number can be truthy or falsy
```

## Options

Accepts an object with the following options:

- `allowConstantLoopConditions` (default `false`) - allows constant expressions in loops.

Example of correct code for when `allowConstantLoopConditions` is `true`:

```ts
while (true) {}
for (; true; ) {}
do {} while (true);
```

## When Not To Use It

The main downside to using this rule is the need for type information.

## Related To

- ESLint: [no-constant-condition](https://eslint.org/docs/rules/no-constant-condition) - `no-unnecessary-condition` is essentially a stronger version of `no-constant-condition`, but requires type information.

- [strict-boolean-expressions](./strict-boolean-expressions.md) - a more opinionated version of `no-unnecessary-condition`. `strict-boolean-expressions` enforces a specific code style, while `no-unnecessary-condition` is about correctness.
