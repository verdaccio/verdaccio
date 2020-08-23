"use strict";

const defaultGroups = [
  // Side effect imports.
  ["^\\u0000"],
  // Packages.
  // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
  ["^@?\\w"],
  // Absolute imports and other imports such as Vue-style `@/foo`.
  // Anything that does not start with a dot.
  ["^[^.]"],
  // Relative imports.
  // Anything that starts with a dot.
  ["^\\."],
];

module.exports = {
  meta: {
    type: "layout",
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          groups: {
            type: "array",
            items: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
        additionalProperties: false,
      },
    ],
    docs: {
      url:
        "https://github.com/lydell/eslint-plugin-simple-import-sort#sort-order",
    },
    messages: {
      sort: "Run autofix to sort these imports!",
    },
  },
  create: context => {
    const { groups: rawGroups = defaultGroups } = context.options[0] || {};
    const outerGroups = rawGroups.map(groups =>
      groups.map(item => RegExp(item, "u"))
    );
    return {
      Program: node => {
        for (const imports of extractImportChunks(node)) {
          maybeReportSorting(imports, context, outerGroups);
        }
      },
    };
  },
};

// A “chunk” is a sequence of import statements with only comments and
// whitespace between.
function extractImportChunks(programNode) {
  const chunks = [];
  let imports = [];

  for (const item of programNode.body) {
    if (isImport(item)) {
      imports.push(item);
    } else if (imports.length > 0) {
      chunks.push(imports);
      imports = [];
    }
  }

  if (imports.length > 0) {
    chunks.push(imports);
  }

  return chunks;
}

function maybeReportSorting(imports, context, outerGroups) {
  const sourceCode = context.getSourceCode();
  const items = getImportItems(imports, sourceCode);
  const sorted = printSortedImports(items, sourceCode, outerGroups);

  const { start } = items[0];
  const { end } = items[items.length - 1];
  const original = sourceCode.getText().slice(start, end);

  if (original !== sorted) {
    context.report({
      messageId: "sort",
      loc: {
        start: sourceCode.getLocFromIndex(start),
        end: sourceCode.getLocFromIndex(end),
      },
      fix: fixer => fixer.replaceTextRange([start, end], sorted),
    });
  }
}

function printSortedImports(importItems, sourceCode, outerGroups) {
  const itemGroups = outerGroups.map(groups =>
    groups.map(regex => ({ regex, items: [] }))
  );
  const rest = [];

  for (const item of importItems) {
    const { originalSource } = item.source;
    const source = item.isSideEffectImport
      ? `\0${originalSource}`
      : originalSource;
    const [matchedGroup] = flatMap(itemGroups, groups =>
      groups.map(group => [group, group.regex.exec(source)])
    ).reduce(
      ([group, longestMatch], [nextGroup, nextMatch]) =>
        nextMatch != null &&
        (longestMatch == null || nextMatch[0].length > longestMatch[0].length)
          ? [nextGroup, nextMatch]
          : [group, longestMatch],
      [undefined, undefined]
    );
    if (matchedGroup == null) {
      rest.push(item);
    } else {
      matchedGroup.items.push(item);
    }
  }

  const sortedItems = itemGroups
    .concat([[{ regex: /^/, items: rest }]])
    .map(groups => groups.filter(group => group.items.length > 0))
    .filter(groups => groups.length > 0)
    .map(groups => groups.map(group => sortImportItems(group.items)));

  const newline = guessNewline(sourceCode);

  const sorted = sortedItems
    .map(groups =>
      groups
        .map(groupItems => groupItems.map(item => item.code).join(newline))
        .join(newline)
    )
    .join(newline + newline);

  // Edge case: If the last import (after sorting) ends with a line comment and
  // there’s code (or a multiline block comment) on the same line, add a newline
  // so we don’t accidentally comment stuff out.
  const flattened = flatMap(sortedItems, groups => [].concat(...groups));
  const lastSortedItem = flattened[flattened.length - 1];
  const lastOriginalItem = importItems[importItems.length - 1];
  const nextToken = lastSortedItem.needsNewline
    ? sourceCode.getTokenAfter(lastOriginalItem.node, {
        includeComments: true,
        filter: token =>
          !isLineComment(token) &&
          !(
            isBlockComment(token) &&
            token.loc.end.line === lastOriginalItem.node.loc.end.line
          ),
      })
    : undefined;
  const maybeNewline =
    nextToken != null &&
    nextToken.loc.start.line === lastOriginalItem.node.loc.end.line
      ? newline
      : "";

  return sorted + maybeNewline;
}

