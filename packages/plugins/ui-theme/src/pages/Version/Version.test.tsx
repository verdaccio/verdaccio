import { waitFor } from '@testing-library/dom';
import React from 'react';
import { MemoryRouter } from 'react-router';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import translationEN from '../../../i18n/translations/en-US.json';

import data from './__partials__/data.json';
import { DetailContext } from './context';
import Version from './Version';

// :-) we mock this otherways fails on render, some weird issue on material-ui
jest.mock('verdaccio-ui/components/Avatar');

const detailContextValue = {
  packageName: 'foo',
  packageMeta: data,
  readMe: 'Read me!',
  enableLoading: jest.fn(),
  isLoading: false,
  hasNotBeenFound: false,
  version: '1.0.0',
};

describe('test Version page', () => {
  test('should render the version page', async () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <DetailContext.Provider value={detailContextValue}>
          <Version />
        </DetailContext.Provider>
      </MemoryRouter>
    );
    // we wait fetch response (mocked above)
    await waitFor(() => getByTestId('version-layout'));
    // check whether readme was loaded
    const hasReadme = getByText(detailContextValue.readMe);
    expect(hasReadme).toBeTruthy();
  });

  test('should render 404 page if the resources are not found', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <DetailContext.Provider
          value={{
            ...detailContextValue,
            hasNotBeenFound: true,
          }}>
          <Version />
        </DetailContext.Provider>
      </MemoryRouter>
    );
    // we wait fetch response (mocked above)
    const notFoundElement = await waitFor(() =>
      getByText(translationEN.error['404']['sorry-we-could-not-find-it'])
    );
    expect(notFoundElement).toBeTruthy();
  });

  // Wanna contribute? Here we some scenarios we need to test

  test.todo('should test click on tabs');
  test.todo('should check what is rendered int he sidebar is correct');
  test.todo('should test click back home on 404');
  test.todo('should test click on elements in the sidebar');
  test.todo('should test other not consider scenarios');
});
