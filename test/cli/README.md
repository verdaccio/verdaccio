# E2E CLI Testing

## What is included on these test?

- Default configuration only
- Test with all popular package managers (`yarn classic` and `yarn modern (2,3, 4)`, `pnpm 6,7` and `npm 6, 7 and 8`)

### Commands Tested

| cmd     | npm6 | npm7 | npm8 | pnpm6 | pnpm7 | yarn1 | yarn2 | yarn3 | yarn4 |
| ------- | ---- | ---- | ---- | ----- | ----- | ----- | ----- | ----- | ----- |
| publish | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ❌    | ❌    | ❌    |
| info    | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ✅    | ✅    | ✅    |
| audit   | ✅   | ✅   | ✅   | ✅    | ✅    | ✅    | ✅    | ✅    | ❌    |

## How it works?

> TBA

### What should not included on these tests?

- Anything is unrelated with client commands usage, eg: (auth permissions, third party integrations,
  hooks, plugins)
