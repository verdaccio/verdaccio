/**
 * @prettier
 * @flow
 */

/* eslint react/jsx-max-depth: 0 */

import React, { Component, Fragment } from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import CardContent from '@material-ui/core/CardContent/index';
// import Avatar from '@material-ui/core/Avatar/index';
import Chip from '@material-ui/core/Chip/index';
// import Grid from '@material-ui/core/Grid/index';
import { Content, Tags, Tag, CardWrap } from './styles';
import Typography from '@material-ui/core/Typography/index';

class DepDetail extends Component<any, any> {
  render() {
    const { name, version } = this.props;
    const tagText = `${name}@${version}`;

    return (
      <Tag>
        <Chip component={'div'} label={tagText} />
      </Tag>
    );
  }
}

class DependencyBlock extends Component<any, any> {
  render() {
    const { dependencies, title } = this.props;
    const deps = Object.entries(dependencies);

    return (
      <CardWrap>
        <CardContent>
          <Typography color={'headline'} gutterBottom={true}>
            {title}
          </Typography>
          <Tags>
            {deps.map(dep => {
              const [name, version] = dep;

              return <DepDetail key={name} name={name} version={version} />;
            })}
          </Tags>
        </CardContent>
      </CardWrap>
    );
  }
}

class Dependencies extends Component<any, any> {
  state = {
    tabPosition: 0,
  };

  render() {
    return (
      <DetailContextConsumer>
        {packageMeta => {
          return this.renderDependencies(packageMeta);
        }}
      </DetailContextConsumer>
    );
  }

  // $FlowFixMe
  renderDependencies = ({ packageMeta }) => {
    const { latest } = packageMeta;
    console.log('renderDependencies', latest);
    const { dependencies, devDependencies, peerDependencies } = latest;
    console.log('dependencies', dependencies);
    console.log('devDependencies', devDependencies);

    return (
      <Content>
        <Fragment>
          {dependencies && <DependencyBlock dependencies={dependencies} title={'Dependencies'} />}
          {devDependencies && <DependencyBlock dependencies={devDependencies} title={'DevDependencies'} />}
          {peerDependencies && <DependencyBlock dependencies={peerDependencies} title={'PeerDependencies'} />}
        </Fragment>
      </Content>
    );
  };
}

export default Dependencies;
