---
name: Bug report 🐛
about: A feature is not working as is expected, I want to report a bug
labels: 'issue: needs triage'
title: ''
assignees: ''
---

**Describe the bug**

<!-- A clear and concise description of what the bug is. -->

**To Reproduce**

<!-- IMPORTANT:
 - How to reproduce the issue
 - Steps to reproduce the issue

Be aware, the lack of reproducible steps the issue might cause your ticket to be closed.
-->

**Expected behavior**

<!-- A clear and concise description of what you expected to happen. -->

**Screenshots**

<!-- If applicable, add screenshots to help explain your problem.  -->

**Configuration File (cat ~/.config/verdaccio/config.yaml)**

<!-- Please be careful do not leak any sensitive information, remove tokens -->

**Environment information**

<!-- Please paste the results of running `verdaccio --info` -->

**Debugging output**

- `$ NODE_DEBUG=request verdaccio` display request calls (verdaccio <--> uplinks)
- `$ DEBUG=express:* verdaccio` enable extreme verdaccio debug mode (verdaccio api)
- `$ npm -ddd` prints:
- `$ npm config get registry` prints:

<!--

IMPORTANT: please do not attach external files, all content should be visible from any device.
-->
