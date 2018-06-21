---
id: server-configuration
title: "Configuración del Servidor"
---
Esta materia es principalmente la configuración básica del servidor de linux pero me pareció importante documentar y compartir los pasos que tomé para obtener la ejecución de verdaccio permanentemente en mi servidor. Necesitará permisos de raíz (o sudo) para lo siguiente.

## Ejecutar con un usuario separado

Crear primero el usuario de verdaccio:

```bash
$ sudo adduser --disabled-login --gecos 'Verdaccio NPM mirror' verdaccio
```

Crear una capa como el usuario de verdaccio utilizando el siguiente comando:

```bash
$ sudo su verdaccio
$ cd ~
```

El comando 'cd ~' lo envía al directorio principal del usuario de verdaccio. Asegúrese de ejecutar verdaccio al menos una vez para generar el archivo de configuración. Edítelo acorde a sus necesidades.

## Escuchar todas las direcciones

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