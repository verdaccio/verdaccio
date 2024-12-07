import React from 'react';
import { vi } from 'vitest';

import { render, screen } from '../../test/test-react-testing-library';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary component', () => {
  test('should render children when no error is caught', () => {
    render(
      <ErrorBoundary>
        <div>{'Test'}</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  test('should render error information when error is caught', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    // Suppress error messages for this test
    const spy = vi.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText(/error:/)).toBeInTheDocument();
    expect(screen.getByText(/info:/)).toBeInTheDocument();

    // Restore console.error after test
    spy.mockRestore();
  });
});
