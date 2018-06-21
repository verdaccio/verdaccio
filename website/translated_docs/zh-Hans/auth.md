---
id: 认证
title: "认证"
---
认证绑定到您正在使用的授权 [插件](plugins.md) 。包限制还由 [包访问](packages.md) 处理。

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

`verdaccio`允许您启用匿名发布, 以实现您需要正确设置 [包访问](packages.md) .

例如：

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

如 [Issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) 所述，截至 `npm@5.3.0` 你仍然 **无法在没有 Token 的情况下发布包**。 `yarn` 没有此限制。

## 默认 htpasswd

为了简化安装, `verdaccio` 使用基于 `htpasswd` 的插件。 在默认情况下, 将使用 [外部插件](https://github.com/verdaccio/verdaccio-htpasswd) 作为 v3.0 版本。 此软件包的 v2 版本仍然包含此插件的内置版本。

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| 属性        | 类型     | 必填 | 示例         | 支持   | 描述                     |
| --------- | ------ | -- | ---------- | ---- | ---------------------- |
| file      | string | 是  | ./htpasswd | 任意路径 | 存储了加密认证信息的 htpasswd 文件 |
| max_users | number | 否  | 1000       | 任意数字 | 最大的用户数量                |

如果需要禁止新用户注册，可将配置修改为 `max_users: -1`.