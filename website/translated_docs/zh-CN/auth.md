---
id: authentication
title: "Authentication"
---

The authentication is tied to the auth [plugin](plugins.md) you are using. The package restrictions are also handled by the [Package Access](packages.md).

The client authentication is handled by the `npm` client itself. Once you log in to the application:

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

`verdaccio` allows you to enable anonymous publish. To achieve that you will need to correctly set up your [packages access](packages.md).

例如：

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

如 [Issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) 所述，截至 `npm@5.3.0` 你仍然 **无法在没有 Token 的情况下发布包**。

## 分组

### `$all` 和 `$anonymous` 的含义

As you know *Verdaccio* uses `htpasswd` by default. 这个插件没有实现 `allow_access`, `allow_publish` 和`allow_unpublish` 方法。 因此， *Verdaccio* 将会以下面的逻辑来处理这些情况：

* 如果你没有登录（即匿名状态），`$all` 和 `$anonymous` 是等价的。
* If you are logged in, `$anonymous` won't be part of your groups and `$all` will match any logged user. A new group `$authenticated` will be added to your group list.

Please note: `$all` **will match all users, whether logged in or not**.

**The previous behavior only applies to the default authentication plugin**. If you are using a custom plugin and such plugin implements `allow_access`, `allow_publish` or `allow_unpublish`, the resolution of the access depends on the plugin itself. Verdaccio will only set the default groups.

Let's recap:

* **logged in**: `$all` and `$authenticated` + groups added by the plugin.
* **logged out (anonymous)**: `$all` and `$anonymous`.

## 默认 htpasswd

In order to simplify the setup, `verdaccio` uses a plugin based on `htpasswd`. Since version v3.0.x the `verdaccio-htpasswd` plugin is used by default.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| 属性        | 类型  | 必填 | 示例         | 支持   | 描述                     |
| --------- | --- | -- | ---------- | ---- | ---------------------- |
| 文件        | 字符串 | 是  | ./htpasswd | 任意路径 | 存储了加密认证信息的 htpasswd 文件 |
| max_users | 数字  | 否  | 1000       | 任意数字 | 最大的用户数量                |

In case you decide to prevent users from signing up themselves, you can set `max_users: -1`.