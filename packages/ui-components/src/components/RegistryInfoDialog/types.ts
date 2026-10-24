import type { ReactNode } from 'react';

export interface Props {
  children: ReactNode;
  open: boolean;
  title: string;
  onClose: () => void;
  // a single documentation link in the footer, shared by every tab
  docsUrl?: string;
}
