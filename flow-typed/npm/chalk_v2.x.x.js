// flow-typed signature: fa51178772ad1f35158cb4238bc3f1eb
// flow-typed version: da30fe6876/chalk_v2.x.x/flow_>=v0.25.x

type $npm$chalk$StyleElement = {
  open: string,
  close: string
};

type $npm$chalk$Chain = $npm$chalk$Style & ((...text: any[]) => string);

type $npm$chalk$Style = {
  // General
  reset: $npm$chalk$Chain,
  bold: $npm$chalk$Chain,
  dim: $npm$chalk$Chain,
  italic: $npm$chalk$Chain,
  underline: $npm$chalk$Chain,
  inverse: $npm$chalk$Chain,
  strikethrough: $npm$chalk$Chain,

  // Text colors
  black: $npm$chalk$Chain,
  red: $npm$chalk$Chain,
  redBright: $npm$chalk$Chain,
  green: $npm$chalk$Chain,
  greenBright: $npm$chalk$Chain,
  yellow: $npm$chalk$Chain,
  yellowBright: $npm$chalk$Chain,
  blue: $npm$chalk$Chain,
  blueBright: $npm$chalk$Chain,
  magenta: $npm$chalk$Chain,
  magentaBright: $npm$chalk$Chain,
  cyan: $npm$chalk$Chain,
  cyanBright: $npm$chalk$Chain,
  white: $npm$chalk$Chain,
  whiteBright: $npm$chalk$Chain,
  gray: $npm$chalk$Chain,
  grey: $npm$chalk$Chain,

  // Background colors
  bgBlack: $npm$chalk$Chain,
  bgBlackBright: $npm$chalk$Chain,
  bgRed: $npm$chalk$Chain,
  bgRedBright: $npm$chalk$Chain,
  bgGreen: $npm$chalk$Chain,
  bgGreenBright: $npm$chalk$Chain,
  bgYellow: $npm$chalk$Chain,
  bgYellowBright: $npm$chalk$Chain,
  bgBlue: $npm$chalk$Chain,
  bgBlueBright: $npm$chalk$Chain,
  bgMagenta: $npm$chalk$Chain,
  bgMagentaBright: $npm$chalk$Chain,
  bgCyan: $npm$chalk$Chain,
  bgCyanBright: $npm$chalk$Chain,
  bgWhite: $npm$chalk$Chain,
  bgWhiteBright: $npm$chalk$Chain
};

declare module "chalk" {
  declare var enabled: boolean;
  declare var supportsColor: boolean;

  // General
  declare var reset: $npm$chalk$Chain;
  declare var bold: $npm$chalk$Chain;
  declare var dim: $npm$chalk$Chain;
  declare var italic: $npm$chalk$Chain;
  declare var underline: $npm$chalk$Chain;
  declare var inverse: $npm$chalk$Chain;
  declare var strikethrough: $npm$chalk$Chain;

  // Text colors
  declare var black: $npm$chalk$Chain;
  declare var red: $npm$chalk$Chain;
  declare var redBright: $npm$chalk$Chain;
  declare var green: $npm$chalk$Chain;
  declare var greenBright: $npm$chalk$Chain;
  declare var yellow: $npm$chalk$Chain;
  declare var yellowBright: $npm$chalk$Chain;
  declare var blue: $npm$chalk$Chain;
  declare var blueBright: $npm$chalk$Chain;
  declare var magenta: $npm$chalk$Chain;
  declare var magentaBright: $npm$chalk$Chain;
  declare var cyan: $npm$chalk$Chain;
  declare var cyanBright: $npm$chalk$Chain;
  declare var white: $npm$chalk$Chain;
  declare var whiteBright: $npm$chalk$Chain;
  declare var gray: $npm$chalk$Chain;
  declare var grey: $npm$chalk$Chain;

  // Background colors
  declare var bgBlack: $npm$chalk$Chain;
  declare var bgBlackBright: $npm$chalk$Chain;
  declare var bgRed: $npm$chalk$Chain;
  declare var bgRedBright: $npm$chalk$Chain;
  declare var bgGreen: $npm$chalk$Chain;
  declare var bgGreenBright: $npm$chalk$Chain;
  declare var bgYellow: $npm$chalk$Chain;
  declare var bgYellowBright: $npm$chalk$Chain;
  declare var bgBlue: $npm$chalk$Chain;
  declare var bgBlueBright: $npm$chalk$Chain;
  declare var bgMagenta: $npm$chalk$Chain;
  declare var bgMagentaBright: $npm$chalk$Chain;
  declare var bgCyan: $npm$chalk$Chain;
  declare var bgCyanBright: $npm$chalk$Chain;
  declare var bgWhite: $npm$chalk$Chain;
  declare var bgWhiteBright: $npm$chalk$Chain;
}
