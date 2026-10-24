import { render, screen } from '@testing-library/react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { describe, expect, test } from 'vitest';

import { externalLinkComponents } from './markdown';

describe('externalLinkComponents', () => {
  test('renders markdown links as themed links that open in a new tab', () => {
    render(
      <ReactMarkdown components={externalLinkComponents}>
        {'the [package filter](https://verdaccio.org/docs/configuration#package-filter)'}
      </ReactMarkdown>
    );
    const link = screen.getByRole('link', { name: 'package filter' });
    expect(link).toHaveClass('MuiLink-root');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
