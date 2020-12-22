import styled from '@emotion/styled';
import React from 'react';

import { Theme } from 'verdaccio-ui/design-tokens/theme';

import CircularProgress from '../../CircularProgress';

interface Props {
  size?: number;
  centered?: boolean;
}

const Spinner: React.FC<Props> = ({ size = 50, centered = false }) => (
  <Wrapper centered={centered}>
    <Circular size={size} />
  </Wrapper>
);

export default Spinner;

const Wrapper = styled('div')<Pick<Props, 'centered'>>(({ centered }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...(centered && {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }),
}));

const Circular = styled(CircularProgress)<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.type === 'dark' ? theme?.palette.white : theme?.palette.primary.main,
}));
