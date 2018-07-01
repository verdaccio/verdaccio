---
id: 认证
title: "认证"
---
认证关联到你正在使用的授权[插件](plugins.md)。程序包限制也是通过[程序包访问](packages.md)处理的。

客户认证由`npm` 客户自己处理。一旦登陆到应用程序后：

```bash
npm 添加用户 --注册 http://localhost:4873
```

代币由托管在用户主文件夹里的`npm`配置文件生成。 如需了解更多有关于 `npm 配置 (.npmrc)` 相关的内容，请查阅 [官方文档](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
注册=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### 匿名发布

`verdaccio` 允许启用匿名发布，要使用这个功能，必须设置正确的 [程序包访问权限](packages.md).

例如：

```yaml
  'my-company-*':
    访问: $anonymous
    发布: $anonymous
    代理服务器: npmjs
```

如 [Issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) 所述，截至 `npm@5.3.0` 你仍然 **无法在没有 Token 的情况下发布包**。 `yarn` 没有此限制。

## 默认 htpasswd

In order to simplify the setup, `verdaccio` use a plugin based on `htpasswd`. As of version v3.0.x an [external plugin](https://github.com/verdaccio/verdaccio-htpasswd) is used by default. The v2.x version of this package still contains the built-in version of this plugin.

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