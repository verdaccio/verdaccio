# @verdaccio/e2e-cli

## 2.0.0-6-next.1

### Major Changes

- 82cb0f2b: feat!: config.logs throw an error, logging config not longer accept array or logs property

  ### 💥 Breaking change

  This is valid

  ```yaml
  log: { type: stdout, format: pretty, level: http }
  ```

  This is invalid

  ```yaml
  logs: { type: stdout, format: pretty, level: http }
  ```

  or

  ```yaml
  logs:
    - [{ type: stdout, format: pretty, level: http }]
  ```

## 1.0.1-alpha.0

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr
