# Verdaccio website

[![backers](https://opencollective.com/verdaccio/tiers/backer/badge.svg?label=Backer&color=brightgreen)](https://opencollective.com/verdaccio)
[![discord](https://img.shields.io/discord/388674437219745793.svg)](http://chat.verdaccio.org/)
[![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)](./LICENSE)

https://www.verdaccio.org

# Documentation

Documentation files are hosted under `/docs` folder.

Install [`pnpm`](https://pnpm.js.org/) globally

```
npm i -g pnpm
```

# Running the website locally
You should run all these tasks from the inner `/website` folder.

The commands you need to use for serving the site locally:
source code.
- `pnpm run start` - Runs Verdaccio documentation site on http://localhost:3000/
- `pnpm run build` - Build the website on build/ folder.

# Running the website as a Docker container

The Verdaccio documentation website can run as a Docker container
(useful for offline usage of the website).

 In order to run the website on Docker, use the following commands (run commands from the outer **/website** folder):

`docker build -t verdaccio-docs:4.0.1 . `- building the Verdaccio documentation site image
`docker run -p <host-port>:3000 verdaccio-docs:4.0.1 `- starting the container, listening on **<host-port>** for your choice.

Saving the image for later offline usage is available by building the container and then using `docker save verdaccio-docs:4.0.1 > <tar-name>.tar` and loading it afterwards with `docker load < <tar-name>.tar `.
> tested on ubuntu 18.04.2 with Docker 18.09.6

# Translation

Verdaccio is powered by [crowdin](https://crowdin.com/project/verdaccio) platform that provides Verdaccio [a free open source license](https://crowdin.com/page/open-source-project-setup-request).

# How to help with translations

1. Create an account at Crowdin [https://crowdin.com/project/verdaccio](https://crowdin.com/project/verdaccio) (It is free)
2. Choose your language
3. Choose a file
4. Suggest a translation

> Crowdin works with 2 sort of roles, Translator and Proofreader. All users are Translator by default. Any suggestion should be approved by a proofreader for each language.

If you want to be a Proofreader send me a private message over *crowdin*.

If you are willing to translate and language is not available, feel free to requested with a ticket.

Privates messages here [https://crowdin.com/profile/juanpicado](https://crowdin.com/profile/juanpicado)


# Search Algolia configuration

Can be modified here: https://github.com/algolia/docsearch-configs/blob/master/configs/verdaccio.json

### Translation stats the last year

![screen shot 2019-02-22 at 6 58 54 am](https://user-images.githubusercontent.com/558752/53222809-60835400-366f-11e9-9edb-f235b3e88c80.png)


