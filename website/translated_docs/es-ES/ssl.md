---
id: ssl
title: "Configurar los Certificados SSL"
---
Siga estas instrucciones para configurar un certificado SSL que sirva al registro NPM bajo HTTPS.

* Actualice la propiedad listen desde `~/.config/verdaccio/config.yaml`:

    listen: 'https://your.domain.com/'
    

Una vez haya actualizado la propiedad listen e intente correr verdaccio nuevamente pedirá los certificados.

* Genere sus certificados

     $ openssl genrsa -out /Users/user/.config/verdaccio/verdaccio-key.pem 2048
     $ openssl req -new -sha256 -key /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-csr.pem
     $ openssl x509 -req -in /Users/user/.config/verdaccio/verdaccio-csr.pem -signkey /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-cert.pem
     ````
    
    * Edite su archivo config `/Users/user/.config/verdaccio/config.yaml`y añada la próxima sección
    
    

https: key: /Users/user/.config/verdaccio/verdaccio-key.pem cert: /Users/user/.config/verdaccio/verdaccio-cert.pem ca: /Users/user/.config/verdaccio/verdaccio-csr.pem

    <br />Alternativamente, si tiene un certificado de formato `server.pfx`, puede añadir la siguiente sección de configuración. La propiedad passphrase es opcional y solo necesaria en caso de que su certificado esté encriptado.
    
    

https: pfx: /Users/user/.config/verdaccio/server.pfx passphrase: 'secret' ````

Puede encontrar más información referente a los argumentos `key`, `cert`, `ca`, `pfx` y `passphrase`, en la [Documentación de nodes](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)

* Ejecuta `verdaccio` en su línea de comandos.

* Abra el explorador y cargue `https://your.domain.com:port/`

Estas instrucciones son válidas mayormente para OSX y Linux. Para Windows, las rutas serán diferentes, pero los pasos a seguir son iguales.

## Docker

Si está usando la imagen Docker, debe configurar la variable de entorno `PROTOCOL` como `https` ya que el argumento `listen` es proporcionado por [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43) y, por lo tanto, ignora lo establecido en su archivo config.

También puede configurar la variable de entorno `PORT` si está usando un puerto diferente a `4873`.