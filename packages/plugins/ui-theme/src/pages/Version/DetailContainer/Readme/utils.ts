import * as DOMPurify from 'dompurify';
import * as marked from 'marked';

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const hljs = require('highlight.js');
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  mangle: false,
  xhtml: false,
});

export function parseReadme(readme: string): string | void {
  if (typeof readme === 'string') {
    const html = marked.parse(readme);
    return DOMPurify.sanitize(html);
  }
  return '';
}
