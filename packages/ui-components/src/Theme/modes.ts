import { baseColors } from './colors';

export type ThemeMode = 'light' | 'dark';

export const getModeColors = (mode: ThemeMode, primaryColor?: string) => {
  const primary = primaryColor ?? baseColors.primary;

  if (mode === 'dark') {
    return {
      ...baseColors,
      primary,
      secondary: '#424242',
      background: '#1a202c',
    };
  }

  return {
    ...baseColors,
    primary,
    background: '#f4f4f4',
  };
};
