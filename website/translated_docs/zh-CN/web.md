---
id: webui
title: "Web User Interface"
---


<p align="center"><img src="https://github.com/verdaccio/verdaccio/blob/master/assets/gif/verdaccio_big_30.gif?raw=true"></p>

Verdaccio 有可定制的 Web 界面用于管理私有包

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

所有访问限制设置可以参考 [保护包](protect-your-dependencies.md) 页面，这些规则也将应用于 Web 界面。

### 配置

| 属性     | 类型      | 必填 | 示例                             | 支持  | 描述                                                                    |
| ------ | ------- | -- | ------------------------------ | --- | --------------------------------------------------------------------- |
| enable | boolean | No | true/false                     | all | 允许显示网页界面                                                              |
| title  | string  | No | Verdaccio                      | all | HTML 页眉标题说明                                                           |
| logo   | string  | No | http://my.logo.domain/logo.png | all | logo 位于的URI                                                           |
| scope  | string  | No | \\@myscope                   | all | 如果要为特定模块作用域使用此registry，请指定该作用域，在webui指南页眉内设置它（注释：escape @ with \\@) |