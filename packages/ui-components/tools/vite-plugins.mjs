import fs from 'node:fs';
import path from 'node:path';

/**
 * Inlines SVG files as base64 data URIs.
 */
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

/**
 * Library mode extracts CSS to ui-components.css but leaves empty CSS stubs in
 * preserved modules without wiring the entry to the emitted asset. Downstream
 * bundlers (e.g. ui-theme) then never include those styles. Prepend a side-effect
 * import/require on the package entry so the CSS is part of the public graph.
 */
export function linkEntryCssPlugin() {
    return {
        name: 'link-entry-css',
        enforce: 'post',
        generateBundle(_options, bundle) {
            const cssNames = Object.keys(bundle).filter(
                (name) => bundle[name].type === 'asset' && name.endsWith('.css')
            );
            if (cssNames.length === 0) return;
            const cssName = path.basename(cssNames[0]);
            for (const [fileName, chunk] of Object.entries(bundle)) {
                if (chunk.type !== 'chunk' || !chunk.code) continue;
                if (fileName === 'index.mjs') {
                    chunk.code = `import './${cssName}';\n${chunk.code}`;
                } else if (fileName === 'index.js') {
                    const lines = chunk.code.split('\n');
                    lines.splice(1, 0, `require('./${cssName}');`);
                    chunk.code = lines.join('\n');
                }
            }
        },
    };
}
