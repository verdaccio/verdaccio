

`verdaccio` is a fork of **sinopia** and it's backwards compatible.

## Why should I use verdaccio?👌


* I am/was **sinopia** user and need an **easy migration**.
* I need a lightweight and free solution 🎉 to host my private packages and no license worries 🎊.
* I need long-term support and help when I got stuck.
* I want a product compatible with the newer tools as **Yarn** and **DevOps (Docker, Ansible, Puppet, etc)** tools.
* An evolving plugabble product, not only for **Authentification**, also for **Storage** and more in the future.
* An active community 🙋‍♂️🙋.
* Integration with **Nexus**, **Artifactoy** and any other npm compatible registry.

A bunch more of reasons [you might be interested](https://medium.com/@jotadeveloper/five-use-cases-where-a-npm-private-proxy-fits-in-your-workflow-632a81779c14).

### Why we forked from Sinopia? 🚀

It [appeared that sinopia maintenance had stalled and the author had abandoned it](https://github.com/rlidwka/sinopia/issues/376),
so there was a suggestion that the sinopia-using community would benefit
from a fresh look at the code and the outstanding issues. So here we are 🎉🎉🎉.  The last step about the [detach from sinopia](https://github.com/verdaccio/verdaccio/issues/38).

### Near Future 🚧

`verdaccio` aims to be compatible with sinopia along the time preserving the main features, a lightweight app based on local file system and easy installation but being able to be pluggable and built over a modern tool stack.


## Getting Started

### Installation

* [Installation](install.md)

### Usage

* [Command Line](cli.md)

### Configuration

* [The configuration file](config.md)
* [Setting up *uplinks*](uplinks.md)
* [Packages Access](packages.md)
* [Authorization and Access](auth.md)
* [Enable Notifications](notifications.md)

* [Custom Logs](logger.md)

### UI Customization

* [Configure the Web](web.md) 


## Server Configurations

* [Advanced Server Configuration](server.md)
* [Reverse Proxy](reverse-proxy.md)
* [SSL Certificates](ssl.md)

### Windows Specific Settings

* [Installing As a Windows Service](windows.md)
* [Installing on IIS server](iis-server.md)

## Extend Verdaccio
* [Installing Plugins](plugins.md)
* Create your own plugins

## DevOps

* [Configure with Ansible](ansible.md)
* [Using Docker Image](docker.md)

## Verdaccio Recipes

* [Learn how to protect your packages](recipes/protect-your-dependencies.md)

## Development

* [I want to to contribute](dev/README.md)
* [Build verdaccio](dev/build.md)
* [Create plugins](dev/plugins.md)
* [Repositories](dev/repositories.md)
* [Unit Testing](dev/test.md) 
