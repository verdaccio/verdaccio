---
id: packages
title: "包的访问"
---
这是一系列的约束，它基于特定条件允许或限制对本地存储的访问。

安全约束构建于被使用的插件上，在默认情况下，`verdaccio`使用[htpasswd plugin](https://github.com/verdaccio/verdaccio-htpasswd)。 如果你使用不同的插件，行为可能会有所不同。 默认插件自己并不处理`allow_access`和`allow_publish`，它使用内部回退功能以防止插件尚未就绪。

关于权限的更多信息，请访问[维基文档的认证部分](auth.md)。

### 用法

```yalm
packages:
  # scoped packages
  '@scope/*':
    access: all
    publish: all
    proxy: server2

  'private-*':
    access: all
    publish: all
    proxy: uplink1

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    access: all
    publish: all
    proxy: uplink2
```

如果未进行任何设置，默认值则会被保留

```yaml
packages:
  '**':
     access: all
     publish: $authenticated
```

根据默认插件设置，有效的组列表为

```js
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'
```

All users recieve all those set of permissions independently of is anonymous or not plus the groups provided by the plugin, in case of `htpasswd` return the username as a group. 例如，如果你以`npmUser`身份登录，组列表为：

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

如果你想要保护你所在组的特定包，你需要做如下工作。 我们来使用一个包含所有前缀为`npmuser-`的包的`Regex`。 我们建议在包前使用前缀，通过这种方式更容易保护它们。

```yaml
packages:
  'npmuser-*':
     access: npmuser
     publish: npmuser
```

重启`verdaccio`并在命令行中安装`npmuser-core`。

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

你可以使用不同的插件认证来更改现有行为。 `verdaccio`只是检查试图访问或发布特定包的用户是否属于正确的组。

#### 设置多个组

定义多个访问组非常简单，只需要在它们之间加入一个空格。

```yaml
  'company-*':
    access: admin internal
    publish: admin
    proxy: server1
  'supersecret-*':
    access: secret super-secret-area ultra-secret-area
    publish: secret ultra-secret-area
    proxy: server1

```

#### 阻止对一组包的访问

如果你想要阻止访问/发布到一组包，只需要避免定义`access` 和 `publish`。

```yaml
packages:
  'old-*':
  '**':
     access: all
     publish: $authenticated
```

#### 阻止代理一组特定包

你可能想要阻止一个或多个包从远程库获取数据，但在同时，允许其他包访问不同的*uplinks*。

请看如下示例：

```yaml
packages:
  'jquery':
     access: $all
     publish: $all
  'my-company-*':
     access: $all
     publish: $authenticated
  '@my-local-scope/*':
     access: $all
     publish: $authenticated
  '**':
     access: all
     publish: $authenticated
     proxy: npmjs
```

让我们描述一下在上面的示例中我们想要做什么：

* 我想要自己的服务器上放置`jquery`依赖库但需要避免代理它。
* 我想要所有和`my-company-*`匹配的依赖库但我需要避免代理它们。
* 我想要在`my-local-scope`范围内的所有依赖库但我需要避免代理它们。
* 我想要代理所有剩余的依赖库。

Be **aware that the order of your packages definitions is important and always use double wilcard**. Because if you do not include it `verdaccio` will include it for you and the way that your dependencies are resolved will be affected.

### Configuration

You can define mutiple `packages` and each of them must have an unique `Regex`.

| Property | Type    | Required | Example        | Support | Description                                 |
| -------- | ------- | -------- | -------------- | ------- | ------------------------------------------- |
| access   | string  | No       | $all           | all     | define groups allowed to access the package |
| publish  | string  | No       | $authenticated | all     | define groups allowed to publish            |
| proxy    | string  | No       | npmjs          | all     | limit look ups for specific uplink          |
| storage  | boolean | No       | [true,false]   | all     | TODO                                        |

> We higlight that we recommend to not use **allow_access**/**allow_publish** and **proxy_access** anymore, those are deprecated and will soon be removed, please use the short version of each of those (**access**/**publish**/**proxy**).