import * as DOMPurify from 'dompurify';

export function parseDescription(description: string): string | void {
  if (typeof description === 'string') {
    return DOMPurify.sanitize(description);
  }
  return '';
}
