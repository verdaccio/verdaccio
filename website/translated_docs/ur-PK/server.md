---
id: server-configuration
title: Server Configuration
---
This is mostly basic linux server configuration stuff but I felt it important to document and share the steps I took to get verdaccio running permanently on my server. You will need root (or sudo) permissions for the following.

## Running as a separate user

First create the verdaccio user:

```bash
$ sudo adduser --disabled-login --gecos 'Verdaccio NPM mirror' verdaccio
```

You create a shell as the verdaccio user using the following command:

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