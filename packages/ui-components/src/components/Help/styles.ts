import styled from '@emotion/styled';
import Card from '@mui/material/Card';

import type { Theme } from '../../Theme';

export const CardStyled = styled(Card)({
  maxWidth: 760,
  margin: 'auto',
});

export const StepList = styled('ol')({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const Step = styled('li')<{ theme?: Theme }>(({ theme }) => ({
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
  [`@media (min-width: ${theme.breakPoints.small}px)`]: {
    gap: 16,
  },
}));

export const StepNumber = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 28,
  height: 28,
  borderRadius: '50%',
  fontSize: theme.fontSize.sm,
  fontWeight: theme.fontWeight.bold,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
}));

export const CommandBox = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  marginTop: 8,
  padding: '6px 8px 6px 12px',
  borderRadius: 6,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
  border: `1px solid ${theme.palette.divider}`,
  overflowX: 'auto',
  // the global reset forces the UI font on span and code
  '& span, & code': {
    fontFamily: 'inherit',
  },
}));

export const CustomHelpContent = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  overflowWrap: 'anywhere',
  'h1, h2, h3': { marginTop: 0 },
  // an image next to text is a logo or badge; an image alone in a paragraph keeps its size
  img: { maxWidth: '100%', maxHeight: '2.5em', verticalAlign: 'middle', marginRight: 8 },
  'p > img:only-child': { maxHeight: 'none', marginRight: 0 },
  ul: { paddingLeft: 24, listStyle: 'disc' },
  ol: { paddingLeft: 24, listStyle: 'decimal' },
  li: { marginBottom: 4 },
  blockquote: {
    margin: '16px 0',
    padding: '4px 16px',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    color: theme.palette.text.secondary,
  },
  hr: { border: 0, borderTop: `1px solid ${theme.palette.divider}`, margin: '24px 0' },
  a: { color: theme.palette.primary.main },
  'pre, code': {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  },
  pre: {
    padding: '8px 12px',
    borderRadius: 6,
    overflowX: 'auto',
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor:
      theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
  },
}));
