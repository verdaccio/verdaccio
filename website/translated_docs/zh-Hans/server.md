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

The 'cd ~' command send you to the home directory of the verdaccio user. Make sure you run verdaccio at least once to generate the config file. Edit it according to your needs.

## Listening on all addresses

If you want to listen to every external address set the listen directive in the config to:

```yaml
# you can specify listen address (or simply a port)
listen: 0.0.0.0:4873
```

If you are running `verdaccio` in a Amazon EC2 Instance, [you will need set the listen in change your config file](https://github.com/verdaccio/verdaccio/issues/314#issuecomment-327852203) as is described above.

> Apache configure? Please check out the [Reverse Proxy Setup](reverse-proxy.md)

## Keeping verdaccio running forever

We can use the node package called 'forever' to keep verdaccio running all the time. https://github.com/nodejitsu/forever

First install forever globally:

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