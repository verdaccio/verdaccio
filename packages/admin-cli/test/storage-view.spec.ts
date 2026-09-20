import { describe, expect, test } from 'vitest';

import { clampPage, filterByName, parseViewCommand } from '../src/commands/storage/view-helpers';

describe('parseViewCommand', () => {
  test.each([
    ['', 'noop'],
    ['q', 'quit'],
    ['quit', 'quit'],
    ['n', 'next'],
    ['p', 'prev'],
    ['h', 'help'],
    ['?', 'help'],
    ['/', 'clear-filter'],
    ['zzz!', 'unknown'],
  ])('%s -> %s', (input, kind) => {
    expect(parseViewCommand(input).kind).toBe(kind);
  });

  test('view index', () => {
    expect(parseViewCommand('12')).toEqual({ kind: 'view', index: 12 });
  });

  test('delete index', () => {
    expect(parseViewCommand('d 7')).toEqual({ kind: 'delete', index: 7 });
  });

  test('filter term', () => {
    expect(parseViewCommand('/react')).toEqual({ kind: 'filter', term: 'react' });
  });
});

describe('filterByName', () => {
  const entries = [{ name: '@angular/core' }, { name: 'react' }, { name: 'react-dom' }];

  test('case-insensitive substring', () => {
    expect(filterByName(entries, 'REACT').map((e) => e.name)).toEqual(['react', 'react-dom']);
  });

  test('empty term returns all', () => {
    expect(filterByName(entries, '')).toHaveLength(3);
  });
});

describe('clampPage', () => {
  test('clamps into range', () => {
    expect(clampPage(-1, 100, 20)).toBe(0);
    expect(clampPage(99, 100, 20)).toBe(4);
    expect(clampPage(2, 100, 20)).toBe(2);
  });

  test('at least one page even when empty', () => {
    expect(clampPage(5, 0, 20)).toBe(0);
  });
});
