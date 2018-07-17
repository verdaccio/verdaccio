---
id: webui
title: "Interface Web"
---


<p align="center"><img src="https://firebasestorage.googleapis.com/v0/b/jotadeveloper-website.appspot.com/o/verdaccio_long_video2.gif?alt=media&token=4d20cad1-f700-4803-be14-4b641c651b41"></p>

Verdaccio possui uma interface web para exibir os seus pacotes e pode ser customizável.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
```

All access restrictions defined to [protect your packages](protect-your-dependencies.md) will also apply to the Web Interface.

### Configuração

| Nome   | Tipo    | Obrigatório | Exemplo                        | Suporte | Descrição                   |
| ------ | ------- | ----------- | ------------------------------ | ------- | --------------------------- |
| enable | boolean | Não         | true/false                     | all     | habilitar a interface web   |
| title  | string  | Não         | Verdaccio                      | all     | Título da página web        |
| logo   | string  | Não         | http://my.logo.domain/logo.png | all     | URI onde o logo se encontra |