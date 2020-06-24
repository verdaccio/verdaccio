---
id: docker
title: Docker
---

![alt Docker Pulls Count](https://dockeri.co/image/verdaccio/verdaccio "Docker Pulls Count")

要下载(pull)最新的预先-创建的[docker镜像](https://hub.docker.com/r/verdaccio/verdaccio/)：

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](assets/docker_verdaccio.gif)

<div id="codefund">''</div>

## 标记版本

自版本`v2.x`开始，您可以通过[标签](https://hub.docker.com/r/verdaccio/verdaccio/tags/)来下载(pull)docker镜像，具体操作如下:

对于主版本：

```bash
docker pull verdaccio/verdaccio:4
```

对于次版本：

```bash
docker pull verdaccio/verdaccio:4.0
```

对于特定（补丁）版本：

```bash
docker pull verdaccio/verdaccio:4.0.0
```

> 如果您对标签列表感兴趣，[ 请访问 Docker 网站枢纽](https://hub.docker.com/r/verdaccio/verdaccio/tags/)。

## Running Verdaccio using Docker

要运行docker 容器：

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

The last argument defines which image to use. The above line will pull the latest prebuilt image from dockerhub, if you haven't done that already.

如果您已经用 `verdaccio`作为最后参数[在本地创建一个镜像](#build-your-own-docker-image)。

您可以用 `-v`来绑定安装 `conf`, `storage` 和`plugins`到主机文件系统中:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio \
  -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

> Note: Verdaccio runs as a non-root user (uid=10001) inside the container, if you use bind mount to override default, you need to make sure the mount directory is assigned to the right user. In above example, you need to run `sudo chown -R 10001:65533 /opt/verdaccio` otherwise you will get permission errors at runtime. 推荐[使用docker卷（volume)](https://docs.docker.com/storage/volumes/)来替代绑定安装。

Verdaccio 4 provides a new set of environment variables to modify either permissions, port or http protocol. Here the complete list:

| 属性                    | default                | 描述                                                 |
| --------------------- | ---------------------- | -------------------------------------------------- |
| VERDACCIO_APPDIR      | `/opt/verdaccio-build` | the docker working directory                       |
| VERDACCIO_USER_NAME | `verdaccio`            | the system user                                    |
| VERDACCIO_USER_UID  | `10001`                | the user id being used to apply folder permissions |
| VERDACCIO_PORT        | `4873`                 | the verdaccio port                                 |
| VERDACCIO_PROTOCOL    | `http`                 | the default http protocol                          |

### 插件

插件可以在单独的目录里安装，并用Docker或者Kubernetes挂载，然而，请确保使用与Verdaccio Dockerfile相同的基镜像的本地依赖项来创建插件。

```docker
FROM verdaccio/verdaccio

USER root

ENV NODE_ENV=production

RUN npm i && npm install verdaccio-s3-storage

USER verdaccio
```

### Docker和自定义端口配置

Any `host:port` configured in `conf/config.yaml` under `listen` **is currently ignored when using docker**.

If you want to reach Verdaccio docker instance under different port, lets say `5000` in your `docker run` command add the environment variable `VERDACCIO_PORT=5000` and then expose the port `-p 5000:5000`.

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio \
  -e "VERDACCIO_PORT=8080" -p 8080:8080 \  
  verdaccio/verdaccio
```

Of course the numbers you give to `-p` paremeter need to match.

### 在Docker中使用HTTPS

您可以配置 verdaccio 要监听的协议，类似于端口配置。 在 config.yaml里指定证书后，您必须用"https"覆盖`PROTOCOL` 环境变量中的默认值("http")。

```bash
docker run -it --rm --name verdaccio \
  --env "VERDACCIO_PROTOCOL=https" -p 4873:4873
  verdaccio/verdaccio
```

### 使用docker-compose

1. 获取[docker-compose](https://github.com/docker/compose)的最新版本。
2. 创建并运行容器：

```bash
$ docker-compose up --build
```

You can set the port to use (for both container and host) by prefixing the above command with `VERDACCIO_PORT=5000`.

```yaml
version: '3.1'

services:
  verdaccio:
    image: verdaccio/verdaccio
    container_name: "verdaccio"
    networks:
      - node-network
    environment:
      - VERDACCIO_PORT=4873
    ports:
      - "4873:4873"
    volumes:
      - "./storage:/verdaccio/storage"
      - "./config:/verdaccio/conf"
      - "./plugins:/verdaccio/plugins"  
networks:
  node-network:
    driver: bridge
```

Docker将生成一个named volume（命名卷），它用于存储持久化应用程序数据。 您可以使用`docker inspect` 或者 `docker volume inspect` 来查看此volume（卷）的物理位置并编辑配置，比如：

```bash
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

```

## 创建您自己的Docker镜像

```bash
docker build -t verdaccio .
```

还有一个创建docker image（镜像）的npm脚本，因此您还可以执行以下操作：

```bash
yarn run build:docker
```

请注意：第一个镜像的创建要花费几分钟时间，因为它需要运行`npm install`，而且，当您任何时候更改任何没有列在`.dockerignore`里的文件，它也需要运行那么长的时间。

请注意，您需要在您的机器上安装 docker 来执行以上任何docker命令， docker 可执行程序应该在您的`$PATH`里。

## Docker示例

有个分开的 repository（资源库）承载多个配置来用 `verdaccio`生成Docker镜像，例如，reverse proxy（反向代理服务器）:

<https://github.com/verdaccio/docker-examples>

## Docker 自定义创建

> If you have made an image based on Verdaccio, feel free to add it to this list.

* [docker-verdaccio-gitlab](https://github.com/snics/docker-verdaccio-gitlab)
* [docker-verdaccio](https://github.com/deployable/docker-verdaccio)
* [docker-verdaccio-s3](https://github.com/asynchrony/docker-verdaccio-s3) 专用 NPM 容器可以备份到s3
* [docker-verdaccio-ldap](https://github.com/snadn/docker-verdaccio-ldap)
* [verdaccio-ldap](https://github.com/nathantreid/verdaccio-ldap)
* [verdaccio-compose-local-bridge](https://github.com/shingtoli/verdaccio-compose-local-bridge)
* [docker-verdaccio](https://github.com/Global-Solutions/docker-verdaccio)
* [verdaccio-docker](https://github.com/idahobean/verdaccio-docker)
* [verdaccio-server](https://github.com/andru255/verdaccio-server)
* [coldrye-debian-verdaccio](https://github.com/coldrye-docker/coldrye-debian-verdaccio) coldrye-debian-nodejs支持的verdaccio docker镜像。