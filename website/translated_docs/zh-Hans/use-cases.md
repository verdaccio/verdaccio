---
id: use-cases（使用-场景）
title: "使用场景"
---
## 使用私有包

您可以添加用户并管理哪个用户可以访问哪个包。

建议您定义私有包的前缀。例如“local(当地）"，这样您私人的东西将如下所示：`local-foo`。 通过这种方法您可以清楚地把公有包和私有包分开。

## 从npmjs.org使用公有包

如果一些包没有在存储里，服务器将试着从npmjs.org中取它。 如果npmjs.org坏了，它会假装没有其他的包存在, 起到缓存包的作用。 Verdaccio将只下载需要的 (= 由客户要求的)信息, 而且此信息将被缓存，这样如果客户再次问同样的事，它可以马上作用而不需要问npmjs.org。

例如：如果您曾经成功从此服务器请求express@3.0.1，哪怕npmjs.org 坏了，您也可以在任何时候再次请求（及其相关项）。 但是，除非有人真正需要express@3.0.0，否则它是不会被下载的。 而且如果npmjs.org脱线，此服务器将会说除了express@3.0.1 （=只有在缓存里的）外，没有其他的发布。

## 覆盖公共包

If you want to use a modified version of some public package `foo`, you can just publish it to your local server, so when your type `npm install foo`, it'll consider installing your version.

There's two options here:

1. You want to create a separate fork and stop synchronizing with public version.
    
    If you want to do that, you should modify your configuration file so verdaccio won't make requests regarding this package to npmjs anymore. Add a separate entry for this package to *config.yaml* and remove `npmjs` from `proxy` list and restart the server.
    
    When you publish your package locally, you should probably start with version string higher than existing one, so it won't conflict with existing package in the cache.

2. You want to temporarily use your version, but return to public one as soon as it's updated.
    
    In order to avoid version conflicts, you should use a custom pre-release suffix of the next patch version. For example, if a public package has version 0.1.2, you can upload 0.1.3-my-temp-fix. This way your package will be used until its original maintainer updates his public package to 0.1.3.