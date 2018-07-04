---
id: docker
title: Docker
---
<div class="docker-count">
  ![alt Docker Pulls Count](http://dockeri.co/image/verdaccio/verdaccio "Docker Pulls Count")
</div>

要拉出最新的预先-创建的[docker 图片](https://hub.docker.com/r/verdaccio/verdaccio/)：

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](/svg/docker_verdaccio.gif)

## 标记版本

自版本`v2.x`开始，您可以通过[标签](https://hub.docker.com/r/verdaccio/verdaccio/tags/)来拉出docker 图片，具体操作如下:

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

最后一个参数定义要使用的图片。如果您还没有操作的话，上面的代码将从dockerhub里拉出最新的预先创建的图片。

如果您已经用 `verdaccio`作为最后参数[在本地创建一个图片](#build-your-own-docker-image)。

您可以用`-v`来绑定安装 `conf`和`storage`到主机文件系统中：

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  verdaccio/verdaccio
```

> 请注意：Verdaccio 在容器内是作为non-root 用户 (uid=100, gid=101) 运行, 如果您使用绑定安装来覆盖默认设置, 您需要确保安装目录是被指定到正确的用户。 在上面的示例里，您要运行 `sudo chown -R 100:101 /opt/verdaccio`，否则在运行的时候您会得到权限错误提醒。 推荐[使用docker卷](https://docs.docker.com/storage/volumes/)来替代绑定安装。

### Docker和自定义端口配置

在使用docker 的时候，当前都忽略任何在`listen` 下的`conf/config.yaml` 里配置的`host:port`。

如果您要在不同端口下获得 verdaccio docker 实例，比如 `docker run` 命令里的`5000`，您可以用 `-p 5000:4873`取代 `-p 4873:4873` 。

从版本2.?.? 开始，如果您需要指定**docker容器**内特定倾听端口， 您可以通过提供额外参数给`docker run`: `--env PORT=5000`来达成。这会改变docker容器显示的端口以及 verdaccio要听从的端口。

当然您给出 `-p` 参数数字必须吻合，因此，假设您希望他们全都一样，您可以复制，黏贴和采用以下代码：

```bash
PORT=5000; docker run -it --rm --name verdaccio \
  --env PORT -p $PORT:$PORT
  verdaccio/verdaccio
```

### HTTPS 和Docker一起使用

您可以配置verdaccio要听从的协议，类似于端口配置。 当您在config.yaml里指定证书后，您必须用 "https"覆盖`PROTOCOL` 环境变量的默认值 ("http") 。

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

您可以添加`PORT=5000`到以上命令之前来设置要使用（容器和主机）的端口。

Docker将生成一个用于存储持续应用程序数据的命名卷。 You can use `docker inspect` or `docker volume inspect` to reveal the physical location of the volume and edit the configuration, such as:

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
* [coldrye-debian-verdaccio](https://github.com/coldrye-docker/coldrye-debian-verdaccio) docker image providing verdaccio from coldrye-debian-nodejs.