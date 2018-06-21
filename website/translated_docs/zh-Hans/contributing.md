---
id: 贡献
title: "贡献 Verdaccio"
---
First of all 跳入不熟悉的代码库并不容易，但我们在这里帮助您。

## 通信渠道

如果您愿意询问, 我们将使用两个渠道进行讨论:

* [公共 Gitter 频道](https://gitter.im/verdaccio/)
* [参与者松弛通道](https://verdaccio-npm.slack.com) (不幸的是, 只有通过电子邮件邀请, 您可能会询问 **Gitter** 将包括在内)

## 开始

乍一看, verdaccio 是一个单一的存储库, 但是有很多方法可以帮助您, 并提供多种技术来实践。

### 找到我的位置

我们有不同的技能, 所以, 让我们看看你可能会觉得舒服。

### 我知道或者我想学习节点. js

节点. js 是 `verdaccio`的基础, 我们使用库作为 `express`, `指挥官`, `请求` 或 `异步`。 Verdaccio基本上是一个Rest API，它可以与 npm </ code>客户端兼容，如<code> yarn </ code>。</p>

<p>我们有一个很长的<a href="plugins.md">插件列表</a>，可以随时使用和改进，但同时<a href="dev-plugins.md">您可以创建自己的</ a>.</p>

<h3>我宁愿在用户界面中工作</h3>

<p>最近，我们已经将<code> React </ code>和<code> element-react </ code>转移到现代技术。 我们期待看到如何改进用户界面的新想法。</p>

<h3>我感觉更舒适的改进堆栈</h3>

<p>当然，我们很乐意帮助我们改进堆栈，您可以将依赖关系升级为<code> eslint </ code>，<code> stylelint </ code>，<code> webpack </ code>。 您可能只需改进<code> webpack </ code>配置即可。 任何建议都非常受欢迎。 此外，无论您是否使用<strong> Yeoman </ strong>，您都可以通过<a href="https://github.com/verdaccio/generator-verdaccio-plugin"> verdaccio生成器</a>来帮助我们。</p>

<p>这里有一些想法：</p>

<ul>
<li>创建一个通用的eslint规则，用于跨所有依赖项或插件</li>
<li>改进流类型定义交付</li>
<li>移动到Webpack 4</li>
<li>使用Webpack改进热重载</li>
<li>我们在所有的依赖中使用babel和webpack，为什么不是一个常见的预设？</li>
<li>改善持续集成交付</li>
</ul>

<h3>我做了很棒的文档</h3>

<p>许多贡献者发现拼写错误和语法问题，这也有助于改善故障排除的整体体验。</p>

<h3>我是一个设计师</h3>

<p>我们有一个前端网站<a href="http://www.verdaccio.org/"> http://www.verdaccio.org/ </a>，很高兴看到您的想法。</p>

<p>我们的网站基于<a href="https://docusaurus.io/"> Docusaurus </a>。</p>

<h3>我是DevOps</h3>

<p>我们有一个广受欢迎的Docker镜像<a href="https://hub.docker.com/r/verdaccio/verdaccio/"> https://hub.docker.com/r/verdaccio/verdaccio/ </a> 需要维护并且很可能有很大的改进，我们需要您的知识以使所有用户受益。</p>

<p>我们支持<strong> Kubernetes </ strong>，<strong> Puppet </ strong>，<strong> Ansible </ strong>和<strong>厨师</ strong>，因此我们需要这些字段的帮助， 查看所有存储库。</p>

<h3>我可以做翻译</h3>

<p>Verdaccio的目标是成为多语种，以实现它<strong>我们拥有<a href="https://crowdin.com"> Crowdin </a>的出色支持</ strong>，这是一个非常棒的翻译平台。</p>

<p><img src="https://d3n8a8pro7vhmx.cloudfront.net/uridu/pages/144/attachments/original/1485948891/Crowdin.png" width="400px"/></p>

<p>我们已经建立了一个项目，您可以选择自己喜欢的语言，如果您没有发现您的语言可以随意请求<a href="https://github.com/verdaccio/verdaccio/issues/new">创建一张票</A>。</p>

<p><a href="https://crowdin.com/project/verdaccio">去Crowdin Verdaccio</a></p>

<h2>我准备贡献</h2>

<p>如果您正在考虑<em>“我已经看到<a href="repositories.md">存储库</a>，并且我愿意立即开始”</ em>，那么我对你有好消息 ，这是下一步。</p>

<p>您需要了解如何构建，<a href="build.md">我们已经为此准备了一个指南</a>。</p>

<p>一旦玩过所有脚本并知道如何使用它们，我们就可以开始下一步，运行<a href="test.md"> <strong>单元测试</ strong> </ a>。</p>

<h2>贡献者的完整列表。 我们想在这里看到你的脸！</h2>

<p>

<a href="graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>
</p>