// Wrap the import nodes in `passedImports` in objects with more data about the
// import. Most importantly there’s a `code` property that contains the import
// node as a string, with comments (if any). Finding the corresponding comments
// is the hard part.
function getImportItems(passedImports, sourceCode) {
  const imports = handleLastSemicolon(passedImports, sourceCode);
  return imports.map((importNode, importIndex) => {
    const lastLine =
      importIndex === 0
        ? importNode.loc.start.line - 1
        : imports[importIndex - 1].loc.end.line;

    // Get all comments before the import, except:
    //
    // - Comments on another line for the first import.
    // - Comments that belong to the previous import (if any) – that is,
    //   comments that are on the same line as the previous import. But multiline
    //   block comments always belong to this import, not the previous.
    const commentsBefore = sourceCode
      .getCommentsBefore(importNode)
      .filter(
        comment =>
          comment.loc.start.line <= importNode.loc.start.line &&
          comment.loc.end.line > lastLine &&
          (importIndex > 0 || comment.loc.start.line > lastLine)
      );

    // Get all comments after the import that are on the same line. Multiline
    // block comments belong to the _next_ import (or the following code in case
    // of the last import).
    const commentsAfter = sourceCode
      .getCommentsAfter(importNode)
      .filter(comment => comment.loc.end.line === importNode.loc.end.line);

    const before = printCommentsBefore(importNode, commentsBefore, sourceCode);
    const after = printCommentsAfter(importNode, commentsAfter, sourceCode);

    // Print the indentation before the import or its first comment, if any, to
    // support indentation in `<script>` tags.
    const indentation = getIndentation(
      commentsBefore.length > 0 ? commentsBefore[0] : importNode,
      sourceCode
    );

    // Print spaces after the import or its last comment, if any, to avoid
    // producing a sort error just because you accidentally added a few trailing
    // spaces among the imports.
    const trailingSpaces = getTrailingSpaces(
      commentsAfter.length > 0
        ? commentsAfter[commentsAfter.length - 1]
        : importNode,
      sourceCode
    );

    const code =
      indentation +
      before +
      printSortedSpecifiers(importNode, sourceCode) +
      after +
      trailingSpaces;

    const all = [...commentsBefore, importNode, ...commentsAfter];
    const [start] = all[0].range;
    const [, end] = all[all.length - 1].range;

    const source = getSource(importNode);

    return {
      node: importNode,
      code,
      start: start - indentation.length,
      end: end + trailingSpaces.length,
      isSideEffectImport: isSideEffectImport(importNode, sourceCode),
      source,
      index: importIndex,
      needsNewline:
        commentsAfter.length > 0 &&
        isLineComment(commentsAfter[commentsAfter.length - 1]),
    };
  });
}

