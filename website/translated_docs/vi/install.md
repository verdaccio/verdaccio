---
id: cài đặt
title: "Installation"
---
Verdaccio là một ứng dụng web đa nền tảng. Bạn cần phải có một số điều kiện bắt buộc trước khi cài đặt.

#### Những yêu cầu tối thiểu

1. Phiên bản Node. js 
    - Đối với phiên bản `verdaccio@2.x` tối thiểu bạn phải dùng Node `v4.6.1`.
    - Đối với phiên bản `verdaccio@latest`, tối thiểu bạn phải dùng `6.12.0`.
2. npm `>=3.x` or `yarn`
3. Các giao diện hỗ trợ web bao gồm các trình duyệt như `Chrome, Firefox, Edge và IE9`.

## Cài đặt CLI

`verdaccio` phải được cài đặt theo một trong hai cách:

Using `npm`

```bash
npm install -g verdaccio
```

hoặc sử dụng `yarn`

```bash
yarn global add verdaccio
```

![install verdaccio](/svg/install_verdaccio.gif)

## Cách sử dụng cơ bản

Sau khi cài đặt, bạn chỉ cần thực hiện lệnh CLI:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/3.0.1
```

Để biết thêm thông tin về CLI, vui lòng [ đọc phần cli](cli.md).

## Hình ảnh Docker

`verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md).