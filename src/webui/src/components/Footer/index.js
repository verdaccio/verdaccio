import React from 'react';

import classes from './footer.scss';
import logo from './logo.svg';
import earth from './earth.svg';

// Vectors from Twitter Emoji (Open Source)
import brazilFlag from './flags/brazil-1f1e7-1f1f7.svg';
import chinaFlag from './flags/china-1f1e8-1f1f3.svg';
import indiaFlag from './flags/india-1f1ee-1f1f3.svg';
import nicaraguaFlag from './flags/nicaragua-1f1f3-1f1ee.svg';
import pakistanFlag from './flags/pakistan-1f1f5-1f1f0.svg';
import spainFlag from './flags/spain-1f1ea-1f1f8.svg';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.handleEarthIconClick = this.handleEarthIconClick.bind(this);
    this.state = {
      showAuthorsGeographic: false
    };
  }

  handleEarthIconClick() {
    this.setState({
      showAuthorsGeographic: true
    });
  }

  render() {
    return (
      <div className={classes.wrap}>
        <footer
          className={`container ${classes.footer} ${this.state.showAuthorsGeographic && classes.showAuthorsGeographic}`}
        >
          <span>Made with&nbsp;</span>
          <span>❤</span>
          <span>&nbsp;on</span>
          <img className={`${classes.earth} emoji`} src={earth} alt="Earth" onClick={this.handleEarthIconClick}/>
          <div className={classes.tooltip}>
            <span title="Brazil">
              <img src={brazilFlag} alt="" className="emoji"/>
            </span>
            <span title="China">
              <img src={chinaFlag} alt="" className="emoji"/>
            </span>
            <span title="India">
              <img src={indiaFlag} alt="" className="emoji"/>
            </span>
            <span title="Nicaragua">
              <img src={nicaraguaFlag} alt="" className="emoji"/>
            </span>
            <span title="Pakistan">
              <img src={pakistanFlag} alt="" className="emoji"/>
            </span>
            <span title="Spain">
              <img src={spainFlag} alt="" className="emoji"/>
            </span>
          </div>
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