// Parsers think that a semicolon after a statement belongs to that statement.
// But in a semicolon-free code style it might belong to the next statement:
//
//     import x from "x"
//     ;[].forEach()
//
// If the last import of a chunk ends with a semicolon, and that semicolon isn’t
// located on the same line as the `from` string, adjust the import node to end
// at the `from` string instead.
//
// In the above example, the import is adjusted to end after `"x"`.
function handleLastSemicolon(imports, sourceCode) {
  const lastIndex = imports.length - 1;
  const lastImport = imports[lastIndex];
  const [nextToLastToken, lastToken] = sourceCode.getLastTokens(lastImport, {
    count: 2,
  });
  const lastIsSemicolon = isPunctuator(lastToken, ";");

  if (!lastIsSemicolon) {
    return imports;
  }

  const semicolonBelongsToImport =
    nextToLastToken.loc.end.line === lastToken.loc.start.line ||
    // If there’s no more code after the last import the semicolon has to belong
    // to the import, even if it is not on the same line.
    sourceCode.getTokenAfter(lastToken) == null;

  if (semicolonBelongsToImport) {
    return imports;
  }

  // Preserve the start position, but use the end position of the `from` string.
  const newLastImport = Object.assign({}, lastImport, {
    range: [lastImport.range[0], nextToLastToken.range[1]],
    loc: {
      start: lastImport.loc.start,
      end: nextToLastToken.loc.end,
    },
  });

  return imports.slice(0, lastIndex).concat(newLastImport);
}

function printSortedSpecifiers(importNode, sourceCode) {
  const allTokens = getAllTokens(importNode, sourceCode);
  const openBraceIndex = allTokens.findIndex(token => isPunctuator(token, "{"));
  const closeBraceIndex = allTokens.findIndex(token =>
    isPunctuator(token, "}")
  );

  // Exclude "ImportDefaultSpecifier" – the "def" in `import def, {a, b}`.
  const specifiers = importNode.specifiers.filter(node =>
    isImportSpecifier(node)
  );

  if (
    openBraceIndex === -1 ||
    closeBraceIndex === -1 ||
    specifiers.length <= 1
  ) {
    return printTokens(allTokens);
  }

  const specifierTokens = allTokens.slice(openBraceIndex + 1, closeBraceIndex);
  const itemsResult = getSpecifierItems(specifierTokens, sourceCode);

  const items = itemsResult.items.map((originalItem, index) =>
    Object.assign({}, originalItem, { node: specifiers[index] })
  );

  const sortedItems = sortSpecifierItems(items);

  const newline = guessNewline(sourceCode);

  // `allTokens[closeBraceIndex - 1]` wouldn’t work because `allTokens` contains
  // comments and whitespace.
  const hasTrailingComma = isPunctuator(
    sourceCode.getTokenBefore(allTokens[closeBraceIndex]),
    ","
  );

  const lastIndex = sortedItems.length - 1;
  const sorted = flatMap(sortedItems, (item, index) => {
    const previous = index === 0 ? undefined : sortedItems[index - 1];

    // Add a newline if the item needs one, unless the previous item (if any)
    // already ends with a newline.
    const maybeNewline =
      previous != null &&
      needsStartingNewline(item.before) &&
      !(
        previous.after.length > 0 &&
        isNewline(previous.after[previous.after.length - 1])
      )
        ? [{ type: "Newline", code: newline }]
        : [];

    if (index < lastIndex || hasTrailingComma) {
      return [
        ...maybeNewline,
        ...item.before,
        ...item.specifier,
        { type: "Comma", code: "," },
        ...item.after,
      ];
    }

    const nonBlankIndex = item.after.findIndex(
      token => !isNewline(token) && !isSpaces(token)
    );

    // Remove whitespace and newlines at the start of `.after` if the item had a
    // comma before, but now hasn’t to avoid blank lines and excessive
    // whitespace before `}`.
    const after = !item.hadComma
      ? item.after
      : nonBlankIndex === -1
      ? []
      : item.after.slice(nonBlankIndex);

    return [...maybeNewline, ...item.before, ...item.specifier, ...after];
  });

  const maybeNewline =
    needsStartingNewline(itemsResult.after) &&
    !isNewline(sorted[sorted.length - 1])
      ? [{ type: "Newline", code: newline }]
      : [];

  return printTokens([
    ...allTokens.slice(0, openBraceIndex + 1),
    ...itemsResult.before,
    ...sorted,
    ...maybeNewline,
    ...itemsResult.after,
    ...allTokens.slice(closeBraceIndex),
  ]);
}

