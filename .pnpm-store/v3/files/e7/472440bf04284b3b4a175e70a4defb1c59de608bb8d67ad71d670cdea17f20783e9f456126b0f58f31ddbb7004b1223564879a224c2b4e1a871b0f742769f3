# Conventional Changelog Configuration Spec (v1.0.0)

## Structure

- [types](#types)
  - [type](#type)
- [preMajor](#premajor-boolean)
- [commitUrlFormat](#commiturlformat-string)
- [compareUrlFormat](#compareurlformat-string)
- [issueUrlFormat](#issueurlformat-string)
- [userUrlFormat](#userurlformat-string)
- [releaseCommitMessageFormat](#releasecommitmessageformat-string)

## Substitutions
- [host](#host)
- [owner](#owner)
- [repository](#repository)
- [hash](#hash)
- [previousTag](#previoustype)
- [currentTag](#currenttag)

---

### types

An array of [`type`](#type) objects representing the explicitly supported commit message types, and whether they should show up in generated CHANGELOGs.

```json
"types": [
    { "type": "feat", "section": "Features"},
    { "type": "fix", "section": "Bug Fixes"},
    { "type": "test", "section": "Tests"},
    { "type": "build", "section": "Build System"},
    { "type": "ci", "hidden": true}
]
```

#### type

| name                      | type      | required  | default | description  |
| ------------------------- | --------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| **type**                  | `string`  | ✔️        | `N/A`   | A string used to match `<type>`s used in the [Conventional Commits](https://www.conventionalcommits.org) convention. |
| **section**               | `string`  | ✖️        | `N/A`   | The section where the matched commit `type` will display in the CHANGELOG. |
| **hidden**                | `boolean` | ✖️        | `N/A`   | Set to `true` to hide matched commit `type`s in the CHANGELOG.                     |

### preMajor (`boolean`)

Boolean indicating whether or not the action being run (generating CHANGELOG,
recommendedBump, etc.) is being performed for a pre-major release (`<1.0.0`).

This config setting will generally be set by tooling and not a user.

### commitUrlFormat (`string`)

A URL representing a specific commit at a hash.

```
{{host}}/{{owner}}/{{repository}}/commit/{{hash}}
```

See [Substitutions](#substitutions-1) for more details on substitutions.

### compareUrlFormat (`string`)

A URL representing the comparison between two git shas.

```
{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}
```

See [Substitutions](#substitutions-1) for more details on substitutions.

### issueUrlFormat (`string`)

A URL representing the issueformat (allowing a different URL format to be swapped in for Gitlab, Bitbucket, etc):

```
{{host}}/{{owner}}/{{repository}}/issues/{{id}}
```

See [Substitutions](#substitutions-1) for more details on substitutions.

### userUrlFormat (`string`)

A URL representing the a user's profile URL on GitHub, Gitlab, etc. This URL
is used for substituting `@bcoe` with `https://github.com/bcoe` in commit
messages.

```
{{host}}/{{user}}
```

See [Substitutions](#substitutions-1) for more details on substitutions.

### releaseCommitMessageFormat (`string`)

A string to be used to format the auto-generated release commit message.

```
chore(release): {{currentTag}}
```

See [Substitutions](#substitutions-1) for more details on substitutions.

## Substitutions

All substitutions use [Handlebar](https://handlebarsjs.com/) syntax and templating and will be interpolated as a `string`.

### {{host}}
Default: Normalized host found in `package.json`.

Available to: `commitUrlFormat`, `compareUrlFormat`, `issueUrlFormat`

### {{owner}}
Default: Extracted from normalized `package.json` `repository.url` field.

Available to: `commitUrlFormat`, `compareUrlFormat`, `issueUrlFormat`

### {{repository}}
Default: Extracted from normalized `package.json` `repository.url` field.

Available to: `commitUrlFormat`, `compareUrlFormat`, `issueUrlFormat`

### {{hash}}
Default: The commit hash of the tagged release.

Available to: `commitUrlFormat`

### {{previousTag}}
Default: Previous [semver](https://semver.org/) tag or the first commit hash if no previous tag is available.

Available to: `compareUrlFormat`

### {{currentTag}}
Default: Current [semver](https://semver.org/) tag or  or `'v' + version` if no current tag is available.

Available to: `compareUrlFormat`

### {{user}}
Default: username to the right-hand-side of the `@` symbol in `@user` shorthand.

Available to: `userUrlFormat`

