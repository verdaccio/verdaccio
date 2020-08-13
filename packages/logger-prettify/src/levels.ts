import { yellow, green, black, blue, red, magenta, cyan, white } from 'kleur';

export type LogLevel = 'trace' | 'debug' | 'info' | 'http' | 'warn' | 'error' | 'fatal';

export type LevelCode = number;

export function calculateLevel(levelCode: LevelCode): LogLevel {
  switch (true) {
    case levelCode < 15:
      return 'trace';
    case levelCode < 25:
      return 'debug';
    case levelCode < 35:
      return 'info';
    case levelCode == 35:
      return 'http';
    case levelCode < 45:
      return 'warn';
    case levelCode < 55:
      return 'error';
    default:
      return 'fatal';
  }
}

export const levelsColors = {
  fatal: red,
  error: red,
  warn: yellow,
  http: magenta,
  info: cyan,
  debug: green,
  trace: white,
};

enum ARROWS {
  LEFT = '<--',
  RIGHT = '-->',
  EQUAL = '-=-',
  NEUTRAL = '---',
}

export const subSystemLevels = {
  color: {
    in: green(ARROWS.LEFT),
    out: yellow(ARROWS.RIGHT),
    fs: black(ARROWS.EQUAL),
    default: blue(ARROWS.NEUTRAL),
  },
  white: {
    in: ARROWS.LEFT,
    out: ARROWS.RIGHT,
    fs: ARROWS.EQUAL,
    default: ARROWS.NEUTRAL,
  },
};
