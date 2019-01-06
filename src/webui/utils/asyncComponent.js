import React from 'react';

export function asyncComponent(getComponentFunc) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = {Component: this.getComponent()};

    getComponent() {
      if (!AsyncComponent.Component) {
        getComponentFunc().then(({default: Component}) => {
          AsyncComponent.Component = Component;
          return Component;
        });
      }

      return AsyncComponent.Component;
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
