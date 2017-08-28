# Logger

As any web application, verdaccio has a customisable build-in logger. You can define a multiple types of outputs.

```yaml
logs:
  # console output
  - {type: stdout, format: pretty, level: http}
  # file output
  - {type: file, path: verdaccio.log, level: info}
```

### Configuration

Property | Type | Required | Example | Support | Description 
--- | --- | --- | --- | --- | --- 
type |  string | No | [stdout, file] | all | define the output
path | string | No | verdaccio.log | all | if type is file, define the location of that file 
format | string | No | [pretty, pretty-timestamped] | all | output format
level | string | No | [fatal, error, warn, http, info, debug, trace] | all | verbose level
