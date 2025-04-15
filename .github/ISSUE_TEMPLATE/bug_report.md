---
name: Bug report 🐛
about: A feature is not working as is expected, I want to report a bug
labels: 'issue: needs triage'
title: ''
assignees: ''
---

<!-- PLEASE READ THIS:  
 - If you are not sure is a bug, OPEN a DISCUSSION, if is a legitimate bug, is easy to create a bug from a discussion.
 - Empty reports won't be considered and eventually be closed by a bot.
 - Include debugging notes will help to fix it faster, HOW TO: https://github.com/verdaccio/verdaccio/wiki/Debugging-Verdaccio 
 - If you remove this template, ticket will be closed immediately.
 - No English perfect is required, use public translators if is need it, we will do our best to help you.
 - Extra bonus: The most complete this report is delivered, the faster you will get a response.
 - Extra bonus: include screenshots, logs (remove sensitive data).
 - If you are willing to fix it, there is a checkbox at the bottom.
-->

**Your environment**

<!-- bugs below the version 6.x will be closed, see SECURITY.md and VERSIONS.md for more details -->
<!-- Please paste the results of running `verdaccio --version` --> 
* **verdaccio version**: 6.x.x

<!-- Please paste the results of running `verdaccio --info` --> 
* **node version** [20.x.x, 22.x.x]:
* **package manager**: [npm@10.x.x, pnpm@10.x.x, yarn@2.x.x]
* **os**: [mac, windows@11, linux]
* **platform**: [node, docker, helm, other]

**Describe the bug**

<!-- A clear and concise description of what the bug is. -->

**Steps to reproduce**

<!-- IMPORTANT:
Add step-by-step instructions on how to reproduce the bug.
Be aware, the lack of reproducible steps the issue might cause your ticket to be closed.
-->

**Expected behavior**

<!-- A clear and concise description of what you expected to happen. -->

**Screenshots, Verdaccio server log, package manager log**

<!-- If applicable, add screenshots to help explain your problem. -->

**Configuration file**

<!-- cat ~/.config/verdaccio/config.yaml -->
<!-- Please be careful do not leak any sensitive information, remove usernames and tokens -->

**Debugging output**

- `$ NODE_DEBUG=request verdaccio` display request calls (verdaccio <--> uplinks)
- `$ DEBUG=verdaccio* verdaccio` enable extreme verdaccio debug mode (verdaccio api)
- `$ npm -ddd` prints:
- `$ npm config get registry` prints:

**Contribute to Verdaccio**

- [ ] I'm willing to fix this bug 🥇 

<!--
IMPORTANT: please do not attach external files, all content should be visible from any device.
-->
