import React from 'react';

// links in operator markdown leave the registry, so they open in a new tab; raw HTML is not rendered
export const externalLinkComponents = {
  a: ({
    node: _node,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }) => (
    <a {...props} rel="noopener noreferrer" target="_blank" />
  ),
};
