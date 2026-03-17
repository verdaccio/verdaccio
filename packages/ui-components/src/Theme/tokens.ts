export const fontSize = {
  xxl: 26,
  xl: 24,
  lg: 21,
  md: 18,
  default: 16,
  sm: 14,
  ssm: 12,
} as const;

export type FontSize = keyof typeof fontSize;

export const fontWeight = {
  light: 300,
  regular: 400,
  semiBold: 500,
  bold: 700,
} as const;

export type FontWeight = keyof typeof fontWeight;

export const breakPoints = {
  xsmall: 400,
  small: 576,
  medium: 768,
  large: 1024,
  container: 1240,
  xlarge: 1275,
} as const;

export type BreakPoints = typeof breakPoints;

export interface CustomTheme {
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  breakPoints: typeof breakPoints;
}

export const customizedTheme = {
  fontSize,
  fontWeight,
  breakPoints,
};

export type CustomizedTheme = typeof customizedTheme;
