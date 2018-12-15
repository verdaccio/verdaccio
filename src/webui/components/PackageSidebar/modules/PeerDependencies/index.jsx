import React from 'react';
import PropTypes from 'prop-types';
import Dependencies from '../Dependencies';

export const TITLE = 'Peer Dependencies';

const PeerDependencies = ({dependencies = {}, title = TITLE}) => {
  return (
    <Dependencies dependencies={dependencies} title={title} />
  );
};

PeerDependencies.propTypes = {
  dependencies: PropTypes.object,
  title: PropTypes.string,
};

export default PeerDependencies;
