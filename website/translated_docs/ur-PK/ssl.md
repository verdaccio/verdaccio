---
id: ssl
title: Set up the SSL Certificates
---
Follow this instructions to configure a SSL certificate to serve NPM registry under HTTPS.

* Update the listen property in your `~/.config/verdaccio/config.yaml`:

    listen: 'https://your.domain.com/'
    

Once you update the listen and try to run verdaccio again will ask for certificates.

* Generate your certificates

     $ openssl genrsa -out ~/.config/verdaccio/verdaccio-key.pem 2048
     $ openssl req -new -sha256 -key ~/.config/verdaccio/verdaccio-key.pem -out ~/.config/verdaccio/verdaccio-csr.pem
     $ openssl x509 -req -in ~/.config/verdaccio/verdaccio-csr.pem -signkey ~/.config/verdaccio/verdaccio-key.pem -out ~/.config/verdaccio/verdaccio-cert.pem
     ````
    
    * Edit your config file `~/.config/verdaccio/config.yaml` and add the following section
    
    

https: key: ~/.config/verdaccio/server.key cert: ~/.config/verdaccio/server.crt ca: ~/.config/verdaccio/server.ca

    <br />Alternatively, if you have a certificate as `server.pfx` format, you can add the following configuration section. The passphrase is optional and only needed, if your certificate is encrypted.
    
    

https: pfx: ~/.config/verdaccio/server.pfx passphrase: 'secret' ````

More info on the `key`, `cert`, `ca`, `pfx` and `passphrase` arguments on the [Node documentation](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)

* Run `verdaccio` in your command line.

* Open the browser and load `https://your.domain.com:port/`

This instructions are mostly valid under OSX and Linux, on Windows the paths will vary but, the steps are the same.

## Docker

If you are using the Docker image, you have to set the `PROTOCOL` environment variable to `https` as the `listen` argument is provided on the [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43), and thus ignored from your config file.

You can also set the `PORT` environment variable if you are using a different port than `4873`.