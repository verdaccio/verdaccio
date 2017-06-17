import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App.js';
import './style.css';

const state = window.__INITIAL_STATE;
ReactDOM.render(<App {...state} />, document.getElementById('root'));
