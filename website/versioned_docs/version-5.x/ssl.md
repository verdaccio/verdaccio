---
id: ssl
title: "Set up the SSL Certificates"
---

Follow these instructions to configure an SSL certificate to serve an npm registry over HTTPS.


* Update the listen property in your `~/.config/verdaccio/config.yaml`:

````
listen: 'https://your.domain.com/'
````

Once you've updated the listen property and try to run verdaccio again, it will ask for certificates.

* Generate your certificates

````
 $ openssl genrsa -out /Users/user/.config/verdaccio/verdaccio-key.pem 2048
 $ openssl req -new -sha256 -key /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-csr.pem
 $ openssl x509 -req -in /Users/user/.config/verdaccio/verdaccio-csr.pem -signkey /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-cert.pem
 ````

* Edit your config file `/Users/user/.config/verdaccio/config.yaml` and add the following section:

````
https:
    key: /Users/user/.config/verdaccio/verdaccio-key.pem
    cert: /Users/user/.config/verdaccio/verdaccio-cert.pem
    ca: /Users/user/.config/verdaccio/verdaccio-csr.pem
````

Alternatively, if you have a certificate with the `server.pfx` format, you can add the following configuration section: (The passphrase is optional and only needed if your certificate is encrypted.)

````
https:
  pfx: /Users/user/.config/verdaccio/server.pfx
  passphrase: 'secret'
````

You can find more info on the `key`, `cert`, `ca`, `pfx`, and `passphrase` arguments in the [Node documentation](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)

* Run `verdaccio` in your command line.

* Open the browser and visit `https://your.domain.com:port/`

These instructions are mostly valid under OSX and Linux; on Windows the paths will vary, but the steps are the same.

## Docker
If you are using the Docker image, you have to set the `VERDACCIO_PROTOCOL` environment variable to `https`, as the `listen` argument is provided in the [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43) and thus ignored from your config file.

You can also set the `VERDACCIO_PORT` environment variable if you are using a port other than `4873`.
