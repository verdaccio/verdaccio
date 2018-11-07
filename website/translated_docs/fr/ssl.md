---
id: ssl
title: "Configurez les Certificats SSL"
---
Suivez ces instructions pour configurer un certificat SSL servant le registre NPM sous HTTPS.

* Mettez à jour la propriété listen dans `~/.config/verdaccio/config.yaml`:

    listen: 'https://your.domain.com/'
    

Une fois que vous avez mis à jour le programme d'écoute et que vous avez essayé d'exécuter à nouveau verdaccio, des certificats vous seront demandés.

* Générer vos certificats

     $ openssl genrsa -out /Users/user/.config/verdaccio/verdaccio-key.pem 2048
     $ openssl req -new -sha256 -key /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-csr.pem
     $ openssl x509 -req -in /Users/user/.config/verdaccio/verdaccio-csr.pem -signkey /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-cert.pem
     ````
    
    * Editez votre dossier de configuration `/Users/user/.config/verdaccio/config.yaml` and add the following section
    
    

https: key: /Users/user/.config/verdaccio/verdaccio-key.pem cert: /Users/user/.config/verdaccio/verdaccio-cert.pem ca: /Users/user/.config/verdaccio/verdaccio-csr.pem

    <br />Comme alternative,si vous avez un certificat de format `server.pfx`, vous pouvez ajouter la section de configuration suivante. La phrase secrète est facultative et nécessaire uniquement si le certificat est crypté.
    
    

https: pfx: /Users/user/.config/verdaccio/server.pfx passphrase: 'secret' ````

Plus d'informations sur `key`, `cert`, `ca`, `pfx` et `passphrase`, Veuillez vous reporter à la [documentation sur les nœuds](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)

* Exécutez `verdaccio` dans votre ligne de commande.

* Ouvrez le navigateur et chargez `https://your.domain.com:port/`

Les instructions sont largement valables pour OSX et Linux. Pour Windows, les chemins peuvent varier, mais les étapes à suivre sont les mêmes.

## Docker

Si vous utilisez l'image Docker, vous devez définir la variable d'environnement `PROTOCOL` sur `https` car l'argument `listen` est fourni sur [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43), et est donc ignoré par le fichier de configuration.

Vous pouvez également définir la variable d'environnement `PORT` si vous utilisez un port autre que `4873`.