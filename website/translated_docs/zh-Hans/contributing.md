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

<p>Here some ideas:</p>

<ul>
<li>Create a common eslint rules to be used across all dependencies or plugins</li>
<li>Improve Flow types definitions delivery</li>
<li>Moving to Webpack 4</li>
<li>Improve hot reload with Webpack</li>
<li>We use babel and webpack across all dependencies, why not a common preset?</li>
<li>Improve continous integration delivery</li>
</ul>

<h3>I do great Documentation</h3>

<p>Many contributors find typos and grammar issues, that also helps to improve the overall experience for troubleshooting.</p>

<h3>I am a Designer</h3>

<p>We have a frontend website <a href="http://www.verdaccio.org/">http://www.verdaccio.org/</a> that will be happy to see your ideas.</p>

<p>Our website is based on <a href="https://docusaurus.io/">Docusaurus</a>.</p>

<h3>I am a DevOps</h3>

<p>We have a widely popular Docker image <a href="https://hub.docker.com/r/verdaccio/verdaccio/">https://hub.docker.com/r/verdaccio/verdaccio/</a> that need maintenance and pretty likely huge improvements, we need your knowledge for the benefits of all users.</p>

<p>We have support for <strong>Kubernetes</strong>, <strong>Puppet</strong>, <strong>Ansible</strong> and <strong>Chef</strong> and we need help in those fields, feel free to see all repositories.</p>

<h3>I can do translations</h3>

<p>Verdaccio aims to be multilingual, in order to achieve it <strong>we have the awesome support</strong> of <a href="https://crowdin.com">Crowdin</a> that is an amazing platform for translations.</p>

<p><img src="https://d3n8a8pro7vhmx.cloudfront.net/uridu/pages/144/attachments/original/1485948891/Crowdin.png" width="400px"/></p>

<p>We have setup a project where you can choose your favourite language, if you do not find your language feel free to request one <a href="https://github.com/verdaccio/verdaccio/issues/new">creating a ticket</a>.</p>

<p><a href="https://crowdin.com/project/verdaccio">Go to Crowdin Verdaccio</a></p>

<h2>I'm ready to contribute</h2>

<p>If you are thinking <em>"I've seen already the <a href="repositories.md">repositories</a> and I'm willing to start right away"</em>  then I have good news for you, that's the next step.</p>

<p>You will need learn how to build, <a href="build.md">we have prepared a guide just for that</a>.</p>

<p>Once you have played around with all scripts and you know how to use them, we are ready to go to the next step, run the <a href="test.md"><strong>Unit Test</strong></a>.</p>

<h2>Full list of contributors. We want to see your face here !</h2>

<p>

<a href="graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>
</p>