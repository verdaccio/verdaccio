import { PRIMARY_COLOR } from './colors';
import { getModePalette } from './modes';
import { getTheme } from './theme';
import { breakPoints, fontSize, fontWeight } from './tokens';

describe('getModePalette', () => {
  test('should return light palette by default', () => {
    const palette = getModePalette('light');
    expect(palette.mode).toBe('light');
    expect(palette.primary).toEqual({ main: PRIMARY_COLOR });
    expect(palette.background).toEqual({ default: '#f4f4f4', paper: '#ffffff' });
  });

  test('should return dark palette with white primary', () => {
    const palette = getModePalette('dark');
    expect(palette.mode).toBe('dark');
    expect(palette.primary).toEqual({ main: '#fff' });
    expect(palette.secondary).toEqual({ main: '#424242' });
    expect(palette.background).toEqual({ default: '#1a202c', paper: '#2d3748' });
  });

  test('should use custom primary color when provided', () => {
    const customColor = '#ff5733';
    const palette = getModePalette('light', customColor);
    expect(palette.primary).toEqual({ main: customColor });
  });

  test('should ignore custom primary color in dark mode and use white', () => {
    const customColor = '#ff5733';
    const palette = getModePalette('dark', customColor);
    expect(palette.primary).toEqual({ main: '#fff' });
  });
});

describe('getTheme', () => {
  test('should create a light theme', () => {
    const theme = getTheme('light');
    expect(theme.palette.mode).toBe('light');
    expect(theme.palette.primary.main).toBe(PRIMARY_COLOR);
    expect(theme.palette.background.default).toBe('#f4f4f4');
    expect(theme.palette.background.paper).toBe('#ffffff');
  });

  test('should create a dark theme with white primary', () => {
    const theme = getTheme('dark');
    expect(theme.palette.mode).toBe('dark');
    expect(theme.palette.primary.main).toBe('#fff');
    expect(theme.palette.background.default).toBe('#1a202c');
    expect(theme.palette.background.paper).toBe('#2d3748');
  });

  test('should apply custom primary color', () => {
    const theme = getTheme('light', '#e53935');
    expect(theme.palette.primary.main).toBe('#e53935');
  });

  test('should include custom tokens', () => {
    const theme = getTheme('light');
    expect(theme.fontSize).toEqual(fontSize);
    expect(theme.fontWeight).toEqual(fontWeight);
    expect(theme.breakPoints).toEqual(breakPoints);
  });

  test('should set typography font family', () => {
    const theme = getTheme('light');
    expect(theme.typography.fontFamily).toContain('-apple-system');
    expect(theme.typography.fontFamily).toContain('BlinkMacSystemFont');
  });

  test('should override MuiPaper background image', () => {
    const theme = getTheme('light');
    expect(theme.components?.MuiPaper?.styleOverrides).toEqual({
      root: { backgroundImage: 'unset' },
    });
  });
});
