import Translate, { translate } from '@docusaurus/Translate';
import { Link } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React from 'react';
import { Follow } from 'react-twitter-widgets';

import Command from './Command';
import styles from './Header.module.scss';

const Header = (): React.ReactElement => {
  const { i18n } = useDocusaurusContext();
  return (
    <div className={styles.header}>
      <div className={styles['header--wrap']}>
        <img
          className={styles['header--imageLogo']}
          src={useBaseUrl('/img/verdaccio-tiny.svg')}
          alt="Verdaccio Logo"
        />
        <div className={styles['header--mt-2']}>
          <h1 className={styles['header--title']}>Verdaccio</h1>
          <p className={styles['header--subtitle']}>
            <Translate>A lightweight Node.js private proxy registry</Translate>
          </p>
          <div className={styles['header--links']}>
            <a href="https://github.com/verdaccio/verdaccio" className="link-secondary">
              GITHUB
            </a>
            <Link to={useBaseUrl('/docs/what-is-verdaccio')} className="link-primary">
              <Translate>GET STARTED</Translate>
            </Link>
            <a
              href="https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md"
              className="link-secondary"
            >
              <Translate>CONTRIBUTE</Translate>
            </a>
          </div>
        </div>
        <div className={styles['header--m-2']}>
          <Command
            command="npm install --global verdaccio"
            alt={translate({ message: 'NPM command to install Verdaccio' })}
          />
        </div>
        <div className={styles['header--node-congress-banner']}>          
          <a href="https://nodecongress.com/" target="_blank">
            <p>Don't miss the next <b>online and free</b> Verdaccio talk at Node Congress 2022
            <br/>
              18th February, 18:15 - 19:15 (CET) 
            <br/>
            <b>"Five Ways of Taking Advantage of Verdaccio, Your Private and Proxy Node.js Registry"</b>
            </p>
            <img src="https://cdn.verdaccio.dev/website/node-congress.svg" width="200px"/>
          </a>
        </div>
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
