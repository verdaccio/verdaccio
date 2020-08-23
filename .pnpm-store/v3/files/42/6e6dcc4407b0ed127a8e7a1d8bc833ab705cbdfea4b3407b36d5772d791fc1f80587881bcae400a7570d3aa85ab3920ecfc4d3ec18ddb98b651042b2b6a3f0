### Version 5.0.2 (2020-03-11)

- Fixed: The plugin now works with TypeScript 3.8 type imports. Thanks to Liwen
  Guo (@Livven) and Brandon Chinn (@brandon-leapyear)!

### Version 5.0.1 (2020-01-24)

- Fixed: Side effect imports now correctly keep their original order in Node.js
  <12. Thanks to Irvin Zhan (@izhan)!

### Version 5.0.0 (2019-11-22)

- Added: The `groups` option for [custom sorting].
- Changed: Due to the new `groups` option, the default grouping is ever so
  slightly different. Now, not only _valid_ npm package names are placed in the
  “packages” group, but also things that _look_ like npm package names, such as
  `@ui/Section`. And anything starting with `.` is now considered to be a
  relative import. See [custom sorting] for more information.
- Removed: Built-in support for webpack loader syntax. It didn’t fit well with
  the new `groups` option, and since I don’t use it myself I decided to remove
  it. Please open an issue if you have something to say about this!

### Version 4.0.0 (2019-06-19)

- Changed: Sorting is now more human – it is case insensitive (matching the
  default behavior of TSLint, as well as many IDEs) and numbers are sorted by
  their numeric values. This might cause some churn but feels a lot nicer. See
  [#7] for more discussion.
- Improved: `from` paths ending with dots in various ways used to be treated
  specially. This has now been simplified, which gives a more consistent
  sorting. Now, `"."` and `".."` are treated as `"./"` and `"../"` – and those
  are the only special cases for “dotty” paths. For example, you might see
  `import x from "."` now sorting before `import y from "./y"`.
- Fixed: `".x"` is no longer considered to be a relative import. Only `from`
  paths equal to `"."` or `".."`, or that start with `"./"` or `"../"` are truly
  relative. This is a bit of an edge case, but if you do have “weird” imports
  starting with dots in unusual ways you might notice them jumping up to another
  group of imports.
- Fixed: `import {} from "a"` is no longer considered a side-effect import. Only
  imports completely lacking the `{...} from` part are. Remove `{} from` if you
  relied on this from earlier versions.
- Improved: Trailing spaces after imports are now preserved. Before, if you
  accidentally added some trailing spaces it would result in a “Run autofix to
  sort these imports!” error, but the autofix wouldn’t actually sort anything –
  it would only remove some spaces. That was a bit weird. Now, those spaces are
  preserved. It is up to other rules or [Prettier] to take care of trailing
  spaces.

### Version 3.1.1 (2019-05-16)

- Fixed: Semicolon-free code style is now supported. The plugin now leaves a
  semicolon at the start of a line of code after an import alone.

### Version 3.1.0 (2019-03-30)

- Added: Support for indentation in Vue `<script>` tags.

### Version 3.0.0 (2019-02-02)

- Changed: `@/foo` imports and similar are now treated as absolute imports. This
  is a common convention in Vue to avoid `../../../foo` imports. Previously,
  `@/foo` ended up among npm packages. This was fixed by turning the absolute
  imports group into the “rest / trash can” group instead of the packages group.
  The packages group now only contain valid npm package names and Node.js
  builtins. The new grouping logic is:

  1. `import "./setup"`: Side effect imports. (These are not sorted internally.)
  2. `import react from "react"`: Packages (npm packages and Node.js builtins).
  3. `import Error from "@/components/error.vue"`: Absolute imports, full URLs
     and other imports (such as Vue-style `@/foo` ones).
  4. `import a from "./a"`: Relative imports.

### Version 2.1.0 (2019-01-26)

- Added: [TypeScript] support, via [@typescript-eslint/parser].

### Version 2.0.0 (2018-11-30)

- Changed: [Flow type imports] are no longer put in their own group at the top.
  Type imports from npm packages are grouped among regular npm imports, relative
  type imports are group among regular relative imports, and so on. The reason
  for this change is the same as for [sorting on `from`] – to avoid import
  “jumps” when they change. Previously, changing
  `import type { User } from "./user"` into
  `import { type User, getUser } from "./user"` caused the line to jump from the
  top of the file (the type imports group) to further down (the relative imports
  group). Now it stays in the relative imports group in both cases.

### Version 1.0.2 (2018-11-18)

- Update readme.

### Version 1.0.1 (2018-11-18)

- Update readme.

### Version 1.0.0 (2018-11-18)

- Initial release.

<!-- prettier-ignore-start -->
[@typescript-eslint/parser]: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser
[#7]: https://github.com/lydell/eslint-plugin-simple-import-sort/issues/7
[custom sorting]: https://github.com/lydell/eslint-plugin-simple-import-sort/tree/06c4db7d92a82ec2e265ad1bbb0c0a3d76566222#custom-grouping
[flow type imports]: https://flow.org/en/docs/types/modules/
[prettier]: https://prettier.io/
[sort-from]: README.md#why-sort-on-from
[typescript]: https://www.typescriptlang.org/
<!-- prettier-ignore-end -->
