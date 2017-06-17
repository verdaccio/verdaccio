import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import request from 'superagent';
import _ from 'lodash';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

import Readme from '../Readme/Readme';

const ItemWrap = styled.li`
  padding: 9px 10px;
  border-bottom: 1px solid #E7E7E7;
  list-style-type: none;
  &:nth-child(even) {
    background: #f3f3f3;
  }
`;

const Description = styled.p`
    margin: 0 0 0 18px;
    font-size: 13px;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  line-height: 10px;
`;

const GroupTitle = styled.div`
  margin: 0 5px;
  flex-basis: 85%;
`;

const Author = styled.div`
  flex-basis: 15%;
  text-align: center;
  padding: 5px 0;
`;

const Small = styled.small`
  color: #666;
`;

const Title = styled.h4`
  margin: 0px;
  margin-right: 10px;
`;

const Link = styled.a`
  color: #cc3d33;
  fill: currentColor;
  text-decoration: none;
`;

class Item extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.displayReadme = this.displayReadme.bind(this);
  }

  /**
   *
   * @param {*} event
   */
  displayReadme(event) {
    event.preventDefault();
    if (!this.state.open) {
      this.req = request
      .get(this._buildUrl())
      .set('Content-Type', 'text/html; charset=utf8')
      .end((err, res) => {
        if (_.isNil(err) === false) {
          this.setState({
            open: true,
            readme: 'No readme available',
          });
        } else {
          this.setState({
            open: true,
            readme: res.text,
          });
        }
      });
    } else {
      this.setState({
        open: false,
      });
    }
  }

  _buildUrl() {
    return `/-/readme/${encodeURIComponent(this.props.pkg.name)}/${encodeURIComponent(this.props.pkg.version)}`;
  }

  render() {
    const author = this.props.pkg.author ? this.props.pkg.author.name : '';
    return (
    <ItemWrap>
      <div>
        <Group>
          <GroupTitle>
              <Link href={'#'}>
                <Group>
                <span>
                  { this.state.open ? <ArrowDown/> : <ArrowRight/> }
                </span>
                  <Title onClick={this.displayReadme}>
                    {this.props.pkg.name}
                  </Title>
                  <Small>
                    { `v${this.props.pkg.version}` }
                  </Small>
                </Group>
              </Link>
          </GroupTitle>
          <Author>
            <Small>
              { `By: ${_.isNil(author) ? 'Not available' : author}` }
            </Small>
          </Author>
        </Group>
      </div>
      <Description>
        {this.props.pkg.description}
      </Description>
      { this.state.open ? <Readme html={ this.state.readme }/> : '' }
    </ItemWrap>
    );
  }
}

Item.propTypes = {
  pkg: PropTypes.object.isRequired,
};


export default Item;
