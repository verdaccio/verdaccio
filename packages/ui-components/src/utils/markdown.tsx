import Link from '@mui/material/Link';
import React from 'react';

// links in markdown leave the registry, so they open in a new tab; MUI Link keeps them readable in dark mode
export const externalLinkComponents = {
  a: ({
    node: _node,
    color: _color,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }) => (
    <Link {...props} rel="noopener noreferrer" target="_blank" />
  ),
};
