export const PAGE_SIZE = 20;

export type ViewCommandKind =
  | 'view'
  | 'delete'
  | 'next'
  | 'prev'
  | 'filter'
  | 'clear-filter'
  | 'help'
  | 'quit'
  | 'noop'
  | 'unknown';

export interface ViewCommand {
  kind: ViewCommandKind;
  index?: number;
  term?: string;
}

/** Parse one line of the interactive browser input. */
export function parseViewCommand(input: string): ViewCommand {
  const s = input.trim();
  if (s === '') {
    return { kind: 'noop' };
  }
  if (s === 'q' || s === 'quit') {
    return { kind: 'quit' };
  }
  if (s === 'n' || s === 'next') {
    return { kind: 'next' };
  }
  if (s === 'p' || s === 'prev') {
    return { kind: 'prev' };
  }
  if (s === 'h' || s === 'help' || s === '?') {
    return { kind: 'help' };
  }
  if (s === '/') {
    return { kind: 'clear-filter' };
  }
  if (s.startsWith('/')) {
    return { kind: 'filter', term: s.slice(1).trim() };
  }
  const del = s.match(/^d\s+(\d+)$/);
  if (del) {
    return { kind: 'delete', index: Number(del[1]) };
  }
  if (/^\d+$/.test(s)) {
    return { kind: 'view', index: Number(s) };
  }
  return { kind: 'unknown' };
}

/** Case-insensitive substring filter by name. */
export function filterByName<T extends { name: string }>(entries: T[], term: string): T[] {
  if (!term) {
    return entries;
  }
  const t = term.toLowerCase();
  return entries.filter((entry) => entry.name.toLowerCase().includes(t));
}

/** Clamp a page index into range for `total` items. */
export function clampPage(page: number, total: number, size = PAGE_SIZE): number {
  const pages = Math.max(1, Math.ceil(total / size));
  return Math.min(Math.max(0, page), pages - 1);
}
