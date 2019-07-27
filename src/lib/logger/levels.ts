import { yellow, green, black, blue, red, magenta, cyan, white } from 'kleur';

// level to color
export const levels = {
    fatal: red,
    error: red,
    warn: yellow,
    http: magenta,
    info: cyan,
    debug: green,
    trace: white,
};

/**
 * Match the level based on buyan severity scale
 * @param {*} x severity level
 * @return {String} security level
 */
export function calculateLevel(x) {
    switch (true) {
        case x < 15:
            return 'trace';
        case x < 25:
            return 'debug';
        case x < 35:
            return 'info';
        case x == 35:
            return 'http';
        case x < 45:
            return 'warn';
        case x < 55:
            return 'error';
        default:
            return 'fatal';
    }
}

export const subsystems = [
    {
        in: green('<--'),
        out: yellow('-->'),
        fs: black('-=-'),
        default: blue('---'),
    },
    {
        in: '<--',
        out: '-->',
        fs: '-=-',
        default: '---',
    },
];
