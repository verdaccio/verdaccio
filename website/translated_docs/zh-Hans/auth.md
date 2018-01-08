---
id: authentification
date: 2017-07-10T23:36:56.503Z
title: 认证
---
认证部分设置与 "Auth" [ 插件 ](plugins.md)息息相关。包的访问限制也同时通过 [ 包访问权限](packages.md) 控制。

客户端的认证流程由 `npm` 自行处理，在你通过以下命令登陆后：

```bash
npm adduser --registry http://localhost:4873
```

`npm` 会将 Verdaccio 返回的 Token 保存在配置文件中，它存放于您的用户主目录下。 如需了解更多有关于 `npm 配置 (.npmrc)` 相关的内容，请查阅 [官方文档](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### 匿名发布包

`verdaccio`allows you to enable anonymous publish, to achieve that you will need to set up correctly your [packages acces](packages.md).

Eg:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

As is described [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) until `npm@5.3.0` and all minor releases **won't allow you publish without a token**. However `yarn` has not such limitation.

## Default htpasswd

In order to simplify the setup, `verdaccio` use a build-in plugin based on `htpasswd`.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| Property  | Type   | Required | Example    | Support | Description                              |
| --------- | ------ | -------- | ---------- | ------- | ---------------------------------------- |
| file      | string | Yes      | ./htpasswd | all     | file that host the encrypted credentials |
| max_users | number | No       | 1000       | all     | set limit of users                       |

In case to decide do not allow user to login, you can set `max_users: -1`.