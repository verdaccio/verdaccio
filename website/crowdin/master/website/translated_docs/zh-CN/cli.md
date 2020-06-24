---
id: cli
title: "命令行工具"
---

Verdaccio 命令行是启动和控制此应用的工具。

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

要找到主目录，我们首先选择 **$XDG_DATA_HOME**，接着寻找Windows 环境 [APPDATA 环境变量](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/)。

## Config file format

Config file should be YAML, JSON or NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## 默认存储位置

我们以**$XDG_DATA_HOME** 环境变量为默认值来默认查找存储，[这应该和](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) $HOME/.local/share一样。 如果您正在使用自定义存储，则与此位置不相干。

## Default database file location

The default database file location is in the storage location. Starting with version 4.0.0, the database file name will be **.verdaccio-db.json** for a new installation of Verdaccio. When upgrading an existing Verdaccio server, the file name will remain **.sinopia-db.json**.