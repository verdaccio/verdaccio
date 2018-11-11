---
id: webui
title: "Interface d'Utilisateur Web"
---


<p align="center"><img src="https://github.com/verdaccio/verdaccio/blob/master/assets/gif/verdaccio_big_30.gif?raw=true"></p>

Verdaccio propose une interface d'utilisateur web pour afficher uniquement les paquets privés et qui peut être personnalisée.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

All access restrictions defined to [protect your packages](protect-your-dependencies.md) will also apply to the Web Interface.

### Configuration

| Property | Type    | Required | Example                        | Support | Description                                                                                                                                          |
| -------- | ------- | -------- | ------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable   | boolean | No       | true/false                     | all     | allow to display the web interface                                                                                                                   |
| title    | string  | No       | Verdaccio                      | all     | HTML head title description                                                                                                                          |
| logo     | string  | No       | http://my.logo.domain/logo.png | all     | a URI where logo is located                                                                                                                          |
| scope    | string  | No       | \\@myscope                   | all     | If you're using this registry for a specific module scope, specify that scope to set it in the webui instructions header (note: escape @ with \\@) |