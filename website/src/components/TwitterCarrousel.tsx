import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import React, { useCallback, useRef, useState } from 'react';
import { Tweet } from 'react-twitter-widgets';

import Spinner from './Spinner';
import styles from './TwitterCarrousel.module.scss';
import useClampedIsInViewport from './hooks/useClampedIsInViewport';

const Carrousel = ({ data }: { data: string[][] }): React.ReactElement => {
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
    [page]
  );

  return (
    <div ref={targetRef}>
      {loading && <Spinner />}
      {isIn && (
        <div className={clsx(styles.twitterCarrousel, loading && 'opacity-0')}>
          {data[page].map((tweetId) => (
            <Tweet
              options={{
                theme: 'light',
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
