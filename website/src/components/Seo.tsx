import { graphql, useStaticQuery } from 'gatsby';
import keywordExtractor from 'keyword-extractor';
import PropTypes from 'prop-types';
import React, { FC } from 'react';
import Helmet from 'react-helmet';

const Seo: FC<SeoProps> = ({ desc, title }) => {
  const {
    site: {
      siteMetadata: { author, desc: mainDesc, siteName, title: mainTitle, url },
    },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            author
            desc
            siteName
            title
            url
          }
        }
      }
    `
  );

  /* eslint-disable no-param-reassign */
  title = title ? `${title} — ${mainTitle}` : mainTitle;
  desc = desc ? desc : mainDesc;
  /* eslint-enable no-param-reassign */

  return (
    <Helmet htmlAttributes={{ lang: 'ru' }}>
      <meta charSet="utf-8" />
      <meta
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        name="viewport"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        rel="stylesheet"
      />
      <title>{title}</title>
      <meta content={desc} name="description" />
      <meta content={desc} property="og:description" />
      <meta content={title} property="og:title" />
      <meta content="website" property="og:type" />
      <meta content={url} property="og:url" />
      <meta content={siteName} property="og:site_name" />
      <meta content="summary" name="twitter:card" />
      <meta content={author} name="twitter:creator" />
      <meta content={title} name="twitter:title" />
      <meta content={desc} name="twitter:description" />
      <meta content="index,follow" name="robots" />
      <meta
        content={keywordExtractor
          // eslint-disable-next-line @typescript-eslint/camelcase, camelcase
          .extract(desc, { remove_duplicates: true })
          .join(',')}
        name="keywords"
      />
    </Helmet>
  );
};

Seo.propTypes = {
  desc: PropTypes.string,
  title: PropTypes.string,
};

Seo.defaultProps = {
  desc: '',
  title: '',
};

export interface SeoProps {
  desc?: string;
  title?: string;
}

export default Seo;