// Turns a list of tokens between the `{` and `}` of an import specifiers list
// into an object with the following properties:
//
// - before: Array of tokens – whitespace and comments after the `{` that do not
//   belong to any specifier.
// - after: Array of tokens – whitespace and comments before the `}` that do not
//   belong to any specifier.
// - items: Array of specifier items.
//
// Each specifier item looks like this:
//
// - before: Array of tokens – whitespace and comments before the specifier.
// - after: Array of tokens – whitespace and comments after the specifier.
// - specifier: Array of tokens – identifiers, whitespace and comments of the
//   specifier.
// - hadComma: A Boolean representing if the specifier had a comma originally.
//
// We have to do carefully preserve all original whitespace this way in order to
// be compatible with other stylistic ESLint rules.
function getSpecifierItems(tokens) {
  const result = {
    before: [],
    after: [],
    items: [],
  };

  let current = makeEmptyItem();

  for (const token of tokens) {
    switch (current.state) {
      case "before":
        switch (token.type) {
          case "Newline":
            current.before.push(token);

            // All whitespace and comments before the first newline or
            // identifier belong to the `{`, not the first specifier.
            if (result.before.length === 0 && result.items.length === 0) {
              result.before = current.before;
              current = makeEmptyItem();
            }
            break;

          case "Spaces":
          case "Block":
          case "Line":
            current.before.push(token);
            break;

          // We’ve reached an identifier.
          default:
            // All whitespace and comments before the first newline or
            // identifier belong to the `{`, not the first specifier.
            if (result.before.length === 0 && result.items.length === 0) {
              result.before = current.before;
              current = makeEmptyItem();
            }

            current.state = "specifier";
            current.specifier.push(token);
        }
        break;

      case "specifier":
        switch (token.type) {
          case "Punctuator":
            // There can only be comma punctuators, but future-proof by checking.
            // istanbul ignore else
            if (isPunctuator(token, ",")) {
              current.hadComma = true;
              current.state = "after";
            } else {
              current.specifier.push(token);
            }
            break;

          // When consuming the specifier part, we eat every token until a comma
          // or to the end, basically.
          default:
            current.specifier.push(token);
        }
        break;

      case "after":
        switch (token.type) {
          // Only whitespace and comments after a specifier that are on the same
          // belong to the specifier.
          case "Newline":
            current.after.push(token);
            result.items.push(current);
            current = makeEmptyItem();
            break;

          case "Spaces":
          case "Line":
            current.after.push(token);
            break;

          case "Block":
            // Multiline block comments belong to the next specifier.
            if (hasNewline(token.code)) {
              result.items.push(current);
              current = makeEmptyItem();
              current.before.push(token);
            } else {
              current.after.push(token);
            }
            break;

          // We’ve reached another specifier – time to process that one.
          default:
            result.items.push(current);
            current = makeEmptyItem();
            current.state = "specifier";
            current.specifier.push(token);
        }
        break;

      // istanbul ignore next
      default:
        throw new Error(`Unknown state: ${current.state}`);
    }
  }

  // We’ve reached the end of the tokens. Handle what’s currently in `current`.
  switch (current.state) {
    // If the last specifier has a trailing comma and some of the remaining
    // whitespace and comments are on the same line we end up here. If so we
    // want to put that whitespace and comments in `result.after`.
    case "before":
      result.after = current.before;
      break;

    // If the last specifier has no trailing comma we end up here. Move all
    // trailing comments and whitespace from `.specifier` to `.after`, and
    // comments and whitespace that don’t belong to the specifier to
    // `result.after`.
    case "specifier": {
      const lastIdentifierIndex = findLastIndex(current.specifier, token2 =>
        isIdentifier(token2)
      );

      const specifier = current.specifier.slice(0, lastIdentifierIndex + 1);
      const after = current.specifier.slice(lastIdentifierIndex + 1);

      // If there’s a newline, put everything up to and including (hence the `+
      // 1`) that newline in the specifiers’s `.after`.
      const newlineIndexRaw = after.findIndex(token2 => isNewline(token2));
      const newlineIndex = newlineIndexRaw === -1 ? -1 : newlineIndexRaw + 1;

      // If there’s a multiline block comment, put everything _befor_ that
      // comment in the specifiers’s `.after`.
      const multilineBlockCommentIndex = after.findIndex(
        token2 => isBlockComment(token2) && hasNewline(token2.code)
      );

      const sliceIndex =
        // If both a newline and a multiline block comment exists, choose the
        // earlier one.
        newlineIndex >= 0 && multilineBlockCommentIndex >= 0
          ? Math.min(newlineIndex, multilineBlockCommentIndex)
          : newlineIndex >= 0
          ? newlineIndex
          : multilineBlockCommentIndex >= 0
          ? multilineBlockCommentIndex
          : // If there are no newlines, move the last whitespace into `result.after`.
          endsWithSpaces(after)
          ? after.length - 1
          : -1;

      current.specifier = specifier;
      current.after = sliceIndex === -1 ? after : after.slice(0, sliceIndex);
      result.items.push(current);
      result.after = sliceIndex === -1 ? [] : after.slice(sliceIndex);

      break;
    }

    // If the last specifier has a trailing comma and all remaining whitespace
    // and comments are on the same line we end up here. If so we want to move
    // the final whitespace to `result.after`.
    case "after":
      if (endsWithSpaces(current.after)) {
        const last = current.after.pop();
        result.after = [last];
      }
      result.items.push(current);
      break;

    // istanbul ignore next
    default:
      throw new Error(`Unknown state: ${current.state}`);
  }

  return result;
}

