## Development notes

The `5.x` still under development, key points:

Ensure you have `nvm` installed or the latest Node.js (check `.nvmrc`
for mode details).

```bash
nvm install
```

Verdaccio uses **pnpm** as monorepo management. To install

```bash
npm i -g pnpm@latest
```

Install all needed packages

```bash
pnpm install
```

For building the application:

```bash
pnpm build
```

Running the test

```
pnpm test
```

### Running the application (with UI hot reloading)

```bash
pnpm start
```

with hot reloading (server and UI), `nodemon` will restart the server and `babel` runs
in watch mode.

```bash
pnpm start:watch
```

Running with `ts-node`

```
pnpm start:ts
```

### Running the Website

We use _Gatsbyjs_ as development stack for website,
please [for more information check their official guidelines.](https://www.gatsbyjs.com/docs/quick-start/)

```
pnpm website:develop
```

### Running E2E

For running the CLI test

```
pnpm test:e2e:cli
```

For running the UI test

```
pnpm test:e2e:ui
```

### Linting

Linting the code.

```bash
pnpm lint
```

For website runs

```bash
pnpm website:lint
```

Formatting the code with prettier

```bash
pnpm prettier
```

### Debugging

Run the server in debug mode (it does not include UI hot reload)
with `--inspect` support.

```
pnpm debug
pnpm debug:break
```

> requires `pnpm build` previously
