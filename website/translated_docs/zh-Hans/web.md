---
id: webui
title: "网页用户界面2"
---


<p align="center"><img src="https://github.com/verdaccio/verdaccio/blob/master/assets/gif/verdaccio_big_30.gif?raw=true"></p>

Verdaccio有个网页用户界面，它只显示私有包并可以定制。

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

所有访问限制定义为[保护包](protect-your-dependencies.md)，它也将应用于网页界面。

### 配置

| 属性     | 类型      | 必填 | 范例                             | 支持  | 描述                                                                                                                                                   |
| ------ | ------- | -- | ------------------------------ | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable | boolean | No | true/false                     | all | 允许显示网页界面                                                                                                                                             |
| title  | string  | No | Verdaccio                      | all | HTML 页眉标题说明                                                                                                                                          |
| logo   | string  | No | http://my.logo.domain/logo.png | all | logo 位于的URI                                                                                                                                          |
| scope  | string  | No | \\@myscope                   | all | If you're using this registry for a specific module scope, specify that scope to set it in the webui instructions header (note: escape @ with \\@) |