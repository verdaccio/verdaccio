import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React from 'react';
import ReactPlayer from 'react-player/youtube'

import Feature from '../components/Features';
import Header from '../components/Header';
import PackageManagers from '../components/PackageManagers';
import Testimonial from '../components/Testimonials';
import UsedBy from '../components/UsedBy';
import Wave from '../components/Wave';
import WhatIsVerdaccio from '../components/WhatIsVerdaccio';
import styles from './index.module.scss';

const Home = (): React.ReactElement => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.tagline} description={siteConfig.customFields.description}>
      <header className={styles.header}>
        <Wave />
        <Header />
        
      </header>
      <main className={styles.main}>
        <UsedBy />        
        <WhatIsVerdaccio />
        <Feature />
        <PackageManagers />
        <Testimonial />
      </main>
    </Layout>
  );
};

export default Home;
