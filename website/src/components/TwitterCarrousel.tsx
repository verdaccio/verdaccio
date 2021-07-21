import React, { useState, useRef, useCallback } from 'react';
import useThemeContext from '@theme/hooks/useThemeContext';
import { Tweet } from 'react-twitter-widgets';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { translate } from '@docusaurus/Translate';
import Spinner from './Spinner';
import useClampedIsInViewport from './hooks/useClampedIsInViewport';

import styles from './TwitterCarrousel.module.scss';

const Carrousel = ({ data }: { data: Array<Array<string>> }): React.ReactElement => {
  const { isDarkTheme } = useThemeContext();
  const { i18n } = useDocusaurusContext();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const ref = useRef<{ maxPage: number; minPage: number }>({
    maxPage: data.length - 1,
    minPage: 0,
  });
  const [isIn, targetRef] = useClampedIsInViewport({ threshold: 50 });

  const onClickCircle = useCallback(
    (pageToGo: number) => {
      if (page === pageToGo) return;
      setPage(pageToGo);
      setLoading(true);
    },
    [page],
  );

  return (
    <div ref={targetRef}>
      {loading && <Spinner />}
      {isIn && (
        <div className={clsx(styles.twitterCarrousel, loading && 'opacity-0')}>
          {data[page].map((tweetId) => (
            <Tweet
              options={{
                theme: isDarkTheme ? 'dark' : 'light',
                lang: i18n.currentLocale,
                dnt: true,
                align: 'center',
                conversation: 'none',
                cards: 'hidden',
                height: '100%',
              }}
              onLoad={() => setLoading(false)}
              key={tweetId}
              tweetId={tweetId}
            />
          ))}
        </div>
      )}
      <div className={styles.circleWrap}>
        {[...Array(ref.current.maxPage + 1).keys()].map((it) => (
          <button
            disabled={loading}
            aria-label={
              translate({
                message: 'Change to Tweet page number ',
              }) + it
            }
            type="button"
            onKeyPress={(event) => event.key === 'Enter' && onClickCircle(it)}
            onClick={() => onClickCircle(it)}
            key={it}
            className={clsx(styles.circle, it === page && styles['circle--selected'])}
          />
        ))}
      </div>
    </div>
  );
};

export default Carrousel;
