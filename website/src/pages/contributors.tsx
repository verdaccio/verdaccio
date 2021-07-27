import React from 'react';
import Layout from '@theme/Layout';

import Translate, { translate } from '@docusaurus/Translate';
import styles from './contributors.module.scss';

const Contributors = (): React.ReactElement => (
  <Layout title="Contributors" description="Verdaccio Contributors, thanks to the community Verdaccio keeps running">
    <div className={styles.wrapper}>
      <header>
        <h1>
          <Translate>Contributors</Translate>
        </h1>
        <p>
          <Translate>
            Thanks to everyone involved in maintaining and improving Verdaccio, this page is to thank you every minute
            spent here.
          </Translate>{' '}
          <b>
            <Translate>Thanks</Translate>
          </b>
        </p>
      </header>
      <main>
        <div className={styles['mt-2']}>
          <iframe
            src="https://verdacciocontributors.gtsb.io/"
            frameBorder="0"
            scrolling="yes"
            title={translate({ message: 'Contributors of Verdaccio' })}
            width="100%"
            className={styles['h-screen']}
          />
        </div>
      </main>
    </div>
  </Layout>
);
export default Contributors;
