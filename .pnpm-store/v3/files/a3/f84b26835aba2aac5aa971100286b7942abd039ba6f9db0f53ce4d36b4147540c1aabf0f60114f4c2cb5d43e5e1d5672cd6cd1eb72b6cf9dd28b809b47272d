# eslint-config-google [![Build Status](https://travis-ci.org/google/eslint-config-google.svg?branch=master)](https://travis-ci.org/google/eslint-config-google)

> ESLint [shareable config](http://eslint.org/docs/developer-guide/shareable-configs.html) for the [Google JavaScript style guide (ES2015+ version)](https://google.github.io/styleguide/jsguide.html)


## Installation

```
$ npm install --save-dev eslint eslint-config-google
```


## Usage

Once the `eslint-config-google` package is installed, you can use it by specifying `google` in the [`extends`](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) section of your [ESLint configuration](http://eslint.org/docs/user-guide/configuring).

```js
{
  "extends": "google",
  "rules": {
    // Additional, per-project rules...
  }
}
```

### Using the `google` config with `eslint:recommended`

There are several rules in the [`eslint:recommended` ruleset](http://eslint.org/docs/rules/) that Google style is not opinionated about that you might want to enforce in your project.

To use Google style in conjunction with ESLint's recommended rule set, extend them both, making sure to list `google` last:

```js
{
  "extends": ["eslint:recommended", "google"],
  "rules": {
    // Additional, per-project rules...
  }
}
```

To see how the `google` config compares with `eslint:recommended`, refer to the [source code of `index.js`](https://github.com/google/eslint-config-google/blob/master/index.js), which lists every ESLint rule along with whether (and how) it is enforced by the `google` config.


## License

Apache-2 © Google
