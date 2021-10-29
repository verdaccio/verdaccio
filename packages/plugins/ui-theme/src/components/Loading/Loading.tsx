import React from 'react';

import Logo from '../Logo';
import Spinner from './Spinner';
import { Badge, Wrapper } from './styles';

const Loading: React.FC = () => (
  <Wrapper data-testid="loading">
    <Badge>
      <Logo size="big" />
    </Badge>
    <Spinner data-testid="spinnerLogo" />
  </Wrapper>
);

export default Loading;
