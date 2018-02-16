---
id: cli
title: "Command Line Tool"
---
Verdaccio 命令行是启动和控制此应用的工具

## 命令

```bash
$ verdaccio --listen 4000 --config ~./config.yaml
```

| 参数                 | 默认值                            | 示例             | 描述        |
| ------------------ | ------------------------------ | -------------- | --------- |
| --listen \ **-l** | 4873                           | -p 7000        | HTTP 监听端口 |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | 配置文件路径    |

## Default config file location

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and Windows environment we look for [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Default storage location

We use **$XDG_DATA_HOME** environment variable as default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share. If you are using a custom storage, this location is irrelevant.