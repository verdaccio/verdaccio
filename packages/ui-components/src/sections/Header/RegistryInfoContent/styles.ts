import styled from '@emotion/styled';

import { Theme } from '../../../';

export const TextContent = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  paddingBottom: '10px',
  backgroundColor: theme.palette.background.default,
}));

export const Description = styled('div')<{ theme?: Theme }>(() => ({
  fontSize: '1rem',
  fontStyle: 'italic',
}));
