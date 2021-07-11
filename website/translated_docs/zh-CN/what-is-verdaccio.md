---
id: what-is-verdaccio（verdaccio是什么）
title: "Verdaccio是什么？"
---

Verdaccio 是一个 **Node.js**创建的**轻量的私有npm proxy registry** <iframe width="560" height="315" src="https://www.youtube.com/embed/hDIFKzmoCaA?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe> 

## 源（Registry）是什么？

* 源（Registry）是用于管理包（Package）信息的存储库，其实现了**存储 CommonJS 兼容包的源规范（CommonJS Compliant Package Registry specification）**。
* 提供兼容 npm 客户端**（yarn、npm 或 pnpm）**的接口（API）。
* 语义版本号（Semantic Versioning）兼容**（semver）**。

    $> verdaccio
    

![registry](assets/verdaccio_server.gif)

## 使用Verdaccio

任何 Node.js 包管理器使用 Verdaccio 都是相当简单的。

![registry](assets/npm_install.gif)

你可以通过在全局环境下设置，让你的所有项目使用上自定义的源（Registry）

    npm set registry http://localhost:4873
    

或者在命令行中使用 npm 参数 `--registry`（在 yarn 里稍微有些不同）

    npm install lodash --registry http://localhost:4873
    

    yarn config set registry http://localhost:4873
    

## 私有

所有您发布的包是私有的并且访问权限仅取决于您的配置。

## Proxy

Verdaccio可以按需缓存所有依赖项，以加快在本地或专用网络环境中的安装速度。

## 简而言之

* 它是基于Node.js的网页应用程序
* 它是私有npm registry
* 它是本地网络proxy
* 它是可插入式应用程序
* 它非常容易安装和使用
* 我们提供Docker和Kubernetes支持
* 它与yarn, npm 和pnpm 100% 兼容
* Verdaccio 是**一种绿色，在中世纪后期的意大利很流行，常用于壁画**。