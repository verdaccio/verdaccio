---
id: 记录器
title: "记录器"
---
和任何网页应用程序一样， verdaccio 有自定义的内置记录器。您可以定义多种输出类型。

```yaml
logs:
  # 控制台输出
  - {type: stdout, format: pretty, level: http}
  # 文件输出
  - {type: file, path: verdaccio.log, level: info}
```

用`SIGUSR2` 来通知应用程序，此log-file 已循环，需要重新打开它。

### 配置

| 属性 | 类型  | 必填 | 范例                                             | 支持   | 描述                |
| -- | --- | -- | ---------------------------------------------- | ---- | ----------------- |
| 类型 | 字符串 | 不  | [stdout, file]                                 | 任意路径 | 定义输出              |
| 路径 | 字符串 | 不  | verdaccio.log                                  | 任意路径 | 如果类型为文件，请定义该文件的位置 |
| 格式 | 字符串 | 不  | [pretty, pretty-timestamped]                   | 任意路径 | 输出格式              |
| 级别 | 字符串 | 不  | [fatal, error, warn, http, info, debug, trace] | 任意路径 | 详细级别              |