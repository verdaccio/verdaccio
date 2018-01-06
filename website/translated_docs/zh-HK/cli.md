---
id: cli
date: 2017-07-10T23:36:56.503Z
title: Command Line Tool
---
The verdaccio CLI is your go start the application.

## Commands

```bash
$ verdaccio --listen 4000 --config ./config.yaml
```

| Command            | Default                                  | Example              | Description            |
| ------------------ | ---------------------------------------- | -------------------- | ---------------------- |
| --listen \ **-l** | 4873                                     | -p 7000              | http port              |
| --config \ **-c** | ~/home/user/.local/verdaccio/config.yaml | /foo/bar/config.yaml | the configuration file |