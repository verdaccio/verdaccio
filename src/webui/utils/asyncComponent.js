import React from 'react';

export function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = {Component: AsyncComponent.Component};

    componentDidMount() {
      const { Component } = this.state;
      if (!Component) {
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
