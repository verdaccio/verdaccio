/**
 * @prettier
 * @flow
 */

/* eslint react/jsx-max-depth: 0 */

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import CardContent from '@material-ui/core/CardContent/index';

import { DetailContextConsumer } from '../../pages/version';
import { Content, CardWrap, Heading, Tags, Tag } from './styles';

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
    return <Tag clickable={true} component={'div'} label={tagText} onClick={this.handleOnClick} />;
  }

  handleOnClick = () => {
    const { name } = this.state;
    const { onLoading, history } = this.props;

    onLoading();
    history.push(`/-/web/detail/${name}`);
  };
}

const WrappDepDetail = withRouter(DepDetail);

class DependencyBlock extends Component<any, any> {
  renderTags = (deps: any, enableLoading: any) =>
    deps.map(dep => {
      const [name, version] = dep;

      return <WrappDepDetail key={name} name={name} onLoading={enableLoading} version={version} />;
    });

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
                <Heading variant={'subheading'}>{title}</Heading>
                <Tags>{this.renderTags(deps, enableLoading)}</Tags>
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
  renderDependencies({ packageMeta }) {
    const { latest } = packageMeta;
    const { dependencies, devDependencies, peerDependencies } = latest;

    return (
      <Content>
        <Fragment>
          {dependencies && <DependencyBlock dependencies={dependencies} title={'Dependencies'} />}
          {devDependencies && <DependencyBlock dependencies={devDependencies} title={'DevDependencies'} />}
          {peerDependencies && <DependencyBlock dependencies={peerDependencies} title={'PeerDependencies'} />}
        </Fragment>
      </Content>
    );
  }
}

export default Dependencies;
