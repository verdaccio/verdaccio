---
id: cli
title: Command Line Tool
---
The verdaccio CLI is your go start the application.

## Commands

```bash
$ verdaccio --listen 4000 --config ./config.yaml
```

| Command            | Default                        | Example       | Description            |
| ------------------ | ------------------------------ | ------------- | ---------------------- |
| --listen \ **-l** | 4873                           | -p 7000       | http port              |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~/config.yaml | the configuration file |