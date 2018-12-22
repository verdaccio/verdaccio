import React from 'react';
import PropTypes from 'prop-types';
import Dependencies from '../Dependencies';

export const TITLE = 'Peer Dependencies';

const PeerDependencies = ({dependencies = {}, title = TITLE}) => {
  return (
    <Dependencies title={title} dependencies={dependencies} />
  );
};

PeerDependencies.propTypes = {
  dependencies: PropTypes.object,
  title: PropTypes.string
};

export default PeerDependencies;
