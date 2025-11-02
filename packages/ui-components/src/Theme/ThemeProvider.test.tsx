import { useTheme } from '@mui/material/styles';
import React from 'react';

import { renderWith, screen } from '../test/test-react-testing-library';
import { PRIMARY_COLOR } from './colors';

const ThemeInspector: React.FC = () => {
  const theme = useTheme();
  return (
    <div>
      <span data-testid="mode">{theme.palette.mode}</span>
      <span data-testid="primary">{theme.palette.primary.main}</span>
      <span data-testid="bg-default">{theme.palette.background.default}</span>
      <span data-testid="bg-paper">{theme.palette.background.paper}</span>
    </div>
  );
};

describe('ThemeProvider', () => {
  test('should render with default light theme', () => {
    renderWith(<ThemeInspector />);
    expect(screen.getByTestId('mode').textContent).toBe('light');
    expect(screen.getByTestId('primary').textContent).toBe(PRIMARY_COLOR);
    expect(screen.getByTestId('bg-default').textContent).toBe('#f4f4f4');
    expect(screen.getByTestId('bg-paper').textContent).toBe('#ffffff');
  });

  test('should render with dark mode', () => {
    renderWith(<ThemeInspector />, { darkMode: true });
    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(screen.getByTestId('bg-default').textContent).toBe('#1a202c');
    expect(screen.getByTestId('bg-paper').textContent).toBe('#2d3748');
  });

  test('should apply custom primary color', () => {
    renderWith(<ThemeInspector />, { primaryColor: '#e53935' });
    expect(screen.getByTestId('primary').textContent).toBe('#e53935');
  });
});
