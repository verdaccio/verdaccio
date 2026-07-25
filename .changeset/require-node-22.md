---
"verdaccio": minor
---

feat: require Node.js 22 as the minimum supported version

**Node.js 22 or higher is now required** (previously the CLI still accepted Node.js 18,
while `engines` already demanded 20). The CLI refuses to start on older runtimes and
`engines` is set to `>=22`; Node.js 24 is the recommended version. CI, e2e, and smoke
test matrices now cover Node.js 22, 24, and 26. Registry operators on Node.js 18 or 20
must upgrade the runtime before taking this release.
