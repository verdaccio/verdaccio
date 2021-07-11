---
id: cli
title: "命令行工具"
---

The Verdaccio CLI is your tool to start and stop the application.

## 命令

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| 参数                 | 默认值                            | 示例             | 描述                                   |
| ------------------ | ------------------------------ | -------------- | ------------------------------------ |
| --listen \ **-l** | 4873                           | -p 7000        | HTTP 监听端口                            |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | 配置文件路径                               |
| --info \ **-i**   |                                |                | prints local environment information |

## 默认配置文件路径位置

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and for Windows environments we look for the [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Config file format

Config files should be YAML, JSON or a NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## 默认存储位置

We use the **$XDG_DATA_HOME** environment by variable default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share. 如果您正在使用自定义存储，则与此位置不相干。

## Default database file location

The default database file location is in the storage location. Starting with version 4.0.0, the database file name will be **.verdaccio-db.json** for a new installation of Verdaccio. When upgrading an existing Verdaccio server, the file name will remain **.sinopia-db.json**.

## Environment variables

[Full list of environment variables](https://github.com/verdaccio/verdaccio/blob/master/docs/env.variables.md).

* `VERDACCIO_HANDLE_KILL_SIGNALS` to enable gracefully shutdown (since v4.12.0)