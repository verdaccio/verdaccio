import React from 'react';

import classes from './footer.scss';
import logo from './logo.svg';

export default class Footer extends React.Component {
  componentDidMount() {
    // Scripts inserted at top of `template/index.html`
    if (typeof window.twemoji === 'object' && typeof window.twemoji.parse === 'function') {
      window.twemoji.parse(document.getElementById('global-footer'), {
        // JSDeliver is the fattest open source cdn in all region, see https://www.jsdelivr.com/network
        base: 'https://cdn.jsdelivr.net/npm/twemoji@2.5.0/2/',
        ext: '.svg',
        size: 'svg'
      });
    }
  }

  render() {
    return (
      <div className={classes.wrap}>
        <footer id="global-footer" className={`container ${classes.footer}`}>
          <span>Made with&nbsp;</span>
          <span>❤</span>
          <span>&nbsp;in</span>
          <span data-type="flags" title="Brazil">🇧🇷</span>
          <span data-type="flags" title="China">🇨🇳</span>
          <span data-type="flags" title="India">🇮🇳</span>
          <span data-type="flags" title="Nicaragua">🇳🇮</span>
          <span data-type="flags" title="Pakistan">🇵🇰</span>
          <span data-type="flags" title="Spain">🇪🇸</span>
          {/* Countries are order by alphabets */}

          <div className={classes.right}>
            Powered by&nbsp;
            <img className={classes.logo} src={logo} alt="Verdaccio" title="Verdaccio"/>
            &nbsp;/&nbsp;
            {__APP_VERSION__}
            </div>
        </footer>
      </div>
    );
  }
}
