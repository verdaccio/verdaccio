import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Item from '../Item/Item';

const ListItems = styled.ul`
	margin: 0px;
	padding: 0px;
`;

class List extends React.Component {

	render() {
			return (
				<ListItems className="list-container">
						{ this.props.packages.map((item)=> {
							return (<Item key={item.name} pkg={item}/>);
						})}
				</ListItems>
			);
	}
}

List.propTypes = {
  packages: PropTypes.array.isRequired,
};

export default List;
