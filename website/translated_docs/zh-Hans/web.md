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
```

All access restrictions defined to [protect your packages](protect-your-dependencies.md) will also apply to the Web Interface.

### Configuration

| Property | Type    | Required | Example                        | Support | Description                        |
| -------- | ------- | -------- | ------------------------------ | ------- | ---------------------------------- |
| enable   | boolean | No       | true/false                     | all     | allow to display the web interface |
| title    | string  | No       | Verdaccio                      | all     | HTML head title description        |
| logo     | string  | No       | http://my.logo.domain/logo.png | all     | a URI where logo is located        |