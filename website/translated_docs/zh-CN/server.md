---
id: server-configuration（服务器-配置）
title: "服务器配置"
---
这主要是一些基础的linux服务器配置信息，但是我觉得很重要来记录并分享我让verdaccio 在服务器上永久运行的步骤。 您将需要以下的根（或者sudo）权限。

## 作为单独用户运行

首先创建verdaccio 用户：

```bash
$ sudo adduser --disabled-login --gecos 'Verdaccio NPM mirror' verdaccio
```

您用以下命令来创建一个 shell作为verdaccio用户:

```bash
$ sudo su verdaccio
$ cd ~
```

'cd ~' 命令把您送到verdaccio用户的主目录。请确保您至少运行一次verdaccio来生成config文件。根据您的需求来编辑它。

## 监听所有地址

如果您希望监听每个外部地址，请把config里的监听指令设置为:

```yaml
# you can specify listen address (or simply a port)
listen: 0.0.0.0:4873
```

如果您在Amazon EC2 Instance运行 `verdaccio`, 如上所述，[您将需要设置监听config 文件](https://github.com/verdaccio/verdaccio/issues/314#issuecomment-327852203) 。

> Apache configure? 请查看[逆向代理服务器配置](reverse-proxy.md)

## 让 verdaccio一直运行下去

我们可以使用名为'forever（永远）’的节点包来让verdaccio一直运行下去。 https://github.com/nodejitsu/forever

首先安装全局forever：

```bash
$ sudo npm install -g forever
```

请确保您至少已经启动一次verdaccio来生成config 文件，并记录下创建的管理员用户。然后，您可以用以下命令来启动verdaccio:

```bash
$ forever start `which verdaccio`
```

您可以查看文档来了解更多关于如何使用forever的信息。

## 存留服务器重启

我们可以在服务器重启后同时用crontab和forever来重启 verdaccio。当您以 verdaccio 用户登录后请执行以下操作：

```bash
$ crontab -e
```

这可能会要您选择一个编辑器。请挑选您最喜欢的并继续。请将以下条目添加到文件中：

    @reboot /usr/bin/forever start /usr/lib/node_modules/verdaccio/bin/verdaccio
    

取决于服务器的设置，位置可能会有所不同。如果您想知道文件的位置，可以使用 'which' 命令：

```bash
$ which forever
$ which verdaccio
```