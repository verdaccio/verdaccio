import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import cx from 'classnames';
import React from 'react';

import Command from './Command';
import styles from './Header.module.scss';
import Logo from './Logo';

const Header = (): React.ReactElement => {
  return (
    <div className={styles.header}>
      <div className={styles['header--wrap']}>
        <Logo />
        <div className={styles['header--mt-2']}>
          <h1 className={styles['header--title']}>Verdaccio</h1>
          <p className={styles['header--subtitle']}>
            <Translate>A lightweight Node.js private proxy registry</Translate>
          </p>
          <iframe
            src={
              'https://ghbtns.com/github-btn.html?user=verdaccio&repo=verdaccio&type=star&count=true&size=large'
            }
            frameBorder="0"
            scrolling="0"
            width="160px"
            height="30px"
            style={{ marginTop: '8px' }}
          />
          <div className={styles['header--links']}>
            <a href="/Talks" className="link-secondary">
              WATCH
            </a>
            <Link to={useBaseUrl('/docs/what-is-verdaccio')} className="link-primary">
              <Translate>GET STARTED</Translate>
            </Link>
            <a
              href="https://www.wfp.org/support-us/stories/ukraine-appeal"
              className={cx('link-secondary', 'specialButton')}
            >
              <Translate>DONATE</Translate>
            </a>
          </div>
        </div>
        <div className={styles['header--m-2']}>
          <Command
            command="npm install --global verdaccio"
            alt={translate({ message: 'NPM command to install Verdaccio' })}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
