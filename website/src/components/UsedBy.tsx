import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import React from 'react';

import SponsorImage from './SponsorImage';
import styles from './UsedBy.module.scss';

const UsedBy = (): React.ReactElement => (
  <section className={styles.usedBy}>
    <div className={styles['usedBy--main']}>
      <b>
        <Translate>SPONSORED BY</Translate>
      </b>
      {[
        {
          name: 'docker',
          image: useBaseUrl('/img/sponsors/docker.png'),
          url: 'https://hub.docker.com/r/verdaccio/verdaccio/tags/',
        },
        {
          name: 'crowdin',
          image: useBaseUrl('/img/sponsors/crowdin.svg'),
          url: 'https://crowdin.com',
        },
        {
          name: 'netlify',
          image: useBaseUrl('/img/sponsors/netlify.svg'),
          url: 'https://www.netlify.com',
        },
        {
          name: 'jetbrains',
          image: useBaseUrl('/img/sponsors/jetbrains.svg'),
          url: 'https://www.jetbrains.com',
        },
        {
          name: 'algolia',
          image: useBaseUrl('/img/sponsors/algolia.svg'),
          url: 'https://www.algolia.com',
        },
        {
          name: 'SheetJs',
          image: useBaseUrl('/img/sponsors/sheetjs.png'),
          url: 'https://sheetjs.com/',
        },
        {
          name: 'GatsbyJs',
          image: useBaseUrl('/img/sponsors/gatsbysvg.svg'),
          url: 'https://www.gatsbyjs.com/',
        },
        {
          name: 'pintura',
          image: useBaseUrl('/img/sponsors/pqina.svg'),
          url: 'https://pqina.nl/pintura/',
        },
      ].map((sponsor) => (
        <SponsorImage
          key={sponsor.name}
          name={sponsor.name}
          image={sponsor.image}
          url={sponsor.url}
        />
      ))}
    </div>
    <div className={styles['usedBy--main']}>
      <b>
        <Translate>USED BY</Translate>
      </b>
      {[
        {
          name: 'nx',
          image: useBaseUrl('/img/users/nx.svg'),
          url: 'https://nx.dev',
        },
        {
          name: 'pnpm',
          image: useBaseUrl('/img/users/pnpm.svg'),
          url: 'https://pnpm.io',
        },
        {
          name: 'vendure',
          image: useBaseUrl('/img/users/vendure.png'),
          url: 'https://www.vendure.io/',
        },
        {
          name: 'create-react-app',
          image: useBaseUrl('/img/users/create-react-app.svg'),
          url: ' https://create-react-app.dev/',
        },
        {
          name: 'Angular CLI',
          image: useBaseUrl('/img/users/angular.svg'),
          url: 'https://angular.io/cli',
        },
        {
          name: 'aurelia',
          image: useBaseUrl('/img/users/aurelia.svg'),
          url: 'https://aurelia.io/',
        },
        {
          name: 'Storybook',
          image: useBaseUrl('/img/users/storybook.svg'),
          url: 'https://storybook.js.org/',
        },
      ].map((sponsor) => (
        <SponsorImage
          key={sponsor.name}
          name={sponsor.name}
          image={sponsor.image}
          url={sponsor.url}
        />
      ))}
    </div>
    <p className={styles['usedBy--footer']}>
      <a
        href="https://github.com/verdaccio/verdaccio?tab=readme-ov-file#who-is-using-verdaccio"
        target="_blank"
      >
        <Translate>And many more...</Translate>
      </a>
    </p>
  </section>
);

export default UsedBy;
