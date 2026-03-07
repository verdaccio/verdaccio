import { common } from '@mui/material/colors';
import type { PaletteOptions } from '@mui/material/styles';

import { baseColors } from './colors';

export type ThemeMode = 'light' | 'dark';

const DARK_MODE_PRIMARY = common.white;

export const getModePalette = (mode: ThemeMode, primaryColor?: string): PaletteOptions => {
  const basePrimary = primaryColor || baseColors.primary.main;
  const primary = mode === 'dark' ? { main: DARK_MODE_PRIMARY } : { main: basePrimary };

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
