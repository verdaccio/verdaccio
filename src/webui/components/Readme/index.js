
import React from 'react';
import PropTypes from 'prop-types';

import 'github-markdown-css';

const Readme = (props) => {
  return <div className="markdown-body" dangerouslySetInnerHTML={{__html: props.readMe}}/>;
};

Readme.propTypes = {
  readMe: PropTypes.string.isRequired
};

export default Readme;
