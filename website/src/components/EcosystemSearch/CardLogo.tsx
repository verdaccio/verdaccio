import useBaseUrl from '@docusaurus/useBaseUrl';
import * as React from 'react';
import { FC } from 'react';

import Logo from '../Logo';
import styles from './Header.module.scss';

const CardLogo: FC<{ origin: string }> = ({ origin }): React.ReactElement => {
  // Show Verdaccio logo for core plugins
  return origin === 'core' ? <Logo /> : <></>;
};

export default CardLogo;
