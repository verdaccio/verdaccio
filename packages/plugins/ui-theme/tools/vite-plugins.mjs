import fs from 'node:fs';

/** Inlines SVG files as base64 data URIs (replaces webpack url-loader for SVGs). */
export function svgInlinePlugin() {
  return {
    name: 'svg-inline',
    enforce: 'pre',
    load(id) {
      if (!id.endsWith('.svg')) return;
      const svg = fs.readFileSync(id);
      const base64 = svg.toString('base64');
      return { code: `export default "data:image/svg+xml;base64,${base64}"`, map: null };
    },
  };
}

/** Exports .md files as raw string default exports (replaces webpack raw-loader). */
export function markdownRawPlugin() {
  return {
    name: 'markdown-raw',
    transform(code, id) {
      if (id.endsWith('.md')) {
        return { code: `export default ${JSON.stringify(code)}`, map: null };
      }
    },
  };
}
