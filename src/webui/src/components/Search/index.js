
import React from 'react';
import PropTypes from 'prop-types';

import classes from './search.scss';

const Search = (props) => {
    return (
      <input
        type="text"
        placeholder="Type to search..."
        className={ classes.searchBox }
        onChange={ props.handleSearchInput }
      />
    );
};

Search.propTypes = {
  handleSearchInput: PropTypes.func.isRequired
};

export default Search;
