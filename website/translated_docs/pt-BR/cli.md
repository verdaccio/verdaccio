---
id: cli
title: Utilitário na Linha de Comando
---
A linha de comando é por onde você pode controlar toda a sua instalação Verdaccio.

## Comandos

```bash
$ verdaccio --listen 4000 --config ./config.yaml
```

| Comando            | Padrão                         | Exemplo       | Descrição                 |
| ------------------ | ------------------------------ | ------------- | ------------------------- |
| --listen \ **-l** | 4873                           | -p 7000       | porta http                |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~/config.yaml | o arquivo de configuração |