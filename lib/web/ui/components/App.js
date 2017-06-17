import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import injectTapEventPlugin from 'react-tap-event-plugin';
import request from 'superagent';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {green100, green500, green700} from 'material-ui/styles/colors';

import Header from './Header/Header';
import Search from './Search/Search';
import List from './List/List';

injectTapEventPlugin();

if (process.env.BROWSER) {
	require('./browser.css');
}

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: green100,
  },
}, {
  avatar: {
    borderColor: null,
  },
  userAgent: false,
});

class App extends React.Component {

  constructor(props) {
    super();
    this.state = {
      packages: props.packages,
      frontPackages: props.packages,
      req: null,
    };
    this.updatePackages = this.updatePackages.bind(this);
  }

  updatePackages(keyword) {
    if (keyword !== '') {
      if (this.req) {
        this.req.abort();
      }
      this.req = request.get(`/-/search/${keyword}`)
      .end((err, res) => {
        if(_.isNil(err) === false) {
          this.setState({
            packages: [],
          });
        } else {
          this.setState({
            packages: res.body,
          });
        }
      });
    } else {
      if (this.req) {
        this.req.abort();
      }
      this.setState({
        packages: this.state.frontPackages,
      });
    }
  }

  render() {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <main>
            <Header baseUrl={this.props.baseUrl} username={this.props.username}/>
            <div className="wrapper">
              <Search updatePackages={this.updatePackages}/>
              <List packages={this.state.packages}/>
            </div>
          </main>
        </MuiThemeProvider>
      );
  }
}

App.propTypes = {
  packages: PropTypes.array.isRequired,
  baseUrl: PropTypes.string.isRequired,
  username: PropTypes.string,
};

export default App;
