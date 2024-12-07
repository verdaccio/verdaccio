import React from 'react';
import { vi } from 'vitest';

// Mock react-markdown globally
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
