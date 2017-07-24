import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';

import Header from './components/Header';
import Home from './modules/home';
import Detail from './modules/detail';

const RouterApp = () => {
  return (
    <Router>
      <div>
        <Header/>
        <div className="container">
          <Switch>
            <Route exact path="/(search/:keyword)?" component={ Home } />
            <Route path="/detail/:package*" component={Detail} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default RouterApp;
