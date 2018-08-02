---
id: puppet
title: "Puppet"
---
在Debian、Ubuntu、Fedora和RedHat中安装verdaccio。

# 用法

在使用Puppet模块安装verdaccio时有两个变量：

* Apply-mode (和puppet-apply一起使用，无需配置puppetmaster)
* Master-Agent-mode (puppet-agent会通过puppetmaster访问你的配置)。

在这两个变量中，你必须在你的puppet代码中显式调用"class nodejs {}"，原因在于puppet-verdaccio模块只以此做为先决条件，因此在安装nodejs时你具有所有你需要的灵活性。 向下滚动查看Master-Agent-mode的所有细节信息。

详细信息：

<https://github.com/verdaccio/puppet-verdaccio>

> 我们正在为这个集成寻找积极的贡献者，如果你感兴趣，请查看[这个票证](https://github.com/verdaccio/puppet-verdaccio/issues/11)。