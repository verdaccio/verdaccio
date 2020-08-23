# Restricts the types allowed in boolean expressions (`strict-boolean-expressions`)

Forbids usage of non-boolean types in expressions where a boolean is expected.
`boolean` and `never` types are always allowed.
Additional types which are considered safe in a boolean context can be configured via options.

The following nodes are considered boolean expressions and their type is checked:

- Argument to the logical negation operator (`!arg`).
- The condition in a conditional expression (`cond ? x : y`).
- Conditions for `if`, `for`, `while`, and `do-while` statements.
- Operands of logical binary operators (`lhs || rhs` and `lhs && rhs`).
  - Right-hand side operand is ignored when it's not a descendant of another boolean expression.
    This is to allow usage of boolean operators for their short-circuiting behavior.

## Examples

Examples of **incorrect** code for this rule:

```ts
// nullable numbers are considered unsafe by default
let num: number | undefined = 0;
if (num) {
  console.log('num is defined');
}

// nullable strings are considered unsafe by default
let str: string | null = null;
if (!str) {
  console.log('str is empty');
}

// nullable booleans are considered unsafe by default
function foo(bool?: boolean) {
  if (bool) {
    bar();
  }
}

// `any`, unconstrained generics and unions of more than one primitive type are disallowed
const foo = <T>(arg: T) => (arg ? 1 : 0);

// always-truthy and always-falsy types are disallowed
let obj = {};
while (obj) {
  obj = getObj();
}
```

Examples of **correct** code for this rule:

```tsx
// Using logical operators for their side effects is allowed
const Component = () => {
  const entry = map.get('foo') || {};
  return entry && <p>Name: {entry.name}</p>;
};

// nullable values should be checked explicitly against null or undefined
let num: number | undefined = 0;
if (num != null) {
  console.log('num is defined');
}

let str: string | null = null;
if (str != null && !str) {
  console.log('str is empty');
}

function foo(bool?: boolean) {
  if (bool ?? false) {
    bar();
  }
}

// `any` types should be cast to boolean explicitly
const foo = (arg: any) => (Boolean(arg) ? 1 : 0);
```

## Options

Options may be provided as an object with:

- `allowString` (`true` by default) -
  Allows `string` in a boolean context.
  This is safe because strings have only one falsy value (`""`).
  Set this to `false` if you prefer the explicit `str != ""` or `str.length > 0` style.

- `allowNumber` (`true` by default) -
  Allows `number` in a boolean context.
  This is safe because numbers have only two falsy values (`0` and `NaN`).
  Set this to `false` if you prefer the explicit `num != 0` and `!Number.isNaN(num)` style.

- `allowNullableObject` (`true` by default) -
  Allows `object | function | symbol | null | undefined` in a boolean context.
  This is safe because objects, functions and symbols don't have falsy values.
  Set this to `false` if you prefer the explicit `obj != null` style.

- `allowNullableBoolean` (`false` by default) -
  Allows `boolean | null | undefined` in a boolean context.
  This is unsafe because nullable booleans can be either `false` or nullish.
  Set this to `false` if you want to enforce explicit `bool ?? false` or `bool ?? true` style.
  Set this to `true` if you don't mind implicitly treating false the same as a nullish value.

- `allowNullableString` (`false` by default) -
  Allows `string | null | undefined` in a boolean context.
  This is unsafe because nullable strings can be either an empty string or nullish.
  Set this to `true` if you don't mind implicitly treating an empty string the same as a nullish value.

- `allowNullableNumber` (`false` by default) -
  Allows `number | null | undefined` in a boolean context.
  This is unsafe because nullable numbers can be either a falsy number or nullish.
  Set this to `true` if you don't mind implicitly treating zero or NaN the same as a nullish value.

- `allowAny` (`false` by default) -
  Allows `any` in a boolean context.

## Related To

- TSLint: [strict-boolean-expressions](https://palantir.github.io/tslint/rules/strict-boolean-expressions)

- [no-unnecessary-condition](./no-unnecessary-condition.md) - Similar rule which reports always-truthy and always-falsy values in conditions
