import styled from '@emotion/styled';

import { Theme } from '../../';

export const Wrapper = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  background: theme?.palette.mode === 'light' ? theme?.palette.snow : theme?.palette.cyanBlue,
  borderTop: `1px solid ${theme?.palette.greyGainsboro}`,
  color: theme?.palette.mode === 'dark' ? theme?.palette.white : theme?.palette.nobel01,
  fontSize: '14px',
  padding: '20px',
}));

export const Inner = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingLeft: 16,
  paddingRight: 16,
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
  marginLeft: 1,
}));

export const Right = styled(Left)({
  display: 'flex',
  marginRight: 1,
});

export const Love = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.love,
  padding: '0 5px',
}));
