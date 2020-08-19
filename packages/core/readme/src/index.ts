import marked from 'marked';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const DOMPurify = createDOMPurify(new JSDOM('').window);

export default function parseReadme(readme: string): string | void {
  if (readme) {
    return DOMPurify.sanitize(
      marked(readme, {
        sanitize: false,
      }).trim()
    );
  }

  return;
}
