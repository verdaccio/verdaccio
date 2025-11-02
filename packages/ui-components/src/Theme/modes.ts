import type { PaletteOptions } from '@mui/material/styles';

import { baseColors } from './colors';

export type ThemeMode = 'light' | 'dark';

export const getModePalette = (mode: ThemeMode, primaryColor?: string): PaletteOptions => {
  const primary = primaryColor ? { main: primaryColor } : baseColors.primary;

  if (mode === 'dark') {
    return {
      mode,
      primary,
      secondary: { main: '#424242' },
      background: {
        default: '#1a202c',
        paper: '#2d3748',
      },
    };
  }

  return {
    mode,
    primary,
    secondary: baseColors.secondary,
    background: {
      default: '#f4f4f4',
      paper: '#ffffff',
    },
  };
};
