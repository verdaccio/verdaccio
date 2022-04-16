import { ReactNode } from 'react';

export interface Props {
  children: ReactNode;
  open: boolean;
  title: string;
  onClose: () => void;
}
