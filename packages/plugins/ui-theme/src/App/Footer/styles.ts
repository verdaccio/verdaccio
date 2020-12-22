import styled from '@emotion/styled';

import { Theme } from 'verdaccio-ui/design-tokens/theme';

export const Wrapper = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  background: theme?.palette.type === 'light' ? theme?.palette.snow : theme?.palette.cyanBlue,
  borderTop: `1px solid ${theme?.palette.greyGainsboro}`,
  color: theme?.palette.type === 'dark' ? theme?.palette.white : theme?.palette.nobel01,
  fontSize: '14px',
  padding: '20px',
}));

export const Inner = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%',
  [`@media (min-width: ${theme?.breakPoints.medium}px)`]: {
    minWidth: 400,
    maxWidth: 800,
    margin: 'auto',
    justifyContent: 'space-between',
  },
  [`@media (min-width: ${theme?.breakPoints.large}px)`]: {
    maxWidth: 1240,
  },
}));

export const Left = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  alignItems: 'center',
  display: 'none',
  [`@media (min-width: ${theme?.breakPoints.medium}px)`]: {
    display: 'flex',
  },
}));

export const Right = styled(Left)({
  display: 'flex',
});

export const Love = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.love,
  padding: '0 5px',
}));
