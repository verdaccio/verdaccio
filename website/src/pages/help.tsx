import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Follow } from 'react-twitter-widgets';
import Translate from '@docusaurus/Translate';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './help.module.scss';

const Help = (): React.ReactElement => {
  const { i18n } = useDocusaurusContext();
  return (
    <Layout
      title="Help"
      description="Verdaccio Help, where you'll find all the links to find help and assistance from Verdaccio contributors"
    >
      <div className={styles.wrapper}>
        <header>
          <h1>
            <Translate>Need help?</Translate>
          </h1>
          <p>
            <Translate>This project is maintained by the Verdaccio community.</Translate>
          </p>
        </header>
        <main className={clsx(styles.grid, styles['items-center'], styles['grid-2-1fr'])}>
          <div className={clsx(styles.grid, styles['mt-2'], styles['grid-columns-fill'], styles['gap-2'])}>
            {SUPPORT_LINKS(i18n.currentLocale).map((supportSections) => (
              <article className={styles['article-card']} key={supportSections.title}>
                <h2>{supportSections.title}</h2>
                <p>{supportSections.content}</p>
              </article>
            ))}
          </div>
          <iframe
            className={styles['m-auto']}
            title="Discord Widget of Verdaccio"
            src="https://discord.com/widget?id=388674437219745793&theme=dark"
            width="350"
            height="500"
            frameBorder="0"
          />
        </main>
      </div>
    </Layout>
  );
};

export default Help;

const SUPPORT_LINKS = (lang: string) => [
  {
    title: 'Browse Docs',
    content: (
      <Translate
        values={{
          link: (
            <Link to={useBaseUrl('/docs/what-is-verdaccio')}>
              <Translate>documentation on this site</Translate>
            </Link>
          ),
        }}
      >
        {'Learn more about Verdaccio using the {link}'}
      </Translate>
    ),
  },
  {
    title: 'Twitter',
    content: (
      <Translate
        values={{
          follow: <Follow username="verdaccio_npm" options={{ showCount: false, dnt: true, lang }} />,
        }}
      >
        {'You can follow and contact us on {follow}'}
      </Translate>
    ),
  },
  {
    title: 'GitHub',
    content: (
      <Translate
        values={{
          link: (
            <a href="https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Aquestion+">
              <Translate>Question Database</Translate>
            </a>
          ),
        }}
      >
        {'If the documentation is not enough help, you can try browsing into our {link}'}
      </Translate>
    ),
  },
  {
    title: 'Stackoverflow',
    content: (
      <Translate
        values={{
          link: (
            <a href="https://stackoverflow.com/questions/tagged/verdaccio">
              <Translate>Stackoverflow Questions</Translate>
            </a>
          ),
        }}
      >
        {'Browse questions at Stackoverflow also could be useful {link}'}
      </Translate>
    ),
  },
  {
    title: 'Discord',
    content: (
      <Translate
        values={{
          link: <a href="https://discord.gg/T7gJmBM6nv">Discord</a>,
        }}
      >
        {'and also you can chat with the Verdaccio community at {link}'}
      </Translate>
    ),
  },
  {
    title: 'pnpm Chat',
    content: (
      <Translate
        values={{
          link: (
            <a href="https://discord.gg/PKwUpW">
              <Translate>Community Chat</Translate>
            </a>
          ),
        }}
      >
        {'If you have specific pnpm questions, join their community chat {link}'}
      </Translate>
    ),
  },
  {
    title: 'Yarn Chat',
    content: (
      <Translate
        values={{
          link: (
            <a href="https://discord.gg/x9F2jJ">
              <Translate>Community Chat</Translate>
            </a>
          ),
        }}
      >
        {'If you have specific yarn questions, join their community chat {link}'}
      </Translate>
    ),
  },
];
