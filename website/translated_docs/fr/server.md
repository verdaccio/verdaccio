---
id: server-configuration
title: "Configuration du serveur"
---
Il s’agit principalement de la documentation de la configuration de base du serveur Linux, mais je pense qu’il est important de documenter et de partager les étapes que j’ai suivies pour démarrer définitivement Verdaccio sur mon serveur. Ils auront besoin d'autorisations root (ou sudo) pour les opérations suivantes.

## Gérer en tant qu'utilisateur distinct

Premièrement créez l’utilisateur verdaccio:

```bash
$ sudo adduser --disabled-login --gecos 'Verdaccio NPM mirror' verdaccio
```

Vous créez un shell en tant qu'utilisateur verdaccio à l'aide de la commande suivante:

```bash
$ sudo su verdaccio
$ cd ~
```

La commande 'cd ~' envoie le répertoire personnel de l'utilisateur verdaccio. Veillez à exécuter verdaccio au moins une fois pour générer le fichier de configuration. Changez-le en fonction de vos besoins.

## À l'écoute de toutes les adresses

Si vous souhaitez écouter chaque adresse externe, définissez la directive d'écoute dans la configuration sur:

```yaml
# you can specify listen address (or simply a port)
listen: 0.0.0.0:4873
```

Si vous exécutez `verdaccio` dans une instance Amazon EC2, [ vous devrez définir le paramètre 'écouter' dans le fichier 'changer votre configuration'](https://github.com/verdaccio/verdaccio/issues/314#issuecomment-327852203) comme décrit ci-dessus.

> Avez-vous besoin de configurer Apache? Veuillez vérifier la [configuration inverse du proxy](reverse-proxy.md)

## Garder verdaccio en opération pour toujours

Vous pouvez utiliser le package de nœud appelé 'forever' pour que le site verdaccio continue de fonctionner tout le temps. https://github.com/nodejitsu/forever

Premièrement installez forever entièrement:

```bash
$ sudo npm install -g forever
```

Assurez-vous que vous avez démarré au moins une fois verdaccio pour générer le fichier de configuration et notez l'utilisateur administrateur créé. Ensuite, la commande suivante peut être utilisée pour lancer verdaccio:

```bash
$ forever start `which verdaccio`
```

Vous pouvez consultez la documentation pour plus d'informations sur l'utilisation forever.

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