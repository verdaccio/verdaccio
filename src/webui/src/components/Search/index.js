
import React from 'react';
import PropTypes from 'prop-types';

import classes from './search.scss';

const Search = (props) => {
    return (
      <input
        type="text"
        placeholder={props.placeHolder}
        className={ classes.searchBox }
        onChange={ props.handleSearchInput }
      />
    );
};

Search.defaultProps = {
  placeHolder: 'Type to search...'
};

Search.propTypes = {
  handleSearchInput: PropTypes.func.isRequired,
  placeHolder: PropTypes.string,
};

export default Search;
