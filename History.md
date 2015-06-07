
7 Jun 2015, version 1.4.0

- avoid sending X-Forwarded-For through proxies (issues [#19](https://github.com/rlidwka/sinopia/issues/19), [#254](https://github.com/rlidwka/sinopia/issues/254))
- fix multiple issues in search (issues [#239](https://github.com/rlidwka/sinopia/issues/239), [#253](https://github.com/rlidwka/sinopia/pull/253))
- fix "maximum stack trace exceeded" errors in auth (issue [#258](https://github.com/rlidwka/sinopia/issues/258))

10 May 2015, version 1.3.0

- add dist-tags endpoints (issue [#211](https://github.com/rlidwka/sinopia/issues/211))

22 Apr 2015, version 1.2.2

- fix access control regression in `1.2.1` (issue [#238](https://github.com/rlidwka/sinopia/issues/238))
- add a possibility to bind on unix sockets (issue [#237](https://github.com/rlidwka/sinopia/issues/237))

11 Apr 2015, version 1.2.1

- added more precise authorization control to auth plugins (issue [#207](https://github.com/rlidwka/sinopia/pull/207))

29 Mar 2015, version 1.1.0

- add a possibility to listen on multiple ports (issue [#172](https://github.com/rlidwka/sinopia/issues/172))
- added https support (issues [#71](https://github.com/rlidwka/sinopia/issues/71), [#166](https://github.com/rlidwka/sinopia/issues/166))
- added an option to use a custom template for web UI (issue [#208](https://github.com/rlidwka/sinopia/pull/208))
- remove "from" and "resolved" fields from shrinkwrap (issue [#204](https://github.com/rlidwka/sinopia/issues/204))
- fix hanging when rendering readme (issue [#206](https://github.com/rlidwka/sinopia/issues/206))
- fix logger-related crash when using sinopia as a library
- all requests to uplinks should now have proper headers

12 Feb 2015, version 1.0.1

- fixed issue with `max_users` option (issue [#184](https://github.com/rlidwka/sinopia/issues/184))
- fixed issue with not being able to disable the web interface (issue [#195](https://github.com/rlidwka/sinopia/pull/195))
- fixed 500 error while logging in with npm (issue [#200](https://github.com/rlidwka/sinopia/pull/200))

26 Jan 2015, version 1.0.0

- switch markdown parser from `remarkable` to `markdown-it`
- update `npm-shrinkwrap.json`
- now downloading tarballs from upstream using the same protocol as for metadata (issue [#166](https://github.com/rlidwka/sinopia/issues/166))

22 Dec 2014, version 1.0.0-beta.2

- fix windows behavior when `$HOME` isn't set (issue [#177](https://github.com/rlidwka/sinopia/issues/177))
- fix sanitization for highlighted code blocks in readme (issue [render-readme/#1](https://github.com/rlidwka/render-readme/issues/1))

15 Dec 2014, version 1.0.0-beta

- Markdown rendering is now a lot safer (switched to remarkable+sanitizer).
- Header in web interface is now static instead of fixed.
- `GET /-/all?local` now returns list of all local packages (issue [#179](https://github.com/rlidwka/sinopia/pull/179))

5 Dec 2014, version 1.0.0-alpha.3

- Fixed an issue with scoped packages in tarballs

25 Nov 2014, version 1.0.0-alpha

- Config file is now created in `$XDG_CONFIG_HOME` instead of current directory. 

  It is printed to stdout each time sinopia starts, so you hopefully won't have any trouble locating it.

  The change is made so sinopia will pick up the same config no matter which directory it is started from.

- Default config file is now a lot shorter, and it is very permissive by default. You could use sinopia without modifying it on your own computer, but definitely should change it on production.

- Added auth tokens. For now, auth token is just a username+password encrypted for security reasons, so it isn't much different from basic auth, but allows to avoid "always-auth" npm setting.

- Added scoped packages.

  Please note that default `*` mask won't apply to them. You have to use masks like `@scope/*` to match scoped packages, or `**` to match everything.

- Enabled web interface by default. Wow, it looks almost ready now!

- All dependencies are bundled now, so uncompatible changes in 3rd party stuff in the future won't ruin the day.

1 Nov 2014, version 0.13.2

- fix `EPERM`-related crashes on windows (issue [#67](https://github.com/rlidwka/sinopia/issues/67))

22 Oct 2014, version 0.13.0

- web interface:
  - web page layout improved (issue [#141](https://github.com/rlidwka/sinopia/pull/141))
  - latest version is now displayed correctly (issues [#120](https://github.com/rlidwka/sinopia/issues/120), [#123](https://github.com/rlidwka/sinopia/issues/123), [#143](https://github.com/rlidwka/sinopia/pull/143))
  - fixed web interface working behind reverse proxy (issues [#145](https://github.com/rlidwka/sinopia/issues/145), [#147](https://github.com/rlidwka/sinopia/issues/147))

2 Oct 2014, version 0.12.1

- web interface:
  - update markdown CSS (issue [#137](https://github.com/rlidwka/sinopia/pull/137))
  - jquery is now served locally (issue [#133](https://github.com/rlidwka/sinopia/pull/133))

- bugfixes:
  - fix "offset out of bounds" issues (issue [sinopia-htpasswd/#2](https://github.com/rlidwka/sinopia-htpasswd/issues/2))
  - "max_users" in htpasswd plugin now work correctly (issue [sinopia-htpasswd/#3](https://github.com/rlidwka/sinopia-htpasswd/issues/3))
  - fix `ENOTDIR, open '.sinopia-db.json'` error in npm search (issue [#122](https://github.com/rlidwka/sinopia/issues/122))

25 Sep 2014, version 0.12.0

- set process title to `sinopia`

- web interface bugfixes:
  - save README data for each package (issue [#100](https://github.com/rlidwka/sinopia/issues/100))
  - fix crashes related to READMEs (issue [#128](https://github.com/rlidwka/sinopia/issues/128))

18 Sep 2014, version 0.11.3

- fix 500 error in adduser function in sinopia-htpasswd (issue [#121](https://github.com/rlidwka/sinopia/issues/121))
- fix fd leak in authenticate function in sinopia-htpasswd (issue [#116](https://github.com/rlidwka/sinopia/issues/116))

15 Sep 2014, version 0.11.1

- mark crypt3 as optional (issue [#119](https://github.com/rlidwka/sinopia/issues/119))

15 Sep 2014, version 0.11.0

- Added auth plugins (issue [#99](https://github.com/rlidwka/sinopia/pull/99))

  Now you can create your own auth plugin based on [sinopia-htpasswd](https://github.com/rlidwka/sinopia-htpasswd) package.

- WIP: web interface (issue [#73](https://github.com/rlidwka/sinopia/pull/73))

  It is disabled by default, and not ready for production yet. Use at your own risk. We will enable it in the next major release.

- Some modules are now bundled by default, so users won't have to install stuff from git. We'll see what issues it causes, maybe all modules will be bundled in the future like in npm.

14 Sep 2014, version 0.10.x

*A bunch of development releases that are broken in various ways. Please use 0.11.x instead.*

7 Sep 2014, version 0.9.3

- fix several bugs that could cause "can't set headers" exception

3 Sep 2014, version 0.9.2

- allow "pretty" format for logging into files (issue [#88](https://github.com/rlidwka/sinopia/pull/88))
- remove outdated user existence check (issue [#115](https://github.com/rlidwka/sinopia/pull/115))

11 Aug 2014, version 0.9.1

- filter falsey _npmUser values (issue [#95](https://github.com/rlidwka/sinopia/pull/95))
- option not to cache third-party files (issue [#85](https://github.com/rlidwka/sinopia/issues/85))

26 Jul 2014, version 0.9.0

- new features:
  - add search functionality (issue [#65](https://github.com/rlidwka/sinopia/pull/65))
  - allow users to authenticate using .htpasswd (issue [#44](https://github.com/rlidwka/sinopia/issues/44))
  - allow user registration with "npm adduser" (issue [#44](https://github.com/rlidwka/sinopia/issues/44))

- bugfixes:
  - avoid crashing when res.socket is null (issue [#89](https://github.com/rlidwka/sinopia/issues/89))

20 Jun 2014, version 0.8.2

- allow '@' in package/tarball names (issue [#75](https://github.com/rlidwka/sinopia/issues/75))
- other minor fixes (issues [#77](https://github.com/rlidwka/sinopia/issues/77), [#80](https://github.com/rlidwka/sinopia/issues/80))

14 Apr 2014, version 0.8.1

- "latest" tag is now always present in any package (issue [#63](https://github.com/rlidwka/sinopia/issues/63))
- tags created with new npm versions (>= 1.3.19) can now be published correctly

1 Apr 2014, version 0.8.0

- use gzip compression whenever possible (issue [#54](https://github.com/rlidwka/sinopia/issues/54))
- set `ignore_latest_tag` to false, it should now be more compatible with npm registry
- make `fs-ext` optional (issue [#61](https://github.com/rlidwka/sinopia/issues/61))

29 Mar 2014, version 0.7.1

- added `ignore_latest_tag` config param (issues [#55](https://github.com/rlidwka/sinopia/issues/55), [#59](https://github.com/rlidwka/sinopia/issues/59))
- reverted PR [#56](https://github.com/rlidwka/sinopia/issues/56) (see discussion in [#57](https://github.com/rlidwka/sinopia/issues/57))

13 Mar 2014, version 0.7.0

- config changes:
  - breaking change: all time intervals are now specified in *seconds* instead of *milliseconds* for the sake of consistency. Change `timeout` if you have one!
  - all time intervals now can be specified in [nginx notation](http://wiki.nginx.org/ConfigNotation), for example `1m 30s` will specify a 90 seconds timeout
  - added `maxage` option to avoid asking public registry for the same data too often (issue [#47](https://github.com/rlidwka/sinopia/issues/47))
  - added `max_fails` and `fail_timeout` options to reduce amount of requests to public registry when it's down (issue [#7](https://github.com/rlidwka/sinopia/issues/7))

- bug fixes:
  - fix crash when headers are sent twice (issue [#52](https://github.com/rlidwka/sinopia/issues/52))
  - all tarballs are returned with `Content-Length`, which allows [yapm](https://github.com/rlidwka/yapm) to estimate download time
  - when connection to public registry is interrupted when downloading a tarball, we no longer save incomplete tarball to the disk

- other changes:
  - 404 errors are returned in couchdb-like manner (issue [#56](https://github.com/rlidwka/sinopia/issues/56))

5 Mar 2014, version 0.6.7

- pin down express@3 version, since sinopia doesn't yet work with express@4

28 Feb 2014, version 0.6.5

- old SSL keys for npm are removed, solves `SELF_SIGNED_CERT_IN_CHAIN` error

3 Feb 2014, version 0.6.3

- validate tags and versions (issue [#40](https://github.com/rlidwka/sinopia/issues/40))
- don't crash when process.getuid doesn't exist (issue [#41](https://github.com/rlidwka/sinopia/issues/41))

18 Jan 2014, version 0.6.2

- adding config param to specify upload limits (issue [#39](https://github.com/rlidwka/sinopia/issues/39))
- making loose semver versions work (issue [#38](https://github.com/rlidwka/sinopia/issues/38))

13 Jan 2014, version 0.6.1

- support setting different storage paths for different packages (issue [#35](https://github.com/rlidwka/sinopia/issues/35))

30 Dec 2013, version 0.6.0

- tag support (issue [#8](https://github.com/rlidwka/sinopia/issues/8))
- adding support for npm 1.3.19+ behaviour (issue [#31](https://github.com/rlidwka/sinopia/issues/31))
- removing all support for proxying publish requests to uplink (too complex)

26 Dec 2013, version 0.5.9

- fixing bug with bad Accept header (issue [#32](https://github.com/rlidwka/sinopia/issues/32))

20 Dec 2013, version 0.5.8

- fixed a warning from js-yaml
- don't color multiline strings in logs output
- better error messages in various cases
- test format changed

15 Dec 2013, version 0.5.7

- try to fetch package from uplinks if user requested a tarball we don't know about (issue [#29](https://github.com/rlidwka/sinopia/issues/29))
- security fix: set express.js to production mode so we won't return stack traces to the user in case of errors

11 Dec 2013, version 0.5.6

- fixing a few crashes related to tags

8 Dec 2013, version 0.5.4

- latest tag always shows highest version available (issue [#8](https://github.com/rlidwka/sinopia/issues/8))
- added a configurable timeout for requests to uplinks (issue [#18](https://github.com/rlidwka/sinopia/issues/18))
- users with bad authentication header are considered not logged in (issue [#17](https://github.com/rlidwka/sinopia/issues/17))

24 Nov 2013, version 0.5.3

- added proxy support for requests to uplinks (issue [#13](https://github.com/rlidwka/sinopia/issues/13))
- changed license from default BSD to WTFPL

26 Oct 2013, version 0.5.2

- server now supports unpublishing local packages
- added fs-ext dependency (flock)
- fixed a few face conditions

20 Oct 2013, version 0.5.1

- fixed a few errors related to logging

12 Oct 2013, version 0.5.0

- using bunyan as a log engine
- pretty-formatting colored logs to stdout by default
- ask user before creating any config files

5 Oct 2013, version 0.4.3

- basic tags support for npm (read-only)
- npm star/unstar calls now return proper error

29 Sep 2013, version 0.4.2

28 Sep 2013, version 0.4.1

- using mocha for tests now
- making use of streams2 api, doesn't work on 0.8 anymore
- basic support for uploading packages to other registries

27 Sep 2013, version 0.4.0

- basic test suite
- storage path in config is now relative to config file location, not cwd
- proper cleanup for temporary files

12 Jul 2013, version 0.3.2

4 Jul 2013, version 0.3.1

- using ETag header for all json output, based on md5

20 Jun 2013, version 0.3.0

- compression for http responses
- requests for files to uplinks are now streams (no buffering)
- tarballs are now cached locally

19 Jun 2013, version 0.2.0

- config file changed, packages is now specified with minimatch
- ability to retrieve all packages from another registry (i.e. npmjs)

14 Jun 2013, version 0.1.1

- config is now autogenerated
- tarballs are now read/written from fs using streams (no buffering)

9 Jun 2013, version 0.1.0

- first npm version
- ability to publish packages and retrieve them locally
- basic authentication/access control

22 May 2013, version 0.0.0

- first commits

