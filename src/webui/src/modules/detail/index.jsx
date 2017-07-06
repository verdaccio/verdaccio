import React from 'react';
import API from '../../../utils/API';
import { Loading } from 'element-react';
import PropTypes from 'prop-types';

import classes from './detail.scss';
import 'github-markdown-css';

export default class Detail extends React.Component {
  static propTypes = {
    match: PropTypes.object
  }

  state = {
    readMe: ''
  }

  async componentDidMount() {
     try {
       let resp = await API.get(`package/readme/${this.props.match.params.package}`);
       this.setState({
         readMe: resp.data
       });
     } catch (err) {
       this.setState({
         readMe: 'Failed to load readme...'
       });
     }
  }

  renderReadMe () {
    if (this.state.readMe) {
      return (
          <div className="markdown-body" dangerouslySetInnerHTML={{__html: this.state.readMe}}/>
      )
    } else {
      return (
          <Loading text="Loading..." />
      )
    }
  }

  render() {
    return (
        <div>
          <h1 className={ classes.title }>Package: { this.props.match.params.package }</h1>
          <hr/>
          {this.renderReadMe()}
        </div>
    )
  }
}
