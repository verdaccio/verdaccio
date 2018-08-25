---
id: webui
title: "网页用户界面2"
---


<p align="center"><img src="https://github.com/verdaccio/verdaccio/blob/master/assets/gif/verdaccio_big_30.gif?raw=true"></p>

Verdaccio has a web user interface to display only the private packages and can be customisable.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

所有访问限制定义为[保护包](protect-your-dependencies.md)，它也将应用于网页界面。

### 配置

| 属性     | 类型      | 必填 | 范例                             | 支持  | 描述                                                                    |
| ------ | ------- | -- | ------------------------------ | --- | --------------------------------------------------------------------- |
| enable | boolean | No | true/false                     | all | 允许显示网页界面                                                              |
| title  | string  | No | Verdaccio                      | all | HTML 页眉标题说明                                                           |
| logo   | string  | No | http://my.logo.domain/logo.png | all | logo 位于的URI                                                           |
| scope  | string  | No | \\@myscope                   | all | 如果要为特定模块作用域使用此registry，请指定该作用域，在webui指南页眉内设置它（注释：escape @ with \\@) |