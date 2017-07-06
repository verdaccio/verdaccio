import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import 'normalize.css'

import 'element-theme-default'
import { i18n } from 'element-react'
import locale from 'element-react/src/locale/lang/en'
i18n.use(locale);

import Header from './components/Header'
import Home from './modules/home';
import Detail from './modules/detail';

import './styles/global.scss'

export default class App extends React.Component {
  render() {
    return (
        <Router>
          <div>
            <Header/>
            <div className="container">
              <Switch>
                <Route exact path="/(search/:keyword)?" component={ Home } />
                <Route path="/detail/:package" component={ Detail } />
              </Switch>
            </div>
          </div>
        </Router>
    );
  }
}
