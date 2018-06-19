---
id: ssl
title: "Configurar los Certificados SSL"
---
Siga estas instrucciones para configurar un certificado SSL que sirva al registro NPM bajo HTTPS.

* Actualice la propiedad listen desde `~/.config/verdaccio/config.yaml`:

    listen: 'https://your.domain.com/'
    

Una vez haya actualizado la propiedad listen e intente correr verdaccio nuevamente pedirá los certificados.

* Generar sus certificados

     $ openssl genrsa -out /Users/user/.config/verdaccio/verdaccio-key.pem 2048
     $ openssl req -new -sha256 -key /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-csr.pem
     $ openssl x509 -req -in /Users/user/.config/verdaccio/verdaccio-csr.pem -signkey /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-cert.pem
     ````
    
    * Edite su archivo config `/Users/user/.config/verdaccio/config.yaml`y añada la próxima sección
    
    

https: key: /Users/user/.config/verdaccio/verdaccio-key.pem cert: /Users/user/.config/verdaccio/verdaccio-cert.pem ca: /Users/user/.config/verdaccio/verdaccio-csr.pem

    <br />Alternativamente, si tiene un certificado de formato `server.pfx`, puede añadir la siguiente sección de configuración. La propiedad passphrase es opcional y solo necesaria en caso de que su certificado esté encriptado.
    
    

https: pfx: /Users/user/.config/verdaccio/server.pfx passphrase: 'secret' ````

More info on the `key`, `cert`, `ca`, `pfx` and `passphrase` arguments on the [Node documentation](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)

* Run `verdaccio` in your command line.

* Open the browser and load `https://your.domain.com:port/`

This instructions are mostly valid under OSX and Linux, on Windows the paths will vary but, the steps are the same.

## Docker

If you are using the Docker image, you have to set the `PROTOCOL` environment variable to `https` as the `listen` argument is provided on the [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43), and thus ignored from your config file.

You can also set the `PORT` environment variable if you are using a different port than `4873`.