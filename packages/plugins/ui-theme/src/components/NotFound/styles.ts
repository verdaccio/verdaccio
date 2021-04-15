import styled from '@emotion/styled';

import { PRIMARY_COLOR } from 'verdaccio-ui/utils/colors';

import { default as MuiCard } from '../Card';
import { default as Typography } from '../Heading';
import List from '../List';

export const Wrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  flex: 1,
  padding: '16px',
});

export const Inner = styled('div')({
  maxWidth: '650px',
  display: 'flex',
  flexDirection: 'column',
});

export const EmptyPackage = styled('img')({
  width: '150px',
  margin: '0 auto',
});

export const Heading = styled(Typography)({
  color: PRIMARY_COLOR,
});

export const StyledList = styled(List)({
  padding: 0,
  color: PRIMARY_COLOR,
});

export const Card = styled(MuiCard)({
  marginTop: '24px',
});
