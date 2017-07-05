# Command Line Interface

The verdaccio CLI is your go start the application. 


## Installation

Please make sure latest Node 4 LTS and NPM 3+ are installed.

Then, install the CLI globally (you may need sudo):

```bash
$ npm install -g verdaccio
```
or if you use `yarn`

```bash
$ yarn add global verdaccio
```

## Commands

```bash
$ verdaccio --listen 4000 --config ./config.yaml
```

Command | Default | Example | Description 
--- | --- | --- | --- 
--listen \ **-l** | 4873 |  -p 7000 | http port
--config \ **-c** | ~/home/user/.local/verdaccio/config.yaml | /foo/bar/config.yaml | the configuration file
