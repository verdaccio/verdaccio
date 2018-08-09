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

从版本2.?.? 开始, 假如您需要指定**docker 容器**内的监听端口， 您可以通过提供额外的参数给`docker run`: `--env PORT=5000`来达成。这将更改docker容器显示的端口以及verdaccio监听的端口。

当然您给出的`-p`参数数字必须吻合，因此，假设您希望它们全部都一样，这是您需要复制，黏贴和采用的代码：

```bash
PORT=5000; docker run -it --rm --name verdaccio \
  --env PORT -p $PORT:$PORT
  verdaccio/verdaccio
```

### 在Docker中使用HTTPS

您可以配置 verdaccio 要监听的协议，类似于端口配置。 在 config.yaml里指定证书后，您必须用"https"覆盖`PROTOCOL` 环境变量中的默认值("http")。

```bash
PROTOCOL=https; docker run -it --rm --name verdaccio \
  --env PROTOCOL -p 4873:4873
  verdaccio/verdaccio
```

### 使用docker-compose

1. 获取[docker-compose](https://github.com/docker/compose)的最新版本。
2. 创建并运行容器：

```bash
$ docker-compose up --build
```

把`PORT=5000`作为以上命令的前缀来设置要使用（容器和主机二者）的端口。

Docker将生成一个named volume（命名卷），它用于存储持久化应用程序数据。 您可以使用`docker inspect` 或者 `docker volume inspect` 来查看此volume（卷）的物理位置并编辑配置，比如：

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

还有一个创建docker image（镜像）的npm脚本，因此您还可以执行以下操作：

```bash
npm run build:docker
```

请注意：第一个镜像的创建要花费几分钟时间，因为它需要运行`npm install`，而且，当您任何时候更改任何没有列在`.dockerignore`里的文件，它也需要运行那么长的时间。

如果您希望在rpi或兼容设备上使用docker镜像，也有现成的dockerfile。要创建 raspberry pi（树莓派）的docker镜像，请执行：

```bash
npm run build:docker:rpi
```

请注意，您需要在您的机器上安装 docker 来执行以上任何docker命令， docker 可执行程序应该在您的`$PATH`里。

## Docker示例

有个分开的 repository（资源库）承载多个配置来用 `verdaccio`生成Docker镜像，例如，reverse proxy（反向代理服务器）:

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