import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextField from 'material-ui/TextField';

const SearchContainer = styled.div`
  margin-top: 20px;
`;

const styles = {
  flex: {
    display: 'flex',
  },
  fullWidth: {
    width: '100%',
  },
};

class Search extends React.Component {

  constructor() {
    super();
    this.state = {
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const keyword = event.target.value.trim();
    this.setState({
      value: keyword,
    });
    this.props.updatePackages(keyword);
  }

  render() {
    return (
      <SearchContainer className="search-box">
         <TextField
            style={styles.fullWidth}
            hintText="Search for packages"
            fullWidth={true}
            value={this.state.value}
            onChange={this.handleChange}
          />
      </SearchContainer>
    );
  }
}

Search.propTypes = {
  updatePackages: PropTypes.func.isRequired,
};

export default Search;

