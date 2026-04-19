import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import githubMarkdownCss from 'generate-github-markdown-css';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '../src/components/Readme/github-markdown.css');

async function generate() {
  const baseStyles = await githubMarkdownCss({
    onlyStyles: true,
    useFixture: true,
    rootSelector: '.markdown-body',
  });

  const lightVars = await githubMarkdownCss({
    light: 'light',
    dark: 'light',
    onlyVariables: true,
    rootSelector: "[data-theme='light'].markdown-body",
    transparentBackground: true,
  });

  const darkVars = await githubMarkdownCss({
    light: 'dark',
    dark: 'dark',
    onlyVariables: true,
    rootSelector: "[data-theme='dark'].markdown-body",
    transparentBackground: true,
  });

  // The library adds bare [data-theme="x"] selectors alongside our scoped ones.
  // Remove them so variables don't leak outside .markdown-body.
  const cleanVars = (css) =>
    css
      .replace(/,\n\[data-theme="[^"]+"\]/g, '')
      .replace(/,\n\[data-theme='[^']+'\]/g, '');

  const css = [
    '/* Auto-generated — do not edit. Run: node tools/generate-github-markdown.mjs */',
    '',
    '/* Ensure monospace for combination with highlight.js */',
    '.markdown-body pre code span {',
    '  font-family: monospace;',
    '}',
    '',
    '/* Light theme variables */',
    cleanVars(lightVars),
    '',
    '/* Dark theme variables */',
    cleanVars(darkVars),
    '',
    '/* Base styles */',
    baseStyles,
    '',
  ].join('\n');

  writeFileSync(OUTPUT, css, 'utf8');
  console.log(`Generated ${OUTPUT}`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
