/**
 * @prettier
 * @flow
 */

/* eslint react/jsx-max-depth: 0 */

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import { DetailContextConsumer } from '../../pages/version/index';
import CardContent from '@material-ui/core/CardContent/index';
import Chip from '@material-ui/core/Chip/index';
import { Content, Tags, Tag, CardWrap } from './styles';
import Typography from '@material-ui/core/Typography/index';

class DepDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    const { name, version } = this.props;

    this.state = {
      name,
      version,
    };
  }

  render() {
    const { name, version } = this.state;
    const tagText = `${name}@${version}`;

    return (
      <Tag>
        <Chip clickable={true} component={'div'} label={tagText} onClick={this.handleOnClick} />
      </Tag>
    );
  }

  handleOnClick = () => {
    const { name } = this.state;
    const { onLoading, history } = this.props;

    onLoading();
    history.push(`/version/${name}`);
  };
}

const WrappDepDetail = withRouter(DepDetail);

class DependencyBlock extends Component<any, any> {
  render() {
    const { dependencies, title } = this.props;
    const deps = Object.entries(dependencies);

    return (
      // $FlowFixMe
      <DetailContextConsumer>
        {({ enableLoading }) => {
          return (
            <CardWrap>
              <CardContent>
                <Typography gutterBottom={true} variant={'headline'}>
                  {title}
                </Typography>
                <Tags>
                  {deps.map(dep => {
                    const [name, version] = dep;

                    return <WrappDepDetail key={name} name={name} onLoading={enableLoading} version={version} />;
                  })}
                </Tags>
              </CardContent>
            </CardWrap>
          );
        }}
      </DetailContextConsumer>
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
    // console.log('renderDependencies', latest);
    const { dependencies, devDependencies, peerDependencies } = latest;
    // console.log('dependencies', dependencies);
    // console.log('devDependencies', devDependencies);

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
