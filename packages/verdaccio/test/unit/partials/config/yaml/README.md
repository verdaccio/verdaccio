# Yaml Configurations

This folder host all sort of configurations for testing. We use `yaml` instead json configuration files for different reasons, maintenability, avoid polute with non use data and contributors can easily understand them.

The files on this folder should be small as possible, **there is a custom config file for all tests (`default.yaml`)** and the following configuration aims to override those part are need it for the test.

## Contribute

- Each topic ideally should have his **own folder** if many scenarios might be part of the test. **eg: profile, security**
  - Include different scenarios inside of the folder with enough context to indenty the use case.
- Foder or file, should be **named** as the test that used them. *eg: `api.spec.yaml` -> `api.spec.ts`*
- **Don't use the same config file in multiple test**, it increase maintenance complexity.
- Try to **include only the props are require for the test**:
- Comment the config files, don't be shy, add as much context you think is need it for future contributors.

> Note: Some configurations might be not aligned with this rules, but in the future all files should be follow them for consistency.
