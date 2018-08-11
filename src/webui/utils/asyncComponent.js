import React from 'react';

export function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = {Component: AsyncComponent.Component};

    UNSAFE_componentWillMount() {
      if (!this.state.Component) {
        getComponent().then(({default: Component}) => {
          AsyncComponent.Component = Component;
          this.setState({Component});
        });
      }
    }
    render() {
      const {Component} = this.state;
      if (Component) {
        return <Component {...this.props} />;
      }
      return null;
    }
  };
}
