---
id: docker
title: Docker
---
<div class="docker-count">
  ![alt Docker Pulls Count](http://dockeri.co/image/verdaccio/verdaccio "Docker Pulls Count")
</div>

Pour télécharger la dernière [image docker](https://hub.docker.com/r/verdaccio/verdaccio/) prédéfinie:

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](/svg/docker_verdaccio.gif)

## Versions marquées

À partir de la version `v2.x`, vous pouvez obtenir des images du menu fixe pour la [tag](https://hub.docker.com/r/verdaccio/verdaccio/tags/), comme suit:

Pour une version majeure:

```bash
docker pull verdaccio/verdaccio:3
```

Pour une version mineure:

```bash
docker pull verdaccio/verdaccio:3.0
```

Pour une version spécifique (patch):

```bash
docker pull verdaccio/verdaccio:3.0.1
```

Pour la prochaine version majeure, utilisez la version `beta` (branche principale).

```bash
docker pull verdaccio/verdaccio:beta
```

> Si vous êtes intéréssés par une liste de tags, [veuillez visiter le site web Docker Hub](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

## En cours d’exécution de Verdaccio à l’aide de Docker

Pour exécuter le conteneur de docker:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

Le dernier argument définit quelle image est utilisée. La ligne ci-dessus téléchargera à partir du dockerhub la dernière image prédéfinie disponible, si celle-ci n'a pas encore été créée.

Si vous avez [construit une image localement](#build-your-own-docker-image), utilisez `verdaccio` comme dernier argument.

Vous pouvez utiliser `-v` pour monter `conf`, `storage` et `plugins` dans le système de fichiers hôte:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

> Remarque: Verdaccio s'exécute dans le conteneur en tant qu'utilisateur non root (uid = 100, gid = 101). Si vous utilisez le montage lié pour ignorer les paramètres par défaut, vous devez vous assurer que le dossier de montage est attribué à l'utilisateur correct. Dans l'exemple précédent, vous devez exécuter `sudo chown -R 100: 101 / opt / verdaccio`, sinon vous obtiendrez des erreurs d'autorisation pendant l'exécution. [Utiliser le volume docker](https://docs.docker.com/storage/volumes/) est recommandé, plutôt qu'utiliser le lieu du montage de liaison.

### Plugins

Les plugins peuvent être installés dans un dossier séparé et montés à l'aide de Docker ou de Kubernetes. Cependant, veillez à créer des plugins avec des dépendances natives à l'aide de la même image de base du fichier Docker de Verdaccio.

### Configuration de Docker et du port personnalisé

Chaque `host: port` configuré dans `conf/config.yaml` sous `listen` est actuellement ignoré lors de l'utilisation de docker.

Si vous souhaitez atteindre l’instance verdaccio docker depuis un autre port, dites `5000`, dans la commande `docker run`, remplacez `-p 4873: 4873` par `-p 5000: 4873`.

Si vous devez spécifier le port sur lequel écouter **dans le conteneur de menu fixe**, à partir de la version 2.?.? ceci est possible en fournissant des arguments supplémentaires à `docker run`: `- env PORT = 5000` Ceci remplace le port offert par le conteneur de menu fixe et le port écouté par verdaccio.

Bien sûr, les nombres fournis au paramètre `-p` doivent correspondre, donc si vous les voulez tous identiques, voici ce que vous pouvez copier, coller et adopter:

```bash
PORT=5000; docker run -it --rm --name verdaccio \
  --env PORT -p $PORT:$PORT
  verdaccio/verdaccio
```

### Using HTTPS with Docker

You can configure the protocol verdaccio is going to listen on, similarly to the port configuration. You have to overwrite the default value("http") of the `PROTOCOL` environment variable to "https", after you specified the certificates in the config.yaml.

```bash
PROTOCOL=https; docker run -it --rm --name verdaccio \
  --env PROTOCOL -p 4873:4873
  verdaccio/verdaccio
```

### Using docker-compose

1. Get the latest version of [docker-compose](https://github.com/docker/compose).
2. Build and run the container:

```bash
$ docker-compose up --build
```

You can set the port to use (for both container and host) by prefixing the above command with `PORT=5000`.

Docker will generate a named volume in which to store persistent application data. You can use `docker inspect` or `docker volume inspect` to reveal the physical location of the volume and edit the configuration, such as:

    $ docker volume inspect verdaccio_verdaccio
    [
        {
            "Name": "verdaccio_verdaccio",
            "Driver": "local",
            "Mountpoint": "/var/lib/docker/volumes/verdaccio_verdaccio/_data",
            "Labels": null,
            "Scope": "local"
        }
    ]
    
    

## Build your own Docker image

```bash
docker build -t verdaccio .
```

There is also an npm script for building the docker image, so you can also do:

```bash
npm run build:docker
```

Note: The first build takes some minutes to build because it needs to run `npm install`, and it will take that long again whenever you change any file that is not listed in `.dockerignore`.

If you want to use the docker image on a rpi or a compatible device there is also a dockerfile available. To build the docker image for raspberry pi execute:

```bash
npm run build:docker:rpi
```

Please note that for any of the above docker commands you need to have docker installed on your machine and the docker executable should be available on your `$PATH`.

## Docker Examples

There is a separate repository that hosts multiple configurations to compose Docker images with `verdaccio`, for instance, as reverse proxy:

<https://github.com/verdaccio/docker-examples>

## Docker Custom Builds

* [docker-verdaccio-gitlab](https://github.com/snics/docker-verdaccio-gitlab)
* [docker-verdaccio](https://github.com/deployable/docker-verdaccio)
* [docker-verdaccio-s3](https://github.com/asynchrony/docker-verdaccio-s3) Private NPM container that can backup to s3
* [docker-verdaccio-ldap](https://github.com/snadn/docker-verdaccio-ldap)
* [verdaccio-ldap](https://github.com/nathantreid/verdaccio-ldap)
* [verdaccio-compose-local-bridge](https://github.com/shingtoli/verdaccio-compose-local-bridge)
* [docker-verdaccio](https://github.com/Global-Solutions/docker-verdaccio)
* [verdaccio-docker](https://github.com/idahobean/verdaccio-docker)
* [verdaccio-server](https://github.com/andru255/verdaccio-server)
* [coldrye-debian-verdaccio](https://github.com/coldrye-docker/coldrye-debian-verdaccio) image de docker fournissant verdaccio à partir de coldrye-debian-nodejs.