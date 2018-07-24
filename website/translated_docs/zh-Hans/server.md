---
id: 服务器-配置
title: "服务器配置"
---
这主要是一些基础的linux服务器配置信息，但是我觉得很重要来记录并分享我让verdaccio 在我的服务器上永久运行的步骤。 您将需要以下的根（或者sudo）权限。

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

Make sure you've started verdaccio at least once to generate the config file and write down the created admin user. You can then use the following command to start verdaccio:

```bash
$ forever start `which verdaccio`
```

You can check the documentation for more information on how to use forever.

## Surviving server restarts

We can use crontab and forever together to restart verdaccio after a server reboot. When you're logged in as the verdaccio user do the following:

```bash
$ crontab -e
```

This might ask you to choose an editor. Pick your favorite and proceed. Add the following entry to the file:

    @reboot /usr/bin/forever start /usr/lib/node_modules/verdaccio/bin/verdaccio
    

The locations may vary depending on your server setup. If you want to know where your files are you can use the 'which' command:

```bash
$ which forever
$ which verdaccio
```