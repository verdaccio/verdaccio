# Contributing

First of all 👏👏 thanks for visiting this page, for us means you are willing contribute to `verdaccio` and we are happy for that. Jumping into an unfamiliar code base is not easy but we are here to help you.

## Comunication Channels

If you are willing for asking, we use two channels for discussions:

* [Public Gitter channel](https://gitter.im/verdaccio/)
* [Contributors Slack channel](https://verdaccio-npm.slack.com) (unfortunately only by email invitation, you might ask in Gitter to be included)

## Getting started

As a first glance verdaccio is a single repository, but there are many ways you might contribute and a variety of technologies to practice.

### Finding my spot

All we have different skills, so, let's see where you might feel comfortable.

#### I know or I want to learn Node.js 

Node.js is the base of `verdaccio`, we use libraries as `express`, `commander`, `request` or `async`. Verdaccio is basically a Rest API that create a communication with `npm` clients compatible, as `yarn`. 

We have a long [list of plugins](https://github.com/verdaccio/verdaccio/blob/master/wiki/plugins.md) ready to be used and improved but at the same time [you might create your own](plugin.md).

#### I would prefer to work in the User Interface

Recently we have moved to modern techonologies as `React` and `element-react`.  

#### I feel more confortable improving the stack

Of course, we will be happy to help us improving the stack, you can upgrade dependencies as `eslint`, `stylelint`, `webpack`. You migt merely improve the `webpack` configuration would be great. Any suggestion is very welcome. Furthermore whether you have experience with **Yeoman** you might help us with the [verdaccio generator](https://github.com/verdaccio/generator-verdaccio-plugin).

Here some ideas:

* Create a common eslint rules to be used across all dependencies or plugins
* Improve Flow types definitions delivery
* Moving to Webpack 4
* Update to React 16
* Improve hot reload with Webpack
* We use babel and webpack across all dependencies, why not a common preset?

#### I do great Documentation

Many contributors find typos and grammar issues, that also helps to improve the overall experience for troubleshooting.

#### I am a Designer

We have a frontend website [http://www.verdaccio.org/](http://www.verdaccio.org/) that will be happy to see your ideas.

#### I am a DevOps

We have a widely popular Docker image [https://hub.docker.com/r/verdaccio/verdaccio/](https://hub.docker.com/r/verdaccio/verdaccio/) that need maintenance and pretty likely huge improvements, we need your knowledge for the benefits of all users.

We have support for **Puppet**, **Ansible** and **Cheff** and we need help in those fields, feel free to see all repositories.

## I'm ready to contribute

If you are thinking *"I've seen already the [repositories](repositories.md) and I'm willing to start right away"*  then I have good news for you, that's the next step.

You will need learn how to build, [we have prepared a guide just for that](build.md).

Once you have played around with all scripts and you know how to use them, we are ready to go to the next step, run the [**Unit Test**](test.md).


