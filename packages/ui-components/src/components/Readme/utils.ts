import * as DOMPurify from 'dompurify';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

const marked = new Marked(
  markedHighlight({
    async: false,
    highlight(code, lang) {
      const hljs = require('highlight.js');
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

marked.setOptions({
  renderer: new marked.Renderer(),
  pedantic: false,
  gfm: true,
  breaks: false,
});

export function parseReadme(readme: string): string | void {
  const html = marked.parse(readme);
  return DOMPurify.sanitize(html);
}
