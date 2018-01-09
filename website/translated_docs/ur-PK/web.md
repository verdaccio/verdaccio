---
id: webui
title: Web User Interface
---
Verdaccio has a web user interface to display only the private packges and can be customisable.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
```

### Configuration

| Property | Type    | Required | Example                        | Support | Description                        |
| -------- | ------- | -------- | ------------------------------ | ------- | ---------------------------------- |
| enable   | boolean | No       | true/false                     | all     | allow to display the web interface |
| title    | string  | No       | $authenticated                 | all     | HTML head title description        |
| logo     | string  | No       | http://my.logo.domain/logo.png | all     | a URI where logo is located        |