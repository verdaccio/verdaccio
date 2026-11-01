# Security Policy

## Supported versions

| Line          | Status                       | Security fixes                                                               |
| ------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| 7.x           | current stable (`latest`)    | yes, expedited releases                                                      |
| 6.x           | maintenance                  | security fixes only, for 8 months after the 7.0.0 release (until 2027-06-25) |
| 9.x           | next (`next-9`, pre-release) | yes: 7.x runs the 9.x modules, so a fix for one is a fix for both            |
| 5.x and older | deprecated                   | no                                                                           |

The full table, including Node.js, npm tags and Docker images per line, is in the [version history](https://github.com/verdaccio/verdaccio/blob/master/VERSIONS.md).

If you are running Verdaccio in production, please use the latest supported stable version listed in [VERSIONS.md](https://github.com/verdaccio/verdaccio/blob/master/VERSIONS.md).

## Responsible disclosure security policy

A responsible disclosure policy helps protect users of the project from publicly disclosed security vulnerabilities without a fix by employing a process where vulnerabilities are first triaged in a private manner, and only publicly disclosed after a reasonable time period that allows patching the vulnerability and provides an upgrade path for users.

We will do our best efforts to respond to a private report in a reasonable time and to resolve the issue. Public disclosure happens when the advisory is published, together with the fixed release.

We kindly ask you to refrain from malicious acts that put our users, the project, or any of the project’s team members at risk.

## Reporting a security issue

> Please do not open a public issue, pull request or discussion to report a security vulnerability.

At Verdaccio, we consider the security of our systems a top priority. But no matter how much effort we put into system security, there can still be vulnerabilities present.

All security vulnerabilities must be reported privately through **GitHub Security Advisories**:

- Open a report at [Report a vulnerability](https://github.com/verdaccio/verdaccio/security/advisories/new). GitHub keeps the report private between you and the maintainers until an advisory is published.
- Include reproduction steps, the affected versions and any logs or stack traces inline as text. If the report targets a different repository of the [verdaccio organization](https://github.com/verdaccio), use that repository's **Security** tab instead.
- Reports sent by email to verdaccio@pm.me are read, but they are not handled over email: the maintainers will redirect you to open the report on GitHub, and the triage and the fix happen in the advisory. If you must send details by email, encrypt them with our [PGP key](https://cdn.verdaccio.dev/gpg/publickey.verdaccio@pm.me.asc), which is also available in this document.

### CVE identifiers

CVEs for Verdaccio are requested through the GitHub Security Advisory (GHSA) once the advisory is ready to be published; GitHub is a CVE Numbering Authority and assigns the identifier. Whether a CVE is assigned, and which one, is decided by GitHub, not by the maintainers, so please do not ask us for a CVE for a report that has not gone through an advisory.

Your efforts to responsibly disclose your findings are sincerely appreciated. **There isn't a security bounty program available**, but any security contributions will be duly acknowledged in the published advisory.

## PGP key

The following is this project’s PGP key, to be used to encrypt any sensitive information shared over an unsecured medium such as e-mail:

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.5.1
Comment: https://openpgpjs.org

xsBNBFzm3asBCACxnJDv1r6dxiM2e8iqS6B7fxY2I3X1Rc+3m8mhXOwVwRG4
AOrQ417oSzsVLf4iocg+DWrtxzY79odTLJEovVt79rxwqIIl4y96tH+29kLB
ao7eaYZacfstonVkBAmxBLaYv1x7cqWuukm6sBCOxapW1X9BcbR3vOghDziY
/1AwNjupAOPvKNMtghjrdh3w0iMfZS1hw28zjM1oCeezEil+CTjgQDN+69qS
UFG/BInJ7CVn9TvhU85inSwpxVa576fkhvFoNUrGvFvYRWtXRJndbRdBodVj
C9At/Gb2IeNf7xqXH2KloZ1yaVNVSzLX4jqrMWeF+9Z12SjUyL6G9TwDABEB
AAHNIXZlcmRhY2Npb0BwbS5tZSA8dmVyZGFjY2lvQHBtLm1lPsLAdQQQAQgA
HwUCXObdqwYLCQcIAwIEFQgKAgMWAgECGQECGwMCHgEACgkQpSvoGbwFJYhn
2wf+JF+yLQXh1EFMih6lpbx243hvglgOWmcigYVRh5mSfULcdW2pmkPQXqhE
DW73qqwN9G9piiPnGMw7sKoB7XJVuFKyvHOYKtem5UQVRvs2rTxnSc5qFcUJ
0w3Tw/pZ9B3fYAEYti2B/GsSOzaECfBKCFOg15xXGAdwfgff5FsorN1Gb6MG
eCO9c8faSF/+fQUCfokwMDVzxXQFZEMx3q/rHVJ/Fm+XelZ+00c9fdyiuPW5
dM9gATle7lz0iPtxaUDGLW8QZ/7b6O8IJ1kle0tL4AE++bXsVWxNdzhlNohH
Hn09sIdFnG4ySTz4YJjiDd70ZdQjOGEGvutymEIN1xcNq87ATQRc5t2rAQgA
yX2ZhUCtrz7lzK0992yveB+duVF//yo9Pei2ra9Z3GNmA+oWlRH1FTWpAmVH
uDdUchTnxAwaKntabt3Mb1AgEZwrdiG4LuHFbdx2ls93BJ5lXdp7vB6pVf3N
IrhHKyQ/Y5L5kMSj/GjrhO19zmj6mPPEgb3M3ZIZjQUF4pro0pExuAPA9Wxe
awn5+0BUYFs4mZQDtTdiVuz5tWA0fNtt1aBfOPA97tmn18y4b1b0iQIJQpep
BVVnFLeAZOevDcBJFbmQOdAjufWSSgpzX+FZ3rx6RVwwKxUiVQyUuwSQkKh5
RufZ5zE0y7Fe/YlWXbKoj4zNJqYtjPSPngQRWf7UpwARAQABwsBfBBgBCAAJ
BQJc5t2rAhsMAAoJEKUr6Bm8BSWIoYQH+QDw0Z84tZK4N1lh49hYyohs6vNU
9kG69nKLQA5NymPtTxh8YOJhdJL697FkvKI4OGEO2FXUmcJS3CBJ2nBVKMq2
1biDRKC4OhIU2RgFhS6bHy6VOn24EYs77T+zX8YXpz8ulYVln2b0QZCubN0Z
L50tEC8HnuVMVN+/pqITdD3FjzwGZgHdW8qkKgD6qhObHCl8/cW2buCsaIAY
eZWVPgPY1S1U0V608qYNtUCkrmUW5Sl6YLvz7JTvTsaym5mzyFXF3ErAURgI
/v4XaWmRgNGIxbIxsFGuEs+KIKBQDJmtvJCVpBNS5IYnFf5h/LA5cfkwMKJt
wXhyE0b/iDs60ZM=
=QWXs
-----END PGP PUBLIC KEY BLOCK-----
```
