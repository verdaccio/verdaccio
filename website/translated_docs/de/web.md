---
id: webui
title: "Web User Interface"
---


<p align="center"><img src="https://firebasestorage.googleapis.com/v0/b/jotadeveloper-website.appspot.com/o/verdaccio_long_video2.gif?alt=media&token=4d20cad1-f700-4803-be14-4b641c651b41"></p>

Verdaccio has a web user interface to display only the private packges and can be customisable.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

### Configuration

| Property | Type    | Required | Example                        | Support | Description                        |
| -------- | ------- | -------- | ------------------------------ | ------- | ---------------------------------- |
| enable   | boolean | No       | true/false                     | all     | allow to display the web interface |
| title    | string  | No       | $authenticated                 | all     | HTML head title description        |
| logo     | string  | No       | http://my.logo.domain/logo.png | all     | a URI where logo is located        |
| scope    | string  | No       | \\@myscopy                     | all     | If you're using this registry for a specific module scope, specify that scope to set it in the webui instructions header (note: escape @ with \\@) |
