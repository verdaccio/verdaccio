# Build Verdaccio

Verdaccio relies on `yarn` instead `npm` to download depenedencies.

*Note: the current build only will build with `➜ yarn --version 0.28.4` or minor. It's not compatible with `yarn 1.x`*

```bash
  yarn install
```

## Scripts

We have a list of scripts that you will use for diferent kind of tasks, in the following section we describe all posible task based on branches. (yes 🎉🎉🎉 !! 🚧 we are working in the version 3.x that will provide a better and modern stack based on **Babel** and **Flow** 🚧.


#### Master branch (2.x)

On master branch the unique part we have to build is the UI which is based on React.js, webpack and CSS Modules.

### Scripts

script | Description 
--- | --- | 
release | this script is used to generate changelog and raise up the version according the commits messages
prepublish | it ensures before publish the new ui is being generated
test | run all the test 
pre:ci | specific task for CI, build the UI required for test
test:ci | run test generating coverage
test:only | run only test
test:coverage | run `nyc` as a wrapper to generate coverage with mocha test
coverage:html | run `nyc` to generate coverage reports
coverage:publish | publish on `codecov` the coverage (don't use it)
lint | run the linting for javascript code.
lint:css | run the linter for `css`
dev:webui | run a `webpack` server with hot reloading enabled `http://localhost:4872/#/` it requires a `verdaccio` server running in port `4873`.
pre:webpack | prepare the field for webpack (it a substask of `build:webui`)
build:webui | create the static assets for the UI with `webpack`
build:docker | create a local docker image with `verdaccio`
build:rpi | create a local docker for raspberry pi image with `verdaccio` **(experimental with no support)**


#### Branch (3.x)

The next major version is based on `babel` and `flow`. If you switch from master ensure to run `yarn install` again.

*Note: Only new scripts in bold*

### Scripts

script | Description 
--- | --- | 
**flow** | run flow check
**dev:start** | transpile and run `verdaccio` with `babel-node` on hot.
**code:build** | transpile `verdaccio` with `babel` and  copy transpiled code to `build/`
release | this script is used to generate changelog and raise up the version according the commits messages
prepublish | it ensures before publish the new ui is being generated
test | run all the test `jest`
pre:ci | specific task for CI, build the UI required for test
test:ci | run test generating coverage
test:only | run only test
coverage:publish | publish on `codecov` the coverage (don't use it)
lint | run the linting for javascript code.
lint:css | run the linter for `css`
dev:start | run `babel-node` and transpile code on memory
dev:webui | run a `webpack` server with hot reloading enabled `http://localhost:4872/#/` it requires a `verdaccio` server running in port `4873`.
pre:webpack | prepare the field for webpack (it a substask of `build:webui`)
code:build | run `babel` to transpile code and copy to `build/` destination folder. (it ignores UI code)
build:webui | create the static assets for the UI with `webpack`
build:docker | create a local docker image with `verdaccio`
build:rpi | create a local docker for raspberry pi image with `verdaccio` **(experimental with no support)**
