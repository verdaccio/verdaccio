import React, { FunctionComponent } from 'react';

import bannerLogo from './verdaccio-banner.svg';

interface Props {
  children?: React.ReactNode;
}

const Background: FunctionComponent<Props> = ({ children }) => {
  return (
    <div
      css={{
        background: `url(${bannerLogo})`,
        backgroundRepeat: 'repeat',
        minHeight: '45rem',
        backgroundSize: 'cover',
      }}>
      {children}
    </div>
  );
};

export { Background };
