---
id: cli
title: Command Line Tool
---
Verdaccio 命令行是启动和控制此应用的工具

## 命令

```bash
$ verdaccio --listen 4000 --config ./config.yaml
```

| 参数                 | 默认值                            | 示例            | 描述        |
| ------------------ | ------------------------------ | ------------- | --------- |
| --listen \ **-l** | 4873                           | -p 7000       | HTTP 监听端口 |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~/config.yaml | 配置文件路径    |