function makeEmptyItem() {
  return {
    // "before" | "specifier" | "after"
    state: "before",
    before: [],
    after: [],
    specifier: [],
    hadComma: false,
  };
}

// If a specifier item starts with a line comment or a singleline block comment
// it needs a newline before that. Otherwise that comment can end up belonging
// to the _previous_ import specifier after sorting.
function needsStartingNewline(tokens) {
  const before = tokens.filter(token => !isSpaces(token));

  if (before.length === 0) {
    return false;
  }

  const firstToken = before[0];
  return (
    isLineComment(firstToken) ||
    (isBlockComment(firstToken) && !hasNewline(firstToken.code))
  );
}

function endsWithSpaces(tokens) {
  const last = tokens.length > 0 ? tokens[tokens.length - 1] : undefined;
  return last == null ? false : isSpaces(last);
}

const NEWLINE = /(\r?\n)/;

function hasNewline(string) {
  return NEWLINE.test(string);
}

function guessNewline(sourceCode) {
  const match = NEWLINE.exec(sourceCode.text);
  return match == null ? "\n" : match[0];
}

function parseWhitespace(whitespace) {
  const allItems = whitespace.split(NEWLINE);

  // Remove blank lines. `allItems` contains alternating `spaces` (which can be
  // the empty string) and `newline` (which is either "\r\n" or "\n"). So in
  // practice `allItems` grows like this as there are more newlines in
  // `whitespace`:
  //
  //     [spaces]
  //     [spaces, newline, spaces]
  //     [spaces, newline, spaces, newline, spaces]
  //     [spaces, newline, spaces, newline, spaces, newline, spaces]
  //
  // If there are 5 or more items we have at least one blank line. If so, keep
  // the first `spaces`, the first `newline` and the last `spaces`.
  const items =
    allItems.length >= 5
      ? allItems.slice(0, 2).concat(allItems.slice(-1))
      : allItems;

  return (
    items
      .map((spacesOrNewline, index) =>
        index % 2 === 0
          ? { type: "Spaces", code: spacesOrNewline }
          : { type: "Newline", code: spacesOrNewline }
      )
      // Remove empty spaces since it makes debugging easier.
      .filter(token => token.code !== "")
  );
}

