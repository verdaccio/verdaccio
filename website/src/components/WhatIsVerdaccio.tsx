import React from 'react';
import Translate from '@docusaurus/Translate';
import { Link } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Divider from './Divider';

import styles from './WhatIsVerdaccio.module.scss';

const WhatIs = (): React.ReactElement => (
  <section className={styles.whatIs}>
    <h1 className={styles['whatIs--title']}>
      <Translate values={{ verdaccio: <i>Verdaccio</i> }}>{'What is {verdaccio}?'}</Translate>
    </h1>
    <p className={styles['whatIs--p']}>
      <Translate>
        Verdaccio is a simple, zero-config-required local private NPM registry. No need for an entire database just to
        get started. Verdaccio comes out of the box with its own tiny database, and the ability to proxy other
        registries (eg. npmjs.org), also introduces caching the downloaded modules along the way. For those who are
        looking to extend their storage capabilities, Verdaccio supports various community-made plugins to hook into
        services such as Amazon&apos;s S3, Google Cloud Storage or create your own plugin.
      </Translate>
    </p>
    <Link to={useBaseUrl('/docs/installation')} className="link-primary">
      <Translate>Dive into Verdaccio</Translate>
    </Link>
    <Divider />
  </section>
);

export default WhatIs;
