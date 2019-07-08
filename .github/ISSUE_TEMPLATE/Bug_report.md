---
name: Bug report
about: Create a report to help us improve

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Docker || Kubernetes (please complete the following information):**
 - Docker verdaccio tag: [e.g. verdaccio:beta]
 - Docker commands [e.g. docker pull ...]
 - Docker Version [e.g. v18.05.0-ce-rc1]

**Configuration File (cat ~/.config/verdaccio/config.yaml)**

**Environment information**
Please paste the results of `verdaccio --info` here 

**Debugging output**
 - `$ NODE_DEBUG=request verdaccio` display request calls (verdaccio <--> uplinks)
 - `$ DEBUG=express:* verdaccio` enable extreme verdaccio debug mode (verdaccio api)
 - `$ npm -ddd` prints:
 - `$ npm config get registry` prints:

**Additional context**
Add any other context about the problem here.