function removeBlankLines(whitespace) {
  return printTokens(parseWhitespace(whitespace));
}

// Returns `sourceCode.getTokens(node)` plus whitespace and comments. All tokens
// have a `code` property with `sourceCode.getText(token)`.
function getAllTokens(node, sourceCode) {
  const tokens = sourceCode.getTokens(node);
  const lastTokenIndex = tokens.length - 1;
  return flatMap(tokens, (token, tokenIndex) => {
    const newToken = Object.assign({}, token, {
      code: sourceCode.getText(token),
    });

    if (tokenIndex === lastTokenIndex) {
      return [newToken];
    }

    const comments = sourceCode.getCommentsAfter(token);
    const last = comments.length > 0 ? comments[comments.length - 1] : token;
    const nextToken = tokens[tokenIndex + 1];

    return [
      newToken,
      ...flatMap(comments, (comment, commentIndex) => {
        const previous =
          commentIndex === 0 ? token : comments[commentIndex - 1];
        return [
          ...parseWhitespace(
            sourceCode.text.slice(previous.range[1], comment.range[0])
          ),
          Object.assign({}, comment, { code: sourceCode.getText(comment) }),
        ];
      }),
      ...parseWhitespace(
        sourceCode.text.slice(last.range[1], nextToken.range[0])
      ),
    ];
  });
}

// Prints tokens that are enhanced with a `code` property – like those returned
// by `getAllTokens` and `parseWhitespace`.
function printTokens(tokens) {
  return tokens.map(token => token.code).join("");
}

// `comments` is a list of comments that occur before `node`. Print those and
// the whitespace between themselves and between `node`.
function printCommentsBefore(node, comments, sourceCode) {
  const lastIndex = comments.length - 1;
  return comments
    .map((comment, index) => {
      const next = index === lastIndex ? node : comments[index + 1];
      return (
        sourceCode.getText(comment) +
        removeBlankLines(sourceCode.text.slice(comment.range[1], next.range[0]))
      );
    })
    .join("");
}

// `comments` is a list of comments that occur after `node`. Print those and
// the whitespace between themselves and between `node`.
function printCommentsAfter(node, comments, sourceCode) {
  return comments
    .map((comment, index) => {
      const previous = index === 0 ? node : comments[index - 1];
      return (
        removeBlankLines(
          sourceCode.text.slice(previous.range[1], comment.range[0])
        ) + sourceCode.getText(comment)
      );
    })
    .join("");
}

function getIndentation(node, sourceCode) {
  const tokenBefore = sourceCode.getTokenBefore(node, {
    includeComments: true,
  });
  if (tokenBefore == null) {
    const text = sourceCode.text.slice(0, node.range[0]);
    const lines = text.split(NEWLINE);
    return lines[lines.length - 1];
  }
  const text = sourceCode.text.slice(tokenBefore.range[1], node.range[0]);
  const lines = text.split(NEWLINE);
  return lines.length > 1 ? lines[lines.length - 1] : "";
}

function getTrailingSpaces(node, sourceCode) {
  const tokenAfter = sourceCode.getTokenAfter(node, {
    includeComments: true,
  });
  if (tokenAfter == null) {
    const text = sourceCode.text.slice(node.range[1]);
    const lines = text.split(NEWLINE);
    return lines[0];
  }
  const text = sourceCode.text.slice(node.range[1], tokenAfter.range[0]);
  const lines = text.split(NEWLINE);
  return lines[0];
}

