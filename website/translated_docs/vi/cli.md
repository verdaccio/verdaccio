---
id: cli
title: "Công cụ dòng lệnh Command line"
---
Dòng lệnh CLI của Verdaccio là công cụ để bạn bắt đầu khởi động và kiểm soát ứng dụng này.

## Các lệnh

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Tham số            | Giá trị mặc định               | Ví dụ          | Miêu tả                |
| ------------------ | ------------------------------ | -------------- | ---------------------- |
| --listen \ **-l** | 4873                           | -p 7000        | http port              |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | đường dẫn tệp cấu hình |

## Vị trí đường dẫn tệp cấu hình mặc định

Để tìm thư mục chính, trước hết chúng ta chọn **$XDG_DATA_HOME**, sau đó tìm [biến môi trường APPDATA](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/) trong Window.

## Vị trí lưu trữ mặc định

Chúng tôi sử dụng biến môi trường **$XDG_DATA_HOME **làm mặc định để tìm bộ nhớ theo mặc định, <a href = "https://askubuntu.com/questions/538526/is-home-local-share-the-default- Value-for-xdg-data-home-in-ubuntu-14-04 "> cũng giống như </a> $HOME/.local/share. Vị trí này sẽ không liên quan đến bạn nếu bạn đang sử dụng bộ nhớ tùy chỉnh.