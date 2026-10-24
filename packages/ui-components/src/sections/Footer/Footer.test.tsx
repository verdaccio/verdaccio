import React from 'react';
import { beforeAll, afterAll, describe, expect, test } from 'vitest';

import { render, renderWith, screen } from '../../test/test-react-testing-library';
import Footer from './Footer';

describe('<Footer /> component', () => {
  beforeAll(() => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.version = 'v1.0.0';
  });

  afterAll(() => {
    delete window.__VERDACCIO_BASENAME_UI_OPTIONS.version;
  });

  test('should load the initial state of Footer component', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('version-footer')).toBeInTheDocument();
  });

  test('shows the default message when no custom footer is configured', () => {
    render(<Footer />);
    expect(screen.queryByTestId('footer-custom')).not.toBeInTheDocument();
    expect(screen.getByText('footer.made-with-love-on', { exact: false })).toBeInTheDocument();
  });

  test('replaces the default message with the configured footer and keeps powered by', () => {
    renderWith(<Footer />, { footer: 'Internal registry run by the platform team' });
    expect(screen.getByTestId('footer-custom')).toHaveTextContent(
      'Internal registry run by the platform team'
    );
    expect(
      screen.queryByText('footer.made-with-love-on', { exact: false })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('version-footer')).toBeInTheDocument();
  });

  test('ignores a blank custom footer', () => {
    renderWith(<Footer />, { footer: '   ' });
    expect(screen.queryByTestId('footer-custom')).not.toBeInTheDocument();
  });

  test('hides the powered by link when poweredBy is false', () => {
    renderWith(<Footer />, { poweredBy: false });
    expect(screen.queryByTestId('version-footer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('footer-powered-by-custom')).not.toBeInTheDocument();
  });

  test('replaces the powered by link with the configured markdown', () => {
    renderWith(<Footer />, { poweredBy: 'Run by the platform team' });
    expect(screen.getByTestId('footer-powered-by-custom')).toHaveTextContent(
      'Run by the platform team'
    );
    expect(screen.queryByTestId('version-footer')).not.toBeInTheDocument();
  });

  test('keeps the powered by link when poweredBy is true or blank', () => {
    renderWith(<Footer />, { poweredBy: '  ' });
    expect(screen.getByTestId('version-footer')).toBeInTheDocument();
  });
});
