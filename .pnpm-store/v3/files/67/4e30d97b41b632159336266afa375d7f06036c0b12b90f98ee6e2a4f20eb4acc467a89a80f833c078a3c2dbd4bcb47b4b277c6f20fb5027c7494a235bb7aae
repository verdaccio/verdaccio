# Prevent catch assertions in tests (no-try-expect)

This rule prevents the use of `expect` inside `catch` blocks.

## Rule Details

Expectations inside a `catch` block can be silently skipped. While Jest provides
an `expect.assertions(number)` helper, it might be cumbersome to add this to
every single test. Using `toThrow` concisely guarantees that an exception was
thrown, and that its contents match expectations.

The following patterns are warnings:

```js
it('foo', () => {
  try {
    foo(); // `foo` may be refactored to not throw exceptions, yet still appears to be tested here.
  } catch (err) {
    expect(err).toMatch(/foo error/);
  }
});

it('bar', async () => {
  try {
    await foo();
  } catch (err) {
    expect(err).toMatch(/foo error/);
  }
});

it('baz', async () => {
  try {
    await foo();
  } catch (err) {
    expect(err).toMatchObject({ code: 'MODULE_NOT_FOUND' });
  }
});
```

The following patterns are not warnings:

```js
it('foo', () => {
  expect(() => foo()).toThrow(/foo error/);
});

it('bar', async () => {
  await expect(fooPromise).rejects.toThrow(/foo error/);
});

it('baz', async () => {
  await expect(() => foo()).rejects.toThrow(
    expect.objectContaining({ code: 'MODULE_NOT_FOUND' }),
  );
});
```
