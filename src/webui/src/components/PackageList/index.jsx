import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'

import Package from '../Package';

const NoPackage = styled.li`
  text-align: center;
  line-height: 3;
  font-size: 20px;
  color: lightgrey;
`

const PackageRow = styled.li`
  border-bottom: 1px solid #e4e8f1;
  list-style: none;
`

const PackageContainer = styled.ul`
  margin: 0;
  padding: 0;
`

export default class PackageList extends React.Component {
  static propTypes = {
    packages: PropTypes.array
  }

  renderList () {
    return this.props.packages.map((pkg, i)=> (
        <PackageRow key={i}><Package package={pkg} /></PackageRow>
    ))
  }

  render () {
    return (
        <PackageContainer>
          {
            this.props.packages.length ?
                this.renderList():
                <NoPackage>No Package Available</NoPackage>
          }
        </PackageContainer>
    )
  }
}
