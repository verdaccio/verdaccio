---
id: plugin-generator
title: "Plugin Generator"
---

## Installing the Yeoman Generator {#installing-the-yeoman-generator}

Verdaccio is a pluggable application, with the objective to help developers to generate new plugins, we have a custom generator based in **[Yeoman](https://yeoman.io/)** for generate all sort of plugins.

To install the generator, as first step you must install the *yeoman* command `yo`.

```bash
npm install -g yo
```

then, install the custom generator running the following in your terminal.

```
npm i -g generator-verdaccio-plugin
```

## Using the generator {#using-the-generator}

Use `yeoman` is quite straighforward, you can read more infomation about it [here](https://yeoman.io/learning/index.html).

After a success install, run `yo verdaccio-plugin` in your terminal and follow the steps.

```
➜ yo verdaccio-plugin

Just found a `.yo-rc.json` in a parent directory.
Setting the project root at: /Users/user/verdaccio_yo_generator

     _-----_     ╭──────────────────────────╮
    |       |    │        Welcome to        │
    |--(o)--|    │ generator-verdaccio-plug │
   `---------´   │   in plugin generator!   │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? What is the name of your plugin? (customname)
```

### Best practices {#best-practices}

- We recommend using **Typescript** for developing new plugins, we provide an extense support of Types which help you along the development.

```
? What is the name of your plugin? my-plugin
? Select Language (Use arrow keys)
❯ typescript
  javascript
```

- On describe your plugin, be brief and explicit, remember a good description will increase your chances your pluing to be used.

```
? Please, describe your plugin (An amazing verdaccio plugin)
```

- Don't hesitate to include meaningful keywords, as `verdaccio`, `plugin` or your plugin type. Good keywords will help us to find you and future improvement in our collect information about all plugins.
```
? Key your keywords (comma to split) verdaccio,plugin,storage,minio,verdaccio-plugin
```

- Keep your generator **updated**, don't miss any bug-fixes and performance improvements.


### Contributing {#contributing}

Help us to improve the generator, you can contribute in the following repository.

[https://github.com/verdaccio/generator-verdaccio-plugin](https://github.com/verdaccio/generator-verdaccio-plugin)