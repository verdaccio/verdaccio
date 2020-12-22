import React from 'react';

import { render, cleanup, fireEvent } from 'verdaccio-ui/utils/test-react-testing-library';

import RegistryInfoContent from './RegistryInfoContent';

describe('<RegistryInfoContent /> component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should load the component with no data', () => {
    const { getByTestId } = render(<RegistryInfoContent registryUrl={''} scope={''} />);
    const unorderedListOfTodos = getByTestId('tabs-el');
    expect(unorderedListOfTodos.children.length).toBe(1);
  });

  test('should load the appropiate tab content when the tab is clicked', () => {
    const props = { registryUrl: 'http://localhost:4872', scope: '@' };
    const pnpmTabTextContent = `pnpm adduser --registry ${props.registryUrl}`;

    // Render the component.
    const { container, getByTestId } = render(
      <RegistryInfoContent registryUrl={props.registryUrl} scope={props.scope} />
    );

    // Assert the text content for pnpm tab is not present intially
    expect(container.textContent).not.toContain(pnpmTabTextContent);

    const pnpmTab = getByTestId('pnpm-tab');
    fireEvent.click(pnpmTab);

    // Assert the text content is correct after clicking on the tab.
    expect(container.textContent).toContain(pnpmTabTextContent);
  });
});
