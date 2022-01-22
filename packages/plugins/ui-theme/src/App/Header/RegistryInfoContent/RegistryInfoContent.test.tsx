import React from 'react';
import { cleanup, render, screen } from 'verdaccio-ui/utils/test-react-testing-library';

import RegistryInfoContent from './RegistryInfoContent';

describe('<RegistryInfoContent /> component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should load the component with no data', () => {
    render(<RegistryInfoContent registryUrl="http://localhost:4873" scope={''} />);
    expect(
      screen.getByText(
        'This is the configuration details for the registry. Each package manager could have different configuration, expand each section for more details.'
      )
    ).toBeInTheDocument();
  });

  test('should load the appropiate tab content when the tab is clicked', () => {
    const props = { registryUrl: 'http://localhost:4872', scope: '@' };
    render(<RegistryInfoContent registryUrl={props.registryUrl} scope={props.scope} />);

    expect(screen.getByText('pnpm set @:registry http://localhost:4872')).toBeInTheDocument();
    expect(screen.getByText('pnpm adduser --registry http://localhost:4872')).toBeInTheDocument();
    expect(
      screen.getByText('pnpm profile set password --registry http://localhost:4872')
    ).toBeInTheDocument();
  });
});
