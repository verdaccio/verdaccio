---
name: Bug report
about: Create a report to help us improve
---

<!-- 
Hi folk, please read carefully the following points, all this information is what you need to share and make the process efficient
so eveyrbody can understand your issue, please notice if you don't fill any of this points our friendly boot will remind you to do it or
close automatically the issue. Removing the sections you considere are irrelevant for your issue is totally ok. 

If you have questions, you might rather join use over Discord https://chat.verdaccio.org

As reminder, we have code of conduct all of us we must follow https://github.com/verdaccio/verdaccio/blob/master/CODE_OF_CONDUCT.md 
-->

**Describe the bug**
<!-- A clear and concise description of what the bug is. -->

**To Reproduce**
<!-- How to reproduce the issue -->

Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
<!-- A clear and concise description of what you expected to happen. -->

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Docker || Kubernetes (please complete the following information):**
 - Docker verdaccio tag: [e.g. verdaccio:4.x]
 - Docker commands [e.g. docker pull ...]
 - Docker Version [e.g. v18.05.0-ce-rc1]

**Configuration File (cat ~/.config/verdaccio/config.yaml)**

<!-- Please be careful do not leak any sensitive information, remove tokens -->

**Environment information**

<!-- 
  Please paste the results of `verdaccio --info` here (only if you are using >4.0.0). 
  Share, Node.js, node package manager used (npm, yarn or pnpm) and the version.
  The verdaccio version is really important, run `verdaccio --version` if you don't know it.
-->

**Debugging output**
<!-- If you are contributing and need to share internal stuff, here some useful commands to get more verbose output -->

 - `$ NODE_DEBUG=request verdaccio` display request calls (verdaccio <--> uplinks)
 - `$ DEBUG=express:* verdaccio` enable extreme verdaccio debug mode (verdaccio api)
 - `$ npm -ddd` prints:
 - `$ npm config get registry` prints:

**Additional context**

<!-- 

If there is something else to share, screenshots, log files, or link references to other tickets.
IMPORTANT: please do not attach log files, rather copy the content so is indexable for future search.
-->

