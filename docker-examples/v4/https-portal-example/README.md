# Verdaccio and https-portal Example

Run `verdaccio` under fully automated HTTPS server powered by Nginx, Let's Encrypt was never so easy. Using [https-portal](https://github.com/SteveLTN/https-portal) all is builtin and no need for extra configuration.

## Prerequisites

In order to make it work, this is just a local setup, so you must update your `host` file.

On Mac

```
➜ sudo vi /etc/hosts

##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
127.0.0.1       example.com
```

## Usage

To run the containers, run the followingcommands in this folder, it should start the containers in detach mode.

```bash
 docker-compose up -d
```

To recreate the nginx image you can force the build.

```bash
 docker-compose up --build -d
```

To force recreate the images.

```bash
docker-compose up --build --force-recreate  -d
```

To stop all containers

```bash
docker-compose stop
```

From your Javascript project

```bash
npm publish --registry https://example.com
```

## NPM and self-signed certificates

Be aware of disabling strict SSL in `./npmrc`config file as explained [here](https://stackoverflow.com/questions/9626990/receiving-error-error-ssl-error-self-signed-cert-in-chain-while-using-npm).

```bash
npm config set strict-ssl false
```

## Login

If you want to login into the Verdaccio instance created via these Docker Examples, please try:

Username: jpicado
Password: jpicado
