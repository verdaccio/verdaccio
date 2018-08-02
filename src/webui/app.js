import React from 'react';
import 'element-theme-default';
import {i18n} from 'element-react';
import locale from 'element-react/src/locale/lang/en';

i18n.use(locale);

import Route from './router';

import './styles/main.scss';
import 'normalize.css';

export default class App extends React.Component {
  render() {
    return (
      <Route />
    );
  }
}
