
import React from 'react';
import PropTypes from 'prop-types';

import classes from './search.scss';

const noSubmit = (e) => {
  e.preventDefault();
};

const Search = (props) => {
    return (
      <form autoComplete="off" onSubmit={noSubmit}>
        <input
          name="search-box"
          type="text"
          placeholder={props.placeHolder}
          className={classes.searchBox}
          onChange={props.handleSearchInput}
          autoComplete="off"
        />
      </form>
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
