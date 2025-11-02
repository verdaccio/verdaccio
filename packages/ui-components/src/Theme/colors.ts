import { grey } from '@mui/material/colors';

export const PRIMARY_COLOR = '#4b5e40';

export const baseColors = {
  primary: {
    main: PRIMARY_COLOR,
  },
  secondary: {
    main: '#20232a',
  },
} as const;

export const greyDark = grey[900];
export const greyLight = grey[200];
