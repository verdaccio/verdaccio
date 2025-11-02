import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // logging
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div role="alert">
          <h1>{'Something went wrong.'}</h1>
          <pre>{error?.message}</pre>
        </div>
      );
    }

    return children;
  }
}
