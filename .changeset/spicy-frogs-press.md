---
'verdaccio-htpasswd': major
---

feat: allow other password hashing algorithms (#1917)

**breaking change**

The current implementation of the `htpasswd` module supports multiple hash formats on verify, but only `crypt` on sign in.
`crypt` is an insecure old format, so to improve the security of the new `verdaccio` release we introduce the support of multiple hash algorithms on sign in step.

### New hashing algorithms

The new possible hash algorithms to use are `bcrypt`, `md5`, `sha1`. `bcrypt` is chosen as a default, because of its customizable complexity and overall reliability. You can read more about them [here](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html).

Two new properties are added to `auth` section in the configuration file:

- `algorithm` to choose the way you want to hash passwords.
- `rounds` is used to determine `bcrypt` complexity. So one can improve security according to increasing computational power.

Example of the new `auth` config file section:

```yaml
auth:
htpasswd:
  file: ./htpasswd
  max_users: 1000
  # Hash algorithm, possible options are: "bcrypt", "md5", "sha1", "crypt".
  algorithm: bcrypt
  # Rounds number for "bcrypt", will be ignored for other algorithms.
  rounds: 10
```
