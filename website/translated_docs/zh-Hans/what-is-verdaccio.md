---
id: what-is-verdaccio（verdaccio是什么）
title: "Verdaccio是什么？"
---
Verdaccio 是一个 **Node.js**创建的**轻量的私有npm proxy registry**

## Registry是什么？

* 包的资源库，它执行**CommonJS Compliant Package Registry specification** 来阅读包信息
* 提供与npm clients **(yarn/npm/pnpm)**兼容的API
* 效仿Versioning语义兼容**(semver)**

    $> verdaccio
    

![registry](/svg/verdaccio_server.gif)

## 使用Verdaccio

用任何节点包manager client使用 verdaccio是相当简单的。

![registry](/svg/npm_install.gif)

您要么可以用定制registry全局设置所有项目

    npm set registry http://localhost:4873
    

或者把命令行作为npm里的参数`--registry`（在yarn里稍微有些不同）

    npm install lodash --registry http://localhost:4873
    

## 私有

所有您发布的包是私有的并且访问只取决于您的配置。

## Proxy

Verdaccio 按需要缓存所有相关项，并在当地或私有网络能会加速安装。

## Verdaccio是个小容器

* 它是基于Node.js的网页应用程序
* 它是私有npm registry
* 它是本地网络proxy
* 它是插件式应用程序
* 它相当容易安装和使用
* 我们提供Docker和Kubernetes支持
* 它与yarn, npm 和pnpm 100% 兼容
* 它**forked**于`sinopia@1.4.0`并且100% **向下兼容**。
* Verdaccio 表示**意大利中世纪晚期fresco 绘画中流行的一种绿色**的意思。