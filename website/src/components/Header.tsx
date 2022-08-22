import Translate, { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React from 'react';
import ReactPlayer from 'react-player/youtube'
import { Follow } from 'react-twitter-widgets';
import cx from 'classnames';
import { useMediaQuery } from 'usehooks-ts'

import Command from './Command';
import styles from './Header.module.scss';

const Header = (): React.ReactElement => {
  const { i18n } = useDocusaurusContext();
  const matches = useMediaQuery('(min-width: 768px)')
  return (
    <div className={styles.header}>
      <div className={styles['header--wrap']}>
        <img
          className={styles['header--imageLogo']}
          src={useBaseUrl('/img/logo/uk/verdaccio-tiny-uk-no-bg.svg')}
          alt="Verdaccio Logo"
        />
        <div className={styles['header--mt-2']}>
          <h1 className={styles['header--title']}>Verdaccio</h1>
          <p className={styles['header--subtitle']}>
            <Translate>A lightweight Node.js private proxy registry</Translate>
          </p>
          <iframe
              src={"https://ghbtns.com/github-btn.html?user=verdaccio&repo=verdaccio&type=star&count=true&size=large"}
              frameBorder="0"
              scrolling="0"
              width="160px"
              height="30px"
              style={{ marginTop: '8px' }}
            />
          <div className={styles['header--links']}>
            <a href="https://github.com/verdaccio/verdaccio" className="link-secondary">
              GITHUB
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
        {matches && <div className={styles['header--m-2']}>
          <ReactPlayer url='https://www.youtube.com/watch?v=qRMucS3i3kQ' controls />
        </div>}
      </div>
      <div className={styles['header--absolute-links']}>
        <div>
          <Follow
            username="verdaccio_npm"
            options={{ size: 'large', dnt: true, lang: i18n.currentLocale }}
          />
        </div>
      </div>

    </div>
  );
};

export default Header;
