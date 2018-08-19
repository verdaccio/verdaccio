---
id: packages
title: "包的访问"
---
这是一系列的约束，它基于特定条件允许或限制对本地存储的访问。

安全约束构建于被使用的插件上，在默认情况下，`verdaccio`使用[htpasswd 插件](https://github.com/verdaccio/verdaccio-htpasswd)。 如果你使用不同的插件，行为可能会有所不同。 默认插件自己并不处理`allow_access`和`allow_publish`，它使用内部回退功能以防止插件尚未就绪。

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

如果`htpasswd` 返回用户名为组，所有用户，不管匿名与否，都会分别接到该组的权限以及插件提供的组。 例如，如果你以`npmUser`身份登录，组列表为。

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

重启`verdaccio`并在命令行中尝试安装`npmuser-core`。

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

如果你想要阻止访问/发布到一组包，只要不定义`access` 和 `publish`即可。

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

**注意库定义的顺序很重要同时必须使用双通配符**。 因为如果你没有包含它，`verdaccio`会帮你来包含它，这样你的依赖库解析会受到影响。

### 配置

You can define mutiple `packages` and each of them must have an unique `Regex`. The syntax is based on [minimatch glob expressions](https://github.com/isaacs/minimatch).

| 属性      | 类型      | 必须的 | 示例             | 支持  | 描述              |
| ------- | ------- | --- | -------------- | --- | --------------- |
| access  | string  | No  | $all           | all | 定义允许访问包的组       |
| publish | string  | No  | $authenticated | all | 定义允许发布的组        |
| proxy   | string  | No  | npmjs          | all | 针对特定的uplink限制查找 |
| storage | boolean | No  | [true,false]   | all | TODO            |

> 我们强烈建议不要再使用已被弃用的**allow_access**/**allow_publish** 和 **proxy_access**，它们很快就会被移除，请使用它们的精简版本 (**access**/**publish**/**proxy**) 。