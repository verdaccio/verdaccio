import React from 'react';

import { cleanup, renderWithRouteDetail, screen } from '../../test/test-react-testing-library';
import DetailContainer from './Detail';

describe('DetailContainer', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders correctly', () => {
    renderWithRouteDetail(<DetailContainer />);
    expect(screen.getByTestId('readme-tab')).toBeInTheDocument();
    expect(screen.getByTestId('dependencies-tab')).toBeInTheDocument();
    expect(screen.getByTestId('versions-tab')).toBeInTheDocument();
  });

  test('renders without uplinks', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.showUplinks = false;
    renderWithRouteDetail(<DetailContainer />);
    expect(screen.queryByTestId('uplinks-tab')).toBeFalsy();
  });

  test.todo('should test click on tabs');
});
