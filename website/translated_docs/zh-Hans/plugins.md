---
id: plugins
title: "插件"
---
Verdaccio is an plugabble aplication. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

> If you are interested to develop your own plugin, read the [development](dev-plugins.md) section.

## 用法

### 安装

```bash
$> npm install --global verdaccio-activedirectory
```

作为一个sinopia的分支项目，`verdaccio`和兼容`sinopia@1.4.0`的插件具有向后兼容性。在这种情况下，安装方式相同。

    $> npm install --global sinopia-memory
    

### 配置

打开`config.yaml`文件并按如下说明更新`auth`部分：

默认配置如下所示，由于在默认情况下我们使用一个内置的`htpasswd`插件，我们可以通过注释下面几行代码来禁用它：

### Auth插件配置

```yaml
 htpasswd:
    file: ./htpasswd
    #max_users: 1000
```

如果你决定使用`ldap`插件，将上述部分进行替换。

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### 多个Auth插件

这在技术上可行，插件的顺序变得非常重要，安全凭据将按顺序获取。

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

### 中间件插件配置

这是一个如何设置中间件插件的示例。所有的中间件插件必须被定义在**middlewares**命名空间。

```yaml
middlewares:
  audit:
    enabled: true
```

> You might follow the [audit middle plugin](https://github.com/verdaccio/verdaccio-audit) as base example.

### 存储插件配置

这是一个如何设置存储插件的示例。所有的存储插件必须在**store**命名空间进行定义。

```yaml
store:
  memory:
    limit: 1000
```

> If you define a custom store, the property **storage** in the configuration file will be ignored.

## 旧式插件

### Sinopia插件

(兼容所有版本)

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

> All sinopia plugins should be compatible with all future verdaccio versions. Anyhow, we encourage contributors to migrate them to the modern verdaccio API and using the prefix as *verdaccio-xx-name*.

## Verdaccio插件

(兼容2.1.x及以后版本)

### 授权插件

* [verdaccio-bitbucket](https://github.com/idangozlan/verdaccio-bitbucket)：verdaccio Bitbucket认证插件。
* [verdaccio-ldap](https://www.npmjs.com/package/verdaccio-ldap)：verdaccio LDAP认证插件。
* [verdaccio-active-directory](https://github.com/nowhammies/verdaccio-activedirectory)：verdaccio Active Directory认证插件
* [verdaccio-gitlab](https://github.com/bufferoverflow/verdaccio-gitlab)：使用Gitlab的Personal Access Token进行认证
* [verdaccio-htpasswd](https://github.com/verdaccio/verdaccio-htpasswd)：基于(内置)htpasswd文件插件的verdaccio认证插件
* [verdaccio-github-oauth](https://github.com/aroundus-inc/verdaccio-github-oauth): Github oauth authentication plugin for verdaccio.

### 中间件插件

* [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit)：支持*npm audit* cli的verdaccio插件(内置) (自3.x版本后兼容)

* [verdaccio-profile-api](https://github.com/ahoracek/verdaccio-profile-api)：该插件支持*npm profile*cli，以及针对基于*verdaccio-htpasswd*认证的*npm profile set password*插件。

### 存储插件

(兼容自3.x及以后版本)

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory)在内存中装载包的存储插件
* [verdaccio-s3-storage](https://github.com/remitly/verdaccio-s3-storage)在**Amazon S3**中存储包的存储插件
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud)在**Google Cloud Storage**中存储包的存储插件

## 警告

> Not all these plugins are been tested continuously, some of them might not work at all. Please if you found any issue feel free to notify the owner of each plugin.