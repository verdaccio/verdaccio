import { yellow, green, black, blue, red, magenta, cyan, white } from 'kleur';

export type LevelCode = 'trace' | 'debug' | 'info' | 'http' | 'warn' | 'error' | 'fatal';

export function calculateLevel(levelCode): LevelCode {
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

export const subSystemLevels = {
    color: {
        in: green('<--'),
        out: yellow('-->'),
        fs: black('-=-'),
        default: blue('---'),
    },
    white: {
        in: '<--',
        out: '-->',
        fs: '-=-',
        default: '---',
    },
};
