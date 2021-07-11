---
id: plugins
title: "插件"
---

Verdaccio is a pluggable application. Verdaccio is a pluggable application. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

There are 5 types of plugins:

* [Authentication](plugin-auth.md)
* [Middleware](plugin-middleware.md)
* [存储](plugin-storage.md)
* Custom Theme and filters

> 如果您感兴趣开发自己的插件，请阅读[开发](dev-plugins.md)部分。

## 使用

### 安装

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio` as a sinopia fork it has backward compability with plugins that are compatible with `sinopia@1.4.0`. In such case the installation is the same. In such case the installation is the same.

```
$> npm install --global sinopia-memory
```

### 配置

打开`config.yaml`文件并按如下说明更新`auth`部分：

默认配置如下所示，由于在默认情况下我们使用一个内置的`htpasswd`插件，我们可以通过注释下面几行代码来禁用它：


### Authentication Configuration

```yaml
  htpasswd:
    file: ./htpasswd
    # max_users: 1000
```

如果你决定使用`ldap`插件，将上述部分进行替换。

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### Multiple Authentication plugins

This is technically possible, making the plugin order important, as the credentials will be resolved in order.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    #max_users: 1000
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

### Middleware Configuration

This is an example how to set up a middleware plugin. This is an example how to set up a middleware plugin. All middleware plugins must be defined in the **middlewares** namespace.

```yaml
middlewares:
  audit:
    enabled: true
```

> 您可以跟着[audit middle plugin（审核中间插件）](https://github.com/verdaccio/verdaccio-audit)的基本范例。

### Storage Configuration

This is an example how to set up a storage plugin. This is an example how to set up a storage plugin. All storage plugins must be defined in the **store** namespace.

```yaml
store:
  memory:
    limit: 1000
```

### Theme Configuration

Verdaccio allows to replace the User Interface with a custom one, we call it **theme**. By default, uses `@verdaccio/ui-theme` that comes built-in, but, you can use something different installing your own plugin. By default, uses `@verdaccio/ui-theme` that comes built-in, but, you can use something different installing your own plugin.

```bash

$> npm install --global verdaccio-theme-dark

```

> The plugin name prefix must start with `verdaccio-theme`, otherwise the plugin won't load.


You can load only one theme at a time and pass through options if you need it.

```yaml
theme:
  dark:
    option1: foo
    option2: bar
```

## 旧式插件

### Sinopia插件

> If you are relying on any sinopia plugin, remember are deprecated and might no work in the future.

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm)：支持npm注册表的sinopia认证插件。
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory)：在内存中缓存用户的sinopia认证插件。
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli)。
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd)：支持atlassian crowd的sinopia认证插件。
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory)：sinopia Active Directory认证插件。
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth)：sinopia2的认证插件，支持github oauth web flow。
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth)：将认证代理给另一个HTTP URL的Sinopia认证插件。
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap)：另一个Sinopia LDAP认证插件
* [sinopia-request](https://www.npmjs.com/package/sinopia-request)：一个简单易用且功能齐全的认证插件，可以通过配置使用外部API。
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email)：使用htaccess格式生成密码，通过GPG加密并通过MailGun API发送给用户。
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb)：一个易用且功能齐全的认证插件，可通过配置使用mongodb数据库。
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd)：支持htpasswd格式的sinopia认证插件。
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb)：针对Sinopia private npm的基于leveldb的Sinopia认证插件。
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres)：sinopia Gitlab认证插件。
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab)：sinopia Gitlab认证插件。
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap)：sinopia LDAP认证插件。
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env)：基于github oauth web flow的Sinopia认证插件。

> 所有sinopia 插件都应该和所有verdaccio将来版本兼容。 无论如何，我们鼓励贡献者们迁移到 modern verdaccio API并使用 *verdaccio-xx-name*为前缀。

