import * as DOMPurify from 'dompurify';
import { parse } from 'marked';

export function parseReadme(readme: string): string | void {
  if (typeof readme === 'string') {
    const html = parse(readme);
    return DOMPurify.sanitize(html);
  }

  return '';
}