function sortImportItems(items) {
  return items.slice().sort((itemA, itemB) =>
    // If both items are side effect imports, keep their original order.
    itemA.isSideEffectImport && itemB.isSideEffectImport
      ? itemA.index - itemB.index
      : // If one of the items is a side effect import, move it first.
      itemA.isSideEffectImport
      ? -1
      : itemB.isSideEffectImport
      ? 1
      : // Compare the `from` part.
        compare(itemA.source.source, itemB.source.source) ||
        // The `.source` has been slightly tweaked. To stay fully deterministic,
        // also sort on the original value.
        compare(itemA.source.originalSource, itemB.source.originalSource) ||
        // Then put type imports before regular ones.
        compare(itemA.source.importKind, itemB.source.importKind) ||
        // Keep the original order if the sources are the same. It's not worth
        // trying to compare anything else, and you can use `import/no-duplicates`
        // to get rid of the problem anyway.
        itemA.index - itemB.index
  );
}

function sortSpecifierItems(items) {
  return items.slice().sort(
    (itemA, itemB) =>
      // Put type imports before regular ones.
      compare(getImportKind(itemA.node), getImportKind(itemB.node)) ||
      // Then compare by name.
      compare(itemA.node.imported.name, itemB.node.imported.name) ||
      // Then compare by the `as` name.
      compare(itemA.node.local.name, itemB.node.local.name) ||
      // Keep the original order if the names are the same. It's not worth
      // trying to compare anything else, `import {a, a} from "mod"` is a syntax
      // error anyway (but babel-eslint kind of supports it).
      // istanbul ignore next
      itemA.index - itemB.index
  );
}

const collator = new Intl.Collator("en", {
  sensitivity: "base",
  numeric: true,
});

function compare(a, b) {
  return collator.compare(a, b) || (a < b ? -1 : a > b ? 1 : 0);
}

// Full import statement.
function isImport(node) {
  return node.type === "ImportDeclaration";
}

// import def, { a, b as c, type d } from "A"
//               ^  ^^^^^^  ^^^^^^
function isImportSpecifier(node) {
  return node.type === "ImportSpecifier";
}

// import "setup"
// But not: import {} from "setup"
// And not: import type {} from "setup"
function isSideEffectImport(importNode, sourceCode) {
  return (
    importNode.specifiers.length === 0 &&
    (!importNode.importKind || importNode.importKind === "value") &&
    !isPunctuator(sourceCode.getFirstToken(importNode, { skip: 1 }), "{")
  );
}

function isIdentifier(node) {
  return node.type === "Identifier";
}

function isPunctuator(node, value) {
  return node.type === "Punctuator" && node.value === value;
}

function isBlockComment(node) {
  return node.type === "Block";
}

function isLineComment(node) {
  return node.type === "Line";
}

function isSpaces(node) {
  return node.type === "Spaces";
}

function isNewline(node) {
  return node.type === "Newline";
}

function getSource(importNode) {
  const source = importNode.source.value;

  return {
    source:
      // Due to "." sorting before "/" by default, relative imports are
      // automatically sorted in a logical manner for us: Imports from files
      // further up come first, with deeper imports last. There’s one
      // exception, though: When the `from` part ends with one or two dots:
      // "." and "..". Those are supposed to sort just like "./", "../". So
      // add in the slash for them. (No special handling is done for cases
      // like "./a/.." because nobody writes that anyway.)
      source === "." || source === ".." ? `${source}/` : source,
    originalSource: source,
    importKind: getImportKind(importNode),
  };
}

function getImportKind(importNode) {
  // `type` and `typeof` imports. Default to "value" (like TypeScript) to make
  // regular imports come after the type imports.
  return importNode.importKind || "value";
}

// Like `Array.prototype.findIndex`, but searches from the end.
function findLastIndex(array, fn) {
  for (let index = array.length - 1; index >= 0; index--) {
    if (fn(array[index], index, array)) {
      return index;
    }
  }
  // There are currently no usages of `findLastIndex` where nothing is found.
  // istanbul ignore next
  return -1;
}

// Like `Array.prototype.flatMap`, had it been available.
function flatMap(array, fn) {
  return [].concat(...array.map(fn));
}
