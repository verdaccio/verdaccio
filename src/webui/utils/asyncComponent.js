/**
 * @prettier
 */

import React from 'react';

export function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentDidMount() {
      const { Component } = this.state;
      if (!Component) {
        getComponent()
          .then(({ default: Component }) => {
            AsyncComponent.Component = Component;
            /* eslint react/no-did-mount-set-state:0 */
            this.setState({ Component });
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
    render() {
      const { Component } = this.state;
      if (Component) {
        // eslint-disable-next-line verdaccio/jsx-spread
        return <Component {...this.props} />;
      }

      return null;
    }
  };
}
