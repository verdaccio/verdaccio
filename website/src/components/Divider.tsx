import clsx from 'clsx';
import React from 'react';

import styles from './Divider.module.scss';

type DividerProps = {
  vertical?: boolean;
  spacer?: number;
};
const Divider = ({ vertical, spacer }: DividerProps): React.ReactElement => (
  <div
    className={clsx(styles.divider, vertical && styles['divider--vertical'])}
    style={{ margin: `${spacer}rem` }}
  />
);

export default Divider;
