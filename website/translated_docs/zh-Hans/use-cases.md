---
id: use-cases（使用-场景）
title: "使用场景"
---
## 使用私有包

您可以添加用户并管理哪个用户可以访问哪个包。

建议您定义私有包的前缀。例如“local(当地）"，这样您私人的东西将如下所示：`local-foo`。 通过这种方法您可以清楚地把公有包和私有包分开。

## 从npmjs.org使用公有包

如果一些包没有在存储里，服务器将试着从npmjs.org中取它。 如果npmjs.org坏了，它会假装没有其他的包存在, 起到缓存包的作用。 Verdaccio will download only what's needed (= requested by clients), and this information will be cached, so if client will ask the same thing second time, it can be served without asking npmjs.org for it.

Example: if you successfully request express@3.0.1 from this server once, you'll able to do that again (with all it's dependencies) anytime even if npmjs.org is down. But say express@3.0.0 will not be downloaded until it's actually needed by somebody. And if npmjs.org is offline, this server would say that only express@3.0.1 (= only what's in the cache) is published, but nothing else.

## Override public packages

If you want to use a modified version of some public package `foo`, you can just publish it to your local server, so when your type `npm install foo`, it'll consider installing your version.

There's two options here:

1. You want to create a separate fork and stop synchronizing with public version.
    
    If you want to do that, you should modify your configuration file so verdaccio won't make requests regarding this package to npmjs anymore. Add a separate entry for this package to *config.yaml* and remove `npmjs` from `proxy` list and restart the server.
    
    When you publish your package locally, you should probably start with version string higher than existing one, so it won't conflict with existing package in the cache.

2. You want to temporarily use your version, but return to public one as soon as it's updated.
    
    In order to avoid version conflicts, you should use a custom pre-release suffix of the next patch version. For example, if a public package has version 0.1.2, you can upload 0.1.3-my-temp-fix. This way your package will be used until its original maintainer updates his public package to 0.1.3.