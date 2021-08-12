---
title: Upgrade from v3.x to verdaccio 4.x with LDAP and Docker
author: Dimitri Kopriwa
authorURL: https://twitter.com/DimitriKopriwa
authorImageURL: https://avatars1.githubusercontent.com/u/1866564?s=460&v=4
authorTwitter: DimitriKopriwa
---

I am Dimitri and I am a user and contributor of Verdaccio.

Today, I will explain how I migrated my private dockerized <img height="16px" src="https://github.githubassets.com/images/icons/emoji/unicode/1f433.png" title="docker" /> Verdaccio registry from `v3.x` to `v4.x`.

I will also configure [`verdaccio-ldap`](https://www.npmjs.com/package/verdaccio-ldap) to authenticate my users against LDAP.

[Working demo here](https://github.com/verdaccio/verdaccio/tree/5.x/docker-examples/ldap-verdaccio-v4)

<!--truncate-->

First of all, I wante to congratulate everyone who tested, contributed to Verdaccio <img height="16px" src="https://github.githubassets.com/images/icons/emoji/unicode/1f389.png" title="congrats" /> v4 <img height="16px" src="https://github.githubassets.com/images/icons/emoji/unicode/1f388.png" title="congrats" />.

V4 include bunch of improvment, optimization, starting with the Web UI made completely redesigned with ReactJS and MaterialUI.

Not only that security has been improved with the introduction of the optional `JWT`, but `v4` also bring a new feature to `unpublish` packages.

Let's upgrade it!

## Prerequisite {#prerequisite}

- Read [verdaccio documentation](https://verdaccio.org/docs/en/installation).
- Read [verdaccio-ldap documentation](https://www.npmjs.com/package/verdaccio-ldap).
- A backup of your v3 `storage` directory (just in case).
- A running LDAP database (such as OpenLDAP).
- [Docker installed](https://docs.docker.com/v17.09/engine/installation/).

## Goal {#goal}

- Update Verdaccio from `v3.x` to `v4.x.`
- Configure LDAP.
- Configure JWT. ([Read more](https://medium.com/verdaccio/diving-into-jwt-support-for-verdaccio-4-88df2cf23ddc))

## Dockerfile {#dockerfile}

This is my tree structure:

```
├── conf
│   └── config.yaml
└── Dockerfile
```

First thing I had to do was to update my `Dockerfile`, this is what I have done:

```Dockerfile
FROM verdaccio/verdaccio:4.3
USER root
RUN npm i && npm i verdaccio-ldap
COPY conf /verdaccio/conf
RUN chown -R $VERDACCIO_USER_UID /verdaccio
USER verdaccio
```

- `v3.x` is now using by default `verdaccio` user for security reason. This is why need to switch to `root` user to use `npm`.
- We install `verdaccio-ldap` but you can install any plugin. _(Only if you don't want the `verdaccio-htaccess` builtin solution to be your user database)_
- Later, you **MUST** solve the `storage` directory **permissions** and **ownership**.

## Configuration {#configuration}

This is my `config.yaml`:

```yaml
storage: /verdaccio/storage
max_body_size: 100mb

web:
  enable: true
  title: My private NPM registry
  gravatar: true
  sort_packages: asc

security:
  legacy: false
  api:
    jwt:
      sign:
        expiresIn: 30d
        notBefore: 0
  web:
    sign:
      expiresIn: 7d
      notBefore: 1

auth:
  ldap:
    type: ldap
    client_options:
      url: "ldap://ldap.verdaccio.private.rocks"
      # Only required if you need auth to bind
      adminDn: "cn=readonly,dc=verdaccio.private,dc=rocks"
      adminPassword: "********"
      # Search base for users
      searchBase: "dc=verdaccio.private,dc=rocks"
      searchFilter: "(&(uid={{username}})(memberOf=cn=npm_users,ou=npm,ou=groups,ou=developers,dc=verdaccio.private,dc=rocks))"
      # # If you are using groups, this is also needed
      groupDnProperty: "cn"
      groupSearchBase: "ou=npm,ou=groups,ou=developers,dc=verdaccio.private,dc=rocks"
      # If you have memberOf support on your ldap
      searchAttributes: ["*", "memberOf"]
      # Else, if you don't (use one or the other):
      # groupSearchFilter: '(memberUid={{dn}})'
      #
      # Optional, default false.
      # If true, then up to 100 credentials at a time will be cached for 5 minutes.
      cache: false
      # Optional
      reconnect: true

# a list of other known repositories we can talk to
uplinks:
  npmjs:
    url: https://registry.npmjs.org/

packages:
  "@scope-*/*":
    # scoped packages
    access: npm_access
    publish: npm_publisher
    unpublish: npm_publisher

  "@scope/*":
    # scoped packages
    access: npm_access
    publish: npm_publisher
    unpublish: npm_publisher

  "@*/*":
    # scoped packages
    access: $all
    publish: $authenticated
    proxy: npmjs
  "**":
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    #
    # you can specify usernames/groupnames (depending on your auth plugin)
    # and three keywords: "$all", "$anonymous", "$authenticated"
    access: $all

    # allow all known users to publish packages
    # (anyone can register by default, remember?)
    publish: $authenticated

    # if package is not available locally, proxy requests to 'npmjs' registry
    proxy: npmjs

# log settings
logs:
  - { type: stdout, format: pretty, level: trace }
#  - {type: file, path: verdaccio.log, level: info}

listen:
  - 0.0.0.0:4873
```

Available options are explained in details in [Configuration File documentation](https://verdaccio.org/docs/en/configuration).

I will describe the most important here.

### LDAP {#ldap}

We use [`verdacio-ldap`](https://www.npmjs.com/package/verdaccio-ldap) plugin to authenticate with LDAP.

**`searchFilter`**

I use the `memberOf` overlay, and this LDAP query will allow to connect only users present in a defined LDAP group.

If you are not using the `memberOf` overlay, you can allow all users to login as follow:

```yaml
searchFilter: "(&(uid={{username}}))"
```

**`groupSearchBase`**

I use an organization unit to store all my group for verdaccio-ldap security.

```yaml
groupSearchBase: "ou=npm,ou=groups,ou=developers,dc=verdaccio.private,dc=rocks"
```

### Security {#security}

**`packages`**

You SHOULD use scope for all your privates packages, in this scenario, we use LDAP groups for `access`, `publish` and `unpublish`.

Note that we do not use `proxy: npmjs` because they only exist on our private registry.

I recommend you to create scope for all of your private packages, and reserve the group on npmjs registry so no one will be able to publish publicly in it in the futur.

```yaml
"@scope-*/*":
  access: npm_access
  publish: npm_publisher
  unpublish: npm_publisher

"@scope/*":
  # scoped packages
  access: npm_access
  publish: npm_publisher
  unpublish: npm_publisher
```

They are some public package on npmjs registry which are scoped, this will proxy all the request to npmjs registry.

I recommend not to change this, otherwise you might get issue to download them.

```yaml
"@*/*":
  # scoped packages
  access: $all
  publish: $authenticated
  proxy: npmjs
```

For all other packages, to prevent anyone to use our registry, we just allow `$authenticated` to publish.
We also use `proxy: npmjs` so we also serve all the public package on npmjs registry.

We allow `$all` to download from our registry, because it is public, but if you want to preserve your bandwidth or just forbid unknown user to authenticate, just use `$authenticated` as well.

```yaml
"**":
  access: $all
  publish: $authenticated
  proxy: npmjs
```

**`security`**

You should (and I recommend it) use `JWT` security, otherwise your LDAP server will received an authentication request for each request.

If you don't mind, you can keep `legacy: true`.

If you do use the JWT authentication, then **all your users** will have to re-authenticate with `npm adduser`.

```yaml
security:
  legacy: false
  api:
    jwt:
      sign:
        expiresIn: 30d
        notBefore: 0
  web:
    sign:
      expiresIn: 7d
      notBefore: 0
```

- `expiresIn`: You will have to reauthenticate after `30 days`, and `7 days` on the web UI.
- `notBefore`: Just set it to `0`, it is the time to wait before the JWT starts it's validity.

## Build the image {#build-the-image}

Use [`docker build`](https://docs.docker.com/engine/reference/commandline/build/) to build the new image.

- `-t` will give the name `verdaccio-3-ldap` to the new image
- `.` means that the Dockerfile is in the current working directory.

```bash
$ docker build -t verdaccio-3-ldap .

Sending build context to Docker daemon  14.34kB
Step 1/7 : FROM verdaccio/verdaccio:4.3
4.3: Pulling from verdaccio/verdaccio
e7c96db7181b: Already exists
50958466d97a: Already exists
56174ae7ed1d: Already exists
284842a36c0d: Already exists
38829697cf41: Pull complete
67d4be407dc1: Pull complete
75921a7a709e: Pull complete
27621c093247: Pull complete
b5dd63eea3d5: Pull complete
3d5fd2ab9d4d: Pull complete
Digest: sha256:2a79d82601596f1889f2fe99d397c8900bf473c6682624cc0c37288896617e99
Status: Downloaded newer image for verdaccio/verdaccio:4.3
 ---> 03eefd251eef
# etc...
Step 7/7 : USER verdaccio
 ---> Running in 2426b01499b8
Removing intermediate container 2426b01499b8
 ---> 5e36f29f5374
Successfully built 5e36f29f5374
Successfully tagged verdaccio-3-ldap:latest
```

Your image is ready, you can push it to your private docker registry, or on Docker Hub if you can host private images.

Do not publish it publicly unless you remove all your LDAP credentials in the configuration.

To do so, remove the `config.yaml` within the `Dockerfile`:

```diff
FROM verdaccio/verdaccio:4.3
USER root
RUN npm i && npm i verdaccio-ldap
- COPY conf /verdaccio/conf
RUN chown -R $VERDACCIO_USER_UID /verdaccio
USER verdaccio
```

And mount the configuration on startup with a volume:

```bash
docker run -v $(pwd)/config.yaml:/verdaccio/conf/config.yaml verdaccio-3-ldap
```

## Run the service {#run-the-service}

You will have to mount the `storage` volume when using `Docker`, to do that, just use `-v` with `docker run` command:

```bash
docker run -v /srv/verdaccio/storage:/verdaccio/storage verdaccio-3-ldap
```

Remember, you have made a backup of your storage directory, now let's fix `permissions` and `ownership` to finish verdaccio migration.

Because within the docker container, the user is `verdaccio`, you can't run `chown` and `chmod` commands. Just do it directly from your host as `root`:

```bash
cd /srv/verdaccio/ # the location depend of your installation
chmod -R 777 storage
VERDACCIO_USER_UID=10001 # unless you have changed it
chown -R $VERDACCIO_USER_UID storage
```

## Test the service {#test-the-service}

First, fill appropriate LDAP group for all your LDAP users that should have access to the private npm registry.

> We call `$IP` the IP address of the server. If you serve it over `https` behind a reverse proxy or directly, then fix all the following command to use the right protocol.

This is all the test I have done while configurating verdaccio, before going to production:

### plugin {#plugin}

- `[x]` it should work with `verdaccio-htaccess` when `verdaccio-ldap` is **not** installed. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` it should work with `verdaccio-htaccess` when `auth.ldap` is disabled and `verdaccio-ldap` is installed. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` it should work with one `verdaccio-ldap`. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` it should work with `verdaccio-htaccess` and fallback to `verdaccio-ldap` through **web**. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` it should work with `verdaccio-htaccess` and fallback to `verdaccio-ldap` through **npm**. <img src="https://github.githubassets.com/images/icons/emoji/unicode/274c.png" title="NOK" name="NOK" height="16px" /> _Either use `verdaccio-htaccess` or `verdaccio-ldap`, it is useless to use both, even if the web work with the two, the `npm --add-user` command will fail._

### `npm` {#npm}

- `[x]` `npm --adduser` should work with different users. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `npm --adduser` should fail with wrong user/password. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` it should auth with JWT and the `verdaccio-ldap` plugin. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` it should auth with legacy and the `verdaccio-ldap` plugin. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `npm i` in CI that download from the registry **should spam** the LDAP with authentication requests with legaxy. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `npm i` in CI that download from the registry should not spam the LDAP with authentication requests with JWT. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />

### Web {#web}

The new design with material-UI is super nice btw.

- `[x]` it should authenticate with different users. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` it should fail to authenticate with different users and wrong password. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` it should show packages to users with `access` permissions. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` it should hide packages to users without `access` permissions. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />

### Packages permissions {#packages-permissions}

- `[x]` `access` should work with a user with perms. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `access` should fail with a user without perms.. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `access` should work with a user in ldap group with perms. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `access` should fail with a user not in ldap group with perms. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `publish` should work with a user with perms. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `publish` should work with a user in ldap group with perms. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `publish` should fail with a user not in ldap group without perms. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `unpublish` should work with a user with perms. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `unpublish` should fail with a user without perms. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `unpublish` should work with a ldap group with perms. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />
- `[x]` `unpublish` should fail with a user not in ldap group with perms. <img src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png" title="OK" name="OK" height="16px" />

### Web {#web-1}

- Test the web interface, generally `http://$IP:4873` if you are not using a reverse proxy.

After login, you won't be able to see private scopped package if you don't have the `access` group.

### npm {#npm-1}

Because we use the JWT, you must re-authenticate, this is how we do:

```bash
npm adduser --registry http://$IP --always-auth
```

If you want to use it just for a specific scope:

```bash
npm set @scope:registry http://$IP
```

If you want to use it as your default proxy for npm:

```bash
npm set registry http://$IP
```

## Conclusion and thanks {#conclusion-and-thanks}

Docker, LDAP are a great way to authenticate users from your organization. In this article, you have learned how to setup verdaccion with LDAP and Docker.

I have to thank the teams and community behind verdaccio projects, specially [Juan Picado](https://twitter.com/jotadeveloper), [Daniel Refde](https://twitter.com/DanielRufde) and [Sergio Hg](https://github.com/sergiohgz) for their help on the GitHub issues and the discord [chat](http://chat.verdaccio.org/).

Also, but not less important, I want to thank all the people that makes Verdaccio possible, contributing, donating, documenting, and more.

I hope it is well explained and you people of verdaccio are able to reproduce a configuration that fit with your LDAP.

To me it took a while to figure out the different errors I had and the most annoying things was those manual step to fix the permissions and access.

If you have any question, please check at the FAQ below, or feel free to reply to this blog post.

> If you 😍 Verdaccio as I do, helps them to grow by donating to the project via [OpenCollective](https://opencollective.com/verdaccio).

Thanks for reading and long life to Verdaccio !

## FAQ {#faq}

- Can we use two authentication plugin together such as `verdaccio-htaccess`?

No you can't, but pull request are welcome.

- Does my registry users need to re-authenticate?

If you use `JWT` for authentication, which I recommend, they will all have to re-authenticate.

- I have `404` or `401` errors with good credentials.

This is due to wrong permissions or ownership in `storage` directory, dont forget to `chmod -R 777 /verdaccio/storage` and `chown -R $VERDACCIO_USER_UID /verdaccio`.

- When should I use `--always-auth` when running `--add-user`?

If you keep having `403` issues when retrieving packages from the registry, and permissions and ownership have been fixed, we have found that adding `--always-auth` will solve the issue.

In my case, I have found that `--always-auth` was required in my production environment.
