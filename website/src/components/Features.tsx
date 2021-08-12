import React from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Link } from '@docusaurus/router';
import FeatureCard from './FeatureCard';

import styles from './Features.module.scss';

const FEATURES = [
  {
    image: '/img/features/lock.svg',
    title: translate({ message: 'Use private packages' }),
    subtitle: translate({
      message:
        'If you want to use all benefits of npm package system in your company without sending all the code to the public, and use your private packages just as easy as public ones.',
    }),
  },
  {
    image: '/img/features/link.svg',
    title: translate({ message: 'Link multiple registries' }),
    subtitle: translate({
      message:
        'If you use multiple registries in your organization and need to fetch packages from multiple sources in one single project, you can chain multiple registries and fetch from one single endpoint.',
    }),
  },
  {
    image: '/img/features/box.svg',
    title: translate({ message: 'Cache npmjs.org registry' }),
    subtitle: translate({
      message:
        'If you have more than one server which you want to install packages from, you might want to use this to decrease latency and provide limited failover.',
    }),
  },
  {
    image: '/img/features/override.svg',
    title: translate({ message: 'Override public packages' }),
    subtitle: translate({
      message:
        'If you want to use a modified version of some 3rd-party package, you can publish your version locally under the same name.',
    }),
  },
];

const Features = (): React.ReactElement => (
  <section className={styles.features}>
    <div className={styles['features--wrap']}>
      {FEATURES.map(({ image, title, subtitle }) => (
        <FeatureCard key={title} image={useBaseUrl(image)} title={title} subtitle={subtitle} />
      ))}
    </div>
    <div className={styles.linkFeatures}>
      <Link to={useBaseUrl('/docs/configuration')} className="link-primary">
        <Translate>Discover more features</Translate>
      </Link>
    </div>
  </section>
);

export default Features;
