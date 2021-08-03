import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, { translate } from '@docusaurus/Translate';
import Divider from './Divider';
import Command from './Command';

import styles from './PackageManagers.module.scss';

const PackageManagers = (): React.ReactElement => (
  <section className={styles.packageManagers}>
    <div className={styles['packageManagers--wrap']}>
      <div className={styles['packageManagers--images']}>
        <a href="https://www.npmjs.com/">
          <img
            loading="lazy"
            alt="Npm logo"
            className={styles['packageManagers--logo']}
            src={useBaseUrl('/img/sponsors/npm.png')}
          />
        </a>
        <a href="https://yarnpkg.com/">
          <img
            loading="lazy"
            alt="Yarn logo"
            className={styles['packageManagers--logo']}
            src={useBaseUrl('/img/sponsors/yarn.png')}
          />
        </a>
        <a href="https://pnpm.io/">
          <img
            loading="lazy"
            alt="Pnpm logo"
            className={styles['packageManagers--logo']}
            src={useBaseUrl('/img/sponsors/pnpm.svg')}
          />
        </a>
      </div>
      <h2>
        <Translate>Popular npm clients are supported</Translate>
      </h2>
      <Divider spacer={1} />
      <p>
        <Translate
          values={{
            npm: <b>npm</b>,
            yarn: <b>yarn</b>,
            pnpm: <b>pnpm</b>,
          }}
        >
          {'Package managers such as {npm}, {yarn}, and {pnpm} are part of any development workflow.'}
        </Translate>
      </p>
    </div>
    <div className={styles['packageManagers--wrap']}>
      <div className={styles['packageManagers--commands']}>
        <Command
          alt="Docker usage of Verdaccio"
          image={useBaseUrl('/img/sponsors/docker.png')}
          command={translate({ message: 'docker pull verdaccio/verdaccio' })}
        />
        <Command
          alt="Verdaccio install inside Kubernetes Helm"
          image={useBaseUrl('/img/sponsors/k8s.png')}
          command={translate({ message: 'helm install verdaccio/verdaccio' })}
        />
      </div>
      <h2>
        <Translate>Making the DevOps work easy</Translate>
      </h2>
      <Divider spacer={1} />
      <p>
        <Translate
          values={{
            docker: <b>Docker</b>,
            helm: <b>Kubernetes Helm</b>,
          }}
        >
          {'We have an official {docker} image ready to use and {helm} support for easy deployment.'}
        </Translate>
      </p>
    </div>
  </section>
);

export default PackageManagers;
