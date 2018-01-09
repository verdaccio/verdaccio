---
id: protect-your-dependencies
title: Protecting packages
---
`verdaccio` allows you protect publish, to achieve that you will need to set up correctly your [packages acces](packages).

### Package configuration

Let's see for instance the following set up. You have a set of dependencies what are prefixed with `my-company-*` and you need to protect them from anonymous or another logged user without right credentials.

```yaml
  'my-company-*':
    access: admin teamA teamB teamC
    publish: admin teamA
    proxy: npmjs
```

With this configuration, basically we allow to groups **admin** and **teamA** to * publish* and **teamA** **teamB** **teamC** *access* to such dependencies.

### Use case: teamD try to access the dependency

So, if I am logged as **teamD**. I shouldn't be able to access all dependencies that match with `my-company-*` pattern.

```bash
➜ npm whoami
teamD
```

I won't have access to such dependencies and also won't be visible via web for user **teamD**. If I try to access the following will happen.

```bash
➜ npm install my-company-core
npm ERR! code E403
npm ERR! 403 Forbidden: webpack-1@latest
```

or with `yarn`

```bash
➜ yarn add my-company-core
yarn add v0.24.6
info No lockfile found.
[1/4] 
error An unexpected error occurred: "http://localhost:5555/webpack-1: unregistered users are not allowed to access package my-company-core".
```