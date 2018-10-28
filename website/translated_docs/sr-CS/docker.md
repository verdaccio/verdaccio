---
id: docker
title: Docker
---
<div class="docker-count">
  ![alt Docker Pulls Count](http://dockeri.co/image/verdaccio/verdaccio "Docker Pulls Count")
</div>

Kako biste povukli (pull) najnoviji pre-built [docker image](https://hub.docker.com/r/verdaccio/verdaccio/):

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](/svg/docker_verdaccio.gif)

## Tagged Versions

Počevši od verzije `v2.x` možete povući docker images preko [tag](https://hub.docker.com/r/verdaccio/verdaccio/tags/), i onda:

Za glavne verzije:

```bash
docker pull verdaccio/verdaccio:3
```

Za podverzije:

```bash
docker pull verdaccio/verdaccio:3.0
```

Za specifičnu verziju (patch):

```bash
docker pull verdaccio/verdaccio:3.0.1
```

Za sledeću glavnu verziju `beta` (master branch) verziju.

```bash
docker pull verdaccio/verdaccio:beta
```

> Ako Vas zanima lista tagova, [posetite Docker Hub website](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

## Pokretanje verdaccio korišćenjem Docker-a

Kako biste pokrenuli docker container:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

Poslednji argument definiše koji image će se koristiti. Linija iznad povlači najnoviji prebuilt image sa dockerhub-a, ako to već niste uradili.

Ako imate [build an image locally](#build-your-own-docker-image) koristite `verdaccio` kao poslednji argument.

Možete koristiti `-v` kako biste vezali (bind) mount `conf`, `storage` i `plugins` za hosts filesystem:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

> Napomena: Verdaccio radi kao non-root user (uid=100, gid=101) unutar container-a. Ako koristite bind mount da pregazite zadate postavke (override), onda norate da dodelite mount directory pravom korisniku. U navedenom primeru, morate da pokrenete `sudo chown -R 100:101 /opt/verdaccio`, u suprotnom ćete dobiti permission errors u runtime. [Use docker volume](https://docs.docker.com/storage/volumes/) je preporučeno umesto korišćenja bind mount.

### Plugins

Plugins se mogu instalirati u posebnom direktorijumu i mountovati korišćenjem Docker-a ili Kubernetes. Ipak, postarajte se da build plugins sa native dependencies korišćenjem iste base image kao Verdaccio Dockerfile-a.

### Docker i custom port konfiguracija

Svaki `host:port` konfigurisan u `conf/config.yaml` pod `listen` se trenutno ignoriše dok se koristi docker.

Ako želite da pristupite verdaccio docker instanci pod različitim port-om, recimo `5000`, u Vašoj `docker run` komandi zamenite `-p 4873:4873` sa `-p 5000:4873`.

U slučaju da morate da odredite port to listen to **u docker kontejneru**, počevši od verzije 2.?.? to možete učiniti tako što ćete uneti dodatne argumente u `docker run`: `--env PORT=5000` Ovo menja port koji izlaže docker kontejner i port koji će verdaccio slušati (listens to).

Naravno, neophodno je da se brojevi koje ste zadali kao `-p` parametar podudaraju, tako da ako želite da se sve podudara, možete da kopirate, zalepite i usvojite:

```bash
PORT=5000; docker run -it --rm --name verdaccio \
  --env PORT -p $PORT:$PORT
  verdaccio/verdaccio
```

### Korišćenje HTTPS sa Docker-om

Možete konfigurisati protokol koji će verdaccio slušati (listen on) i to na sličan način kao što ste podesili port configuration. Potrebno je da zamenite zadatu vrednost("http") u `PROTOCOL` environment variabl-i sa "https",nakon što ste odredili sertifikate u config.yaml.

```bash
PROTOCOL=https; docker run -it --rm --name verdaccio \
  --env PROTOCOL -p 4873:4873
  verdaccio/verdaccio
```

### Korišćenje docker-compose

1. Nabavite poslednju verziju [docker-compose](https://github.com/docker/compose).
2. Build i pokrenite kontejner:

```bash
$ docker-compose up --build
```

Možete podesiti port koji će se upotrebljavati (i za kontejner i za host) tako što ćete dodati prefiks `PORT=5000` komandi iz gornjeg primera.

Docker će napraviti imenovani volume u kome će se čuvati podaci za aplikaciju. Možete koristiti `docker inspect` ili `docker volume inspect` kako biste otkrili fiizičku lokaciju volume-a i izmenili konfiguraciju, na primer:

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
    
    

## Napravite svoj sopstveni Docker image

```bash
docker build -t verdaccio .
```

Postoji takođe i npm script za building docker image-a, tako da možere da zadate i ovako:

```bash
npm run build:docker
```

Napomena: Prvi build može potrajati nekoliko minuta pošto mora da pokrene `npm install`, i ponovo će trajati dugo ako promenite bilo koji fajl koji nije izlistan u `.dockerignore`.

Ako želite da koristite docker image na rpi ili kompatibilnom uređaju, postoji dostupan dockerfile. Kako biste build docker image za raspberry pi izvršite sledeću komandu:

```bash
npm run build:docker:rpi
```

Primite k znanju da za svaku docker komandu morate imati na svojoj mašini instaliran docker zajedno executable koja mora biti dostuna na `$PATH`.

## Docker Primeri

Postoji zaseban repozitorijum koji hostuje multiple konfiguracije kako bi komponovao Docker images sa `verdaccio`, na primer, reverse proxy:

<https://github.com/verdaccio/docker-examples>

## Docker Custom Builds

* [docker-verdaccio-gitlab](https://github.com/snics/docker-verdaccio-gitlab)
* [docker-verdaccio](https://github.com/deployable/docker-verdaccio)
* [docker-verdaccio-s3](https://github.com/asynchrony/docker-verdaccio-s3) Privatni NPM container koji se može backup-ovati na s3
* [docker-verdaccio-ldap](https://github.com/snadn/docker-verdaccio-ldap)
* [verdaccio-ldap](https://github.com/nathantreid/verdaccio-ldap)
* [verdaccio-compose-local-bridge](https://github.com/shingtoli/verdaccio-compose-local-bridge)
* [docker-verdaccio](https://github.com/Global-Solutions/docker-verdaccio)
* [verdaccio-docker](https://github.com/idahobean/verdaccio-docker)
* [verdaccio-server](https://github.com/andru255/verdaccio-server)
* [coldrye-debian-verdaccio](https://github.com/coldrye-docker/coldrye-debian-verdaccio) docker image providing verdaccio from coldrye-debian-nodejs.