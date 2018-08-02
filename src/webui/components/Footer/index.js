import React, {Component} from 'react';

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

export default class Footer extends Component {
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
            <img src={brazilFlag} alt="Brazil" title="Brazil" className="emoji"/>
            <img src={chinaFlag} alt="China" title="China" className="emoji"/>
            <img src={indiaFlag} alt="India" title="India" className="emoji"/>
            <img src={nicaraguaFlag} alt="Nicaragua" title="Nicaragua" className="emoji"/>
            <img src={pakistanFlag} alt="Pakistan" title="Pakistan" className="emoji"/>
            <img src={spainFlag} alt="Spain" title="Spain" className="emoji"/>
          </div>
          {/* Countries are order by alphabets */}

          <div className={classes.right}>
            Powered by&nbsp;
            { /* Can't switch to HTTPS due it hosted on GitHub Pages */ }
            <a href="http://www.verdaccio.org/">
              <img className={classes.logo} src={logo} alt="Verdaccio" title="Verdaccio"/>
            </a>
            &nbsp;/&nbsp;
            {__APP_VERSION__}
            </div>
        </footer>
      </div>
    );
  }
}
