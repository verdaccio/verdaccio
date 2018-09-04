---
id: 贡献
title: "参与Verdaccio贡献"
---
First of all 一头扎进不熟悉的代码库并不容易，但是我们会在此帮助你。

## 沟通频道

如果您想知道，我们使用两个频道进行讨论：

* [公共Discord频道](http://chat.verdaccio.org/)

## 开始

乍一看，verdaccio只是单一资源库，但是有很多方法您可以参与贡献以及练习多种技术。

### 寻找适合我的地方

大家都有不同的技能，因此，让我们看看您在哪个方面会感觉舒适。

### 我知道或者我想要学习 Node.js

Node.js是`verdaccio`的基础, 我们使用 `express`, `commander`, `request` 或者 `async`程序库。 Verdaccio大体上就是一个Rest API ，它和`yarn`一样，创建与`npm` 客户端兼容的通信。

我们有很多[插件列表](plugins.md)可供使用和改善，但是同时[您也可以创建自己的插件](dev-plugins.md)。

### 我倾向在用户界面作业

最近，我们已经转移到使用`React` 和 `element-react`这样的现代技术。我们期待看到如何改善UI 的新想法。

### 我觉得改善堆栈更自在

当然，我们会很乐意您帮助我们改善堆栈，您可以将依赖项升级为 `eslint`, `stylelint`, `webpack`。 You might merely improve the `webpack` configuration would be great. 我们欢迎任何的建议。 此外，如果您有**Yeoman**的经验，您可以帮我们改善[verdaccio发生器](https://github.com/verdaccio/generator-verdaccio-plugin)。

这里是一些想法：

* 创建要在所有依赖项或插件中使用的eslint共同规则
* 改善定义传递的流程类型
* 迁移到Webpack 4
* 改善Webpack的组件级
* 我们在所有依赖项使用babel 和 webpack，为什么不能用通用预设？
* 改善持续集成传递

### 我在文档方面很在行

许多贡献者发现打字错误和语法问题，这也有助于我们提高故障排除的整体体验。

### 我是设计师

我们有个前端网站<http://www.verdaccio.org/> ，将很高兴看到您的想法。

我们的网站是基于[Docusaurus](https://docusaurus.io/)。

### 我是一名DevOps

我们有广受欢迎的Docker镜像<https://hub.docker.com/r/verdaccio/verdaccio/>，它需要维护和进行可能相当大的改善，我们需要您的知识来使所有用户都可受益。

我们支持 **Kubernetes**, **Puppet**, **Ansible** 和 **Chef**，在这些领域我们需要帮助，请随时查看所有资源库。

### 我可以翻译

Verdaccio的目标是多语言，为了实现这个目标，**我们得到**[Crowdin](https://crowdin.com) 的巨大支持，它是一个了不起的翻译平台。

<img src="https://d3n8a8pro7vhmx.cloudfront.net/uridu/pages/144/attachments/original/1485948891/Crowdin.png" width="400px" />

我们已经设置了一个项目，您可以选择自己最喜欢的语言，如果您没有找到想要的语言，请自由地发起[创建要求票证](https://github.com/verdaccio/verdaccio/issues/new)。

[转到 Crowdin Verdaccio](https://crowdin.com/project/verdaccio)

## 我已经做好贡献的准备

如果您正在想*“我已经查看[资源库](repositories.md)，并且愿意马上开始贡献”*，那么我有好消息给您，也就是下一步。

您将要了解如何创建，[我们已经为您准备了指南](build.md)。

一旦您熟悉了所有的脚本并知道如何使用它们，我们就做好进入下一步的准备，开始运行[**单元测试**](test.md)。

## 这里是贡献者的完整名单。我们希望在这里看到您！

<a href="graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>
