---
id: server-configuration
title: "Configuración del Servidor"
---
Esta materia es principalmente la configuración básica del servidor de linux pero me pareció importante documentar y compartir los pasos que tomé para obtener la ejecución de verdaccio permanentemente en mi servidor. Necesitará permisos de root (o sudo) para lo siguiente.

## Ejecutar como un usuario separado

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

## Atender todas las direcciones

Si quiere atender cada dirección externa establezca la directiva a atender en la configuración para:

```yaml
# you can specify listen address (or simply a port)
listen: 0.0.0.0:4873
```

Si está ejecutando `verdaccio` en una instancia de Amazon EC2, [necesitará establecer la escucha en cambiar su archivo de configuración](https://github.com/verdaccio/verdaccio/issues/314#issuecomment-327852203) como se describió anteriormente.

> ¿Configurar Apache? Por favor verifique la [Configuración Inversa de Proxy](reverse-proxy.md)

## Mantener verdaccio ejecutándose para siempre

Podemos utilizar el paquete de nodo llamado 'forever' para mantener verdaccio ejecutándose todo el tiempo. https://github.com/nodejitsu/forever

Primero instale forever globalmente:

```bash
$ sudo npm install -g forever
```

Asegúrese que ha iniciado verdaccio al menos una vez para generar el archivo de configuración y escriba el usuario admin creado. Puede entonces utilizar el siguiente comando para iniciar verdaccio:

```bash
$ forever start `which verdaccio`
```

Puede verificar la documentación para más información sobre como utilizar forever.

## Sobrevivir a los reinicios del servidor

Podemos utilizar crontab y forever juntos para reiniciar verdaccio después de un reinicio del servidor. Cuando inicie sesión como usuario de verdaccio haga lo siguiente:

```bash
$ crontab -e
```

Esto podría pedirle que escoja un editor. Elija su favorito y continúe. Agregue la siguiente entrada al archivo:

    @reboot /usr/bin/forever start /usr/lib/node_modules/verdaccio/bin/verdaccio
    

Las ubicaciones pueden variar dependiendo de su configuración del servidor. Si quiere saber donde están sus archivos puede utilizar el comando 'which':

```bash
$ which forever
$ which verdaccio
```