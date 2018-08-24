---
id: docker
title: Docker
---
<div class="docker-count">
  ![alt Docker Pulls Count](http://dockeri.co/image/verdaccio/verdaccio "Docker Pulls Count")
</div>

Để tải [hình ảnh docker mới nhất](https://hub.docker.com/r/verdaccio/verdaccio/):

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](/svg/docker_verdaccio.gif)

## Những phiên bản thẻ

Bắt đầu với phiên bản `v2.x`, bạn có thể tải những hình ảnh này qua [tag](https://hub.docker.com/r/verdaccio/verdaccio/tags/), cụ thể như sau:

Đối với phiên bản chính:

```bash
docker pull verdaccio/verdaccio:3
```

Đối với phiên bản phụ:

```bash
docker pull verdaccio/verdaccio:3.0
```

Đối với một phiên bản (bản vá) cụ thể:

```bash
docker pull verdaccio/verdaccio:3.0.1
```

Phiên bản chính tiếp theo sẽ sử dụng bản `beta</​​code> (master branch).</p>

<pre><code class="bash">docker pull verdaccio/verdaccio:beta
`</pre> 

> Nếu bạn quan tâm đến danh sách thẻ, hãy [truy cập trang web Docker](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

## Sử dụng Docker để chạy verdaccio

Để chạy vùng chứa docker hãy chạy mã:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

Tham số cuối cùng sẽ xác định hình ảnh nào cần được sử dụng. Nếu bạn chưa thử, mã trên sẽ giúp bạn tải hình ảnh mới nhất được tạo trước từ ​​dockerhub.

Khi bạn muốn tạo [một bản sao cục bộ](#build-your-own-docker-image) hãy dùng `verdaccio` làm tham số cuối cùng.

Bạn có thể sử dụng `-v` để liên kết với `conf`, `storage` và `plugins` với hệ thống tệp host:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

> Lưu ý: Verdaccio chạy như một tài khoản non-root (uid = 100, gid = 101) bên trong vùng chứa. Nếu bạn sử dụng cài đặt bind để ghi đè lên các thiết lập mặc định, bạn cần đảm bảo thư mục cài đặt tương thích với tài khoản. Trong ví dụ trên, bạn sẽ chạy `sudo chown -R 100: 101/opt /verdaccio`, nếu không bạn sẽ nhận được cảnh báo lỗi quyền truy cập khi sử dụng. Chúng tôi khuyên bạn nên [ sử dụng khối lượng docker](https://docs.docker.com/storage/volumes/) thay vì cài đặt bắt buộc.

### Những phần mềm bổ trợ

Những phần mềm bổ trợ có thể được cài đặt trong một thư mục riêng biệt và được gắn với Docker hoặc Kubernetes, tuy nhiên, bạn nên đảm bảo việc tạo các phần mềm bổ trợ bằng cách sử dụng các phụ thuộc cục bộ của cùng một dữ liệu hình ảnh như Verdaccio Dockerfile.

### Docker và cấu hình cổng tùy chỉnh

Bất kỳ một `host: port` nào sử dụng cấu hình trong `conf / config.yaml` ở `listen` sẽ bị bỏ qua khi sử dụng docker.

Nếu bạn muốn có bản sao của verdaccio docker trên một cổng khác, chẳng hạn như `5000` trong lệnh `docker run`, bạn cần thay thế `-p 4873: 4873` bằng `-p 5000: 4873`.

Bắt đầu từ phiên bản 2.?.? sẽ cho phép bạn chỉ định cổng nghe trong **docker container**. bạn có thể thực hiện thao tác này bằng cách cung cấp các tham số bổ sung cho `docker run`: `--env ​​PORT=5000 `. Điều này sẽ thay đổi cổng được hiển thị bởi vùng chứa docker và cổng mà verdaccio sử dụng.

Tất nhiên, những tham số `-p` bạn cung cấp phải khớp, vì vậy nếu bạn muốn tất cả chúng giống nhau, bạn chỉ cần sao chép, dán và sử dụng:

```bash
PORT=5000; docker run -it --rm --name verdaccio \
  --env PORT -p $PORT:$PORT
  verdaccio/verdaccio
```

### Sử dụng HTTPS trong Docker

Bạn có thể cài đặt cấu hình giao thức tương tự như cấu hình cổng mà verdaccio sẽ sử dụng. Sau khi bạn xác định certificate trong config.yaml, bạn phải ghi đè giá trị mặc định ("http") trong biến môi trường ` PROTOCOL ` bằng "https".

```bash
PROTOCOL=https; docker run -it --rm --name verdaccio \
  --env PROTOCOL -p 4873:4873
  verdaccio/verdaccio
```

### Sử dụng docker-compose

1. Tải phiên bản mới nhất của [docker-compose](https://github.com/docker/compose).
2. Tạo và chạy vùng chứa:

```bash
$ docker-compose up --build
```

Sử dụng `PORT=5000` làm tiền tố cho lệnh trên nhằm cài đặt cổng để sử dụng (cả vùng chứa và máy chủ lưu trữ).

Docker sẽ tạo ra một ổ đĩa có tên là lưu trữ dữ liệu ứng dụng liên tục. Bạn có thể sử dụng `docker inspect` hoặc `docker volume inspect` để xác định vị trí thực của ổ đĩa này và chỉnh sửa cấu hình, ví dụ như:

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
    
    

## Tạo hình ảnh Docker của riêng bạn

```bash
docker build -t verdaccio .
```

Ngoài ra còn có một script npm để tạo ra một hình ảnh docker, vì vậy bạn cũng có thể làm như sau:

```bash
npm run build:docker
```

Xin lưu ý rằng việc tạo hình ảnh đầu tiên mất vài phút vì nó cần phải chạy `npm install` và khi bạn thay đổi bất cứ điều gì vào bất kỳ lúc nào và không được liệt kê trong `.dockerignore` thì sẽ mất một thời gian dài để chạy các tập tin này.

Nếu bạn muốn sử dụng hình ảnh docker trên một thiết bị rpi hoặc một thiết bị tương thích khác thì cũng cần một dockerfile được tạo sẵn trước đó. Để tạo một hình ảnh docker của Raspberry Pi, bạn cần thực hiện như sau:

```bash
npm run build:docker:rpi
```

Lưu ý rằng bạn cần phải cài đặt docker trên máy của bạn để thực hiện bất kỳ lệnh docker nào ở trên, docker executable phải nằm trong `$PATH` của bạn.

## Ví dụ Docker

Có một kho lưu trữ riêng biệt lưu nhiều cấu hình để tạo hình ảnh Docker với `verdaccio`, ví dụ như đối với reverse proxy:

<https://github.com/verdaccio/docker-examples>

## Tạo tùy chỉnh Docker

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