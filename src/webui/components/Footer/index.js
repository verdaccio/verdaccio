import React, {Component} from 'react';

import classes from './footer.scss';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className={classes.wrap}>
        <footer className={`container ${classes.footer}`}>
        </footer>
      </div>
    );
  }
}
