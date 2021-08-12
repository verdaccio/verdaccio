import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Link } from '@docusaurus/router';
import { Follow } from 'react-twitter-widgets';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Command from './Command';

import styles from './Header.module.scss';

const Header = (): React.ReactElement => {
  const { i18n } = useDocusaurusContext();
  return (
    <div className={styles.header}>
      <div className={styles['header--wrap']}>
        <img className={styles['header--imageLogo']} src={useBaseUrl('/img/verdaccio-tiny.svg')} alt="Verdaccio Logo" />
        <div className={styles['header--mt-2']}>
          <h1 className={styles['header--title']}>Verdaccio</h1>
          <p className={styles['header--subtitle']}>
            <Translate>A lightweight private npm proxy registry</Translate>
          </p>
          <div className={styles['header--links']}>
            <a href="https://github.com/verdaccio/verdaccio" className="link-secondary">
              GITHUB
            </a>
            <Link to={useBaseUrl('/docs/what-is-verdaccio')} className="link-primary">
              <Translate>GET STARTED</Translate>
            </Link>
            <a href="https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md" className="link-secondary">
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
      </div>
      <div className={styles['header--absolute-links']}>
        <div>
          <Follow username="verdaccio_npm" options={{ size: 'large', dnt: true, lang: i18n.currentLocale }} />
        </div>
      </div>
    </div>
  );
};

export default Header;
