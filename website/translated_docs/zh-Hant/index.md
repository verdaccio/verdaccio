---
id: index1
date: 2017-07-10T23:36:56.503Z
title: Docs Home
---
`verdaccio` is a fork of **sinopia** and it's backwards compatible.

## Why should I use verdaccio?

* I am/was **sinopia** user and need an **easy migration**.
* I need a lightweight and free solution 
* I need long-term support and help when I got stuck.
* I want a product compatible with the newer tools as **Yarn** and **DevOps (Docker, Ansible, Puppet, etc)** tools.
* An evolving plugabble product, not only for **Authentification**, also for **Storage** and more in the future.
* An active community 
* Integration with **Nexus**, **Artifactoy** and any other npm compatible registry.

A bunch more of reasons [you might be interested](https://medium.com/@jotadeveloper/five-use-cases-where-a-npm-private-proxy-fits-in-your-workflow-632a81779c14).

### Why we forked from Sinopia? 

It [appeared that sinopia maintenance had stalled and the author had abandoned it](https://github.com/rlidwka/sinopia/issues/376), so there was a suggestion that the sinopia-using community would benefit from a fresh look at the code and the outstanding issues. So here we are The last step about the [detach from sinopia](https://github.com/verdaccio/verdaccio/issues/38).

### Near Future 

`verdaccio` aims to be compatible with sinopia along the time preserving the main features, a lightweight app based on local file system and easy installation but being able to be pluggable and built over a modern tool stack.

## Getting Started

### Installation

* [Installation](/docs/installation)

### Usage

* [Command Line](/docs/cli)

### Configuration

* [The configuration file](/docs/configuration)
* [Setting up *uplinks*](/docs/uplinks)
* [Packages Access](/docs/packages)
* [Authorization and Access](/docs/authentication)
* [Enable Notifications](/docs/notifications)

* [Custom Logs](/docs/logger)

### UI Customization

* [Configure the Web](/docs/webui)

## Server Configurations

* [Advanced Server Configuration](/docs/server)
* [Reverse Proxy](/docs/reverse-proxy)
* [SSL Certificates](/docs/ssl)

### Windows Specific Settings

* [Installing As a Windows Service](/docs/windows)
* [Installing on IIS server](/docs/iis-server)

## Extend Verdaccio

* [Installing Plugins](/docs/plugins)

## DevOps

* [Configure with Ansible](/docs/ansible)
* [Using Docker Image](/docs/docker)
* [Using Kubernetes](/docs/kubernetes)

## Guides && Recipes

* [Learn how to protect your packages](/docs/recipes/protect-your-dependencies)

## Development

* [I want to to contribute](/docs/dev/contributing)
* [Build verdaccio](/docs/dev/build)
* [Create plugins](/docs/dev/plugins)
* [Repositories](/docs/dev/repositories)
* [Unit Testing](/docs/dev/unit-test)