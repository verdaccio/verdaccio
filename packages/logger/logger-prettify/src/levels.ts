import { black, blue, cyan, green, magenta, red, white, yellow } from 'colorette';

export type LogLevel = 'trace' | 'debug' | 'info' | 'http' | 'warn' | 'error' | 'fatal';

export type LevelCode = number;

export function calculateLevel(levelCode: LevelCode): LogLevel {
  switch (true) {
    case levelCode === 10:
      return 'trace';
    case levelCode === 20:
      return 'debug';
    case levelCode === 25:
      return 'http';
    case levelCode === 30:
      return 'info';
    case levelCode === 40:
      return 'warn';
    case levelCode === 50:
      return 'error';
    case levelCode === 60:
      return 'fatal';
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
    auth: blue(ARROWS.NEUTRAL),
    fs: black(ARROWS.EQUAL),
    default: blue(ARROWS.NEUTRAL),
  },
  white: {
    in: ARROWS.LEFT,
    out: ARROWS.RIGHT,
    auth: ARROWS.NEUTRAL,
    fs: ARROWS.EQUAL,
    default: ARROWS.NEUTRAL,
  },
};
