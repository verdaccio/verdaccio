import React from 'react';
import { afterEach, describe, expect, test } from 'vitest';

import { cleanup, render, renderWith, screen } from '../../../test/test-react-testing-library';
import RegistryInfoContent from './RegistryInfoContent';

describe('<RegistryInfoContent /> component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should load the component with no data', () => {
    render(<RegistryInfoContent registryUrl="http://localhost:4873" scope={''} />);
    expect(screen.getByText('packageManagers.description')).toBeInTheDocument();
  });

  test('should load the appropiate tab content when the tab is clicked', () => {
    const props = { registryUrl: 'http://localhost:4872', scope: '@' };
    render(<RegistryInfoContent registryUrl={props.registryUrl} scope={props.scope} />);

    expect(screen.getByText('pnpm set @:registry http://localhost:4872')).toBeInTheDocument();
    expect(screen.getByText('pnpm adduser --registry http://localhost:4872')).toBeInTheDocument();
    expect(
      screen.getByText('pnpm profile set password --registry http://localhost:4872')
    ).toBeInTheDocument();
  });

  test('adds a bun section only when bun is configured', () => {
    const registryUrl = 'http://localhost:4873/';
    renderWith(<RegistryInfoContent registryUrl={registryUrl} scope={undefined} />, {
      pkgManagers: ['npm', 'bun'],
    });
    expect(screen.getAllByText('bun').length).toBeGreaterThan(0);
    expect(screen.getByText(`bun publish --registry ${registryUrl}`)).toBeInTheDocument();
    cleanup();
    renderWith(<RegistryInfoContent registryUrl={registryUrl} scope={undefined} />, {
      pkgManagers: ['npm'],
    });
    expect(screen.queryByText('bun')).not.toBeInTheDocument();
  });

  test('teaches the minimum release age of each configured client with the registry scope', () => {
    renderWith(<RegistryInfoContent registryUrl="http://localhost:4873/" scope="@verdaccio" />, {
      pkgManagers: ['npm', 'yarn'],
    });
    expect(screen.getByTestId('min-release-age')).toBeInTheDocument();
    expect(screen.getByTestId('min-release-age-npm')).toHaveTextContent(
      'min-release-age-exclude[]=@verdaccio/*'
    );
    expect(screen.getByTestId('min-release-age-yarn')).toHaveTextContent('npmMinimalAgeGate: 0');
    expect(screen.queryByTestId('min-release-age-pnpm')).not.toBeInTheDocument();
  });

  test('uses a placeholder scope when the registry sets none', () => {
    renderWith(<RegistryInfoContent registryUrl="http://localhost:4873/" scope={undefined} />, {
      pkgManagers: ['pnpm'],
    });
    expect(screen.getByTestId('min-release-age-pnpm')).toHaveTextContent("'@your-scope/*'");
  });
});
