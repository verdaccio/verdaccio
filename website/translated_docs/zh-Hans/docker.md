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

您可以用`-v`来绑定安装 `conf`和`storage`到主机文件系统中：

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  verdaccio/verdaccio
```

> 请注意：Verdaccio 在容器内是作为non-root 用户端 (uid=100, gid=101) 运行, 如果您使用绑定安装来覆盖默认设置, 您需要确保安装目录是被指定到正确的用户端。 在上面的示例里，您要运行 `sudo chown -R 100:101 /opt/verdaccio`，否则在运行的时候您会得到权限错误提醒。 推荐[使用docker卷（volume)](https://docs.docker.com/storage/volumes/)来替代绑定安装。

### Docker和自定义端口配置

在使用docker 的时候，当前任何在`listen` 下的`conf/config.yaml` 里配置的`host:port`都将被忽略。

如果您要在不同端口下获得 verdaccio docker 实例，比如 `docker run` 命令里的`5000`，您可以用 `-p 5000:4873`取代 `-p 4873:4873` 。

从版本2.?.? 开始，如果您需要指定**docker容器**内特定监听端口， 您可以通过提供额外参数给`docker run`: `--env PORT=5000`来达成。这会改变docker容器显示的端口以及 verdaccio要监听的端口。

当然您给出的 `-p` 参数数字必须吻合，因此，假设您希望他们全都一样，您可以复制，黏贴和采用以下代码：

```bash
PORT=5000; docker run -it --rm --name verdaccio \
  --env PORT -p $PORT:$PORT
  verdaccio/verdaccio
```

### HTTPS 和Docker一起使用

您可以配置verdaccio要监听的协议，类似于端口配置。 当您在config.yaml里指定证书后，您必须用 "https"覆盖`PROTOCOL` 环境变量的默认值 ("http") 。

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

您可以添加`PORT=5000`到以上命令的前面来设置要使用（容器和主机）的端口。

Docker将生成一个用于存储持续应用程序数据的命名卷(named volume)。 您可以使用 `docker inspect` 或者 `docker volume inspect` 来查看此卷(volume) 的物理位置并编辑配置，比如：

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

还有一个创建 docker镜像的npm 脚本，因此您还可以执行以下操作：

```bash
npm run build:docker
```

请注意: 第一个创建的镜像要花几分钟时间，因为它需要运行 `npm install`, 而且，如果您更改任何未在`.dockerignore`列表里的文件，它也将会运行相同的时间。

如果您要在rpi或者兼容设备上使用docker镜像，也有现有的dockerfile。要生成raspberry pi（树莓派）的docker镜像，需要执行：

```bash
npm run build:docker:rpi
```

请注意， 以上所有docker命令都要求您的机台上安装docker, 而且docker 执行项必须在您的`$PATH`里。

## Docker示例

有个分开的资源库可以承载多个配置来用`verdaccio`生成Docker镜像, 比如，reverse proxy（反向代理服务器）:

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