
import React from 'react';
import PropTypes from 'prop-types';
import {preventXSS} from '../../utils/url';

import 'github-markdown-css';

const Readme = (props) => {
  const encodedReadme = preventXSS(props.readMe);

  return <div className="markdown-body" dangerouslySetInnerHTML={{__html: encodedReadme}}/>;
};

Readme.propTypes = {
  readMe: PropTypes.string.isRequired
};

export default Readme;
