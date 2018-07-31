---
id: docker
title: Docker
---
<div class="docker-count">
  ![alt Docker Pulls Count](http://dockeri.co/image/verdaccio/verdaccio "Docker Pulls Count")
</div>

要下载(pull)最新的预先-创建的[docker镜像](https://hub.docker.com/r/verdaccio/verdaccio/)：

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](/svg/docker_verdaccio.gif)

## 标记版本

自版本`v2.x`开始，您可以通过[标签](https://hub.docker.com/r/verdaccio/verdaccio/tags/)来下载(pull)docker镜像，具体操作如下:

对于主版本：

```bash
docker pull verdaccio/verdaccio:3
```

对于次版本：

```bash
docker pull verdaccio/verdaccio:3.0
```

对于特定（补丁）版本：

```bash
docker pull verdaccio/verdaccio:3.0.1
```

下一个主版本将使用 `beta`（主分支）版本。

```bash
docker pull verdaccio/verdaccio:beta
```

> 如果您对标签列表感兴趣，[ 请访问 Docker 网站枢纽](https://hub.docker.com/r/verdaccio/verdaccio/tags/)。

## 用Docker运行verdaccio

要运行docker 容器：

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

最后一个参数定义要使用的镜像。如果您还没有试的话，上面的代码将从dockerhub里下载(pull) 最新的预先创建的镜像。

如果您已经用 `verdaccio`作为最后参数[在本地创建一个镜像](#build-your-own-docker-image)。

您可以用 `-v`来绑定安装 `conf`, `storage` 和`plugins`到主机文件系统中:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

> 请注意：Verdaccio 在容器内是作为non-root 用户端 (uid=100, gid=101) 运行, 如果您使用绑定安装来覆盖默认设置, 您需要确保安装目录是被指定到正确的用户端。 在上面的示例里，您要运行 `sudo chown -R 100:101 /opt/verdaccio`，否则在运行的时候您会得到权限错误提醒。 推荐[使用docker卷（volume)](https://docs.docker.com/storage/volumes/)来替代绑定安装。

### 插件

插件可以在单独的目录里安装，并用Docker或者Kubernetes挂载，然而，请确保使用与Verdaccio Dockerfile相同的基镜像的本地依赖项来创建插件。

### Docker和自定义端口配置

任何在 `listen`下的`conf/config.yaml` 里配置的`host:port` 目前在使用docker时都将被忽略。

如果您希望在不同的端口获得verdaccio docker instance，比如 `docker run` 命令里的`5000`，请用 `-p 5000:4873`来取代`-p 4873:4873` 。

从版本2.?.? 开始, 假如您需要指定**docker 容器**内的监听端口， you can do so by providing additional arguments to `docker run`: `--env PORT=5000` This changes which port the docker container exposes and the port verdaccio listens to.

Of course the numbers you give to `-p` paremeter need to match, so assuming you want them to all be the same this is what you could copy, paste and adopt:

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

1. 获取[docker-compose](https://github.com/docker/compose)的最新版本。
2. 创建并运行容器：

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
    
    

## 创建您自己的Docker镜像

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

## Docker示例

There is a separate repository that hosts multiple configurations to compose Docker images with `verdaccio`, for instance, as reverse proxy:

<https://github.com/verdaccio/docker-examples>

## Docker 自定义创建

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