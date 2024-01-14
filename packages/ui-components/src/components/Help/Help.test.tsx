import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import Help from './Help';

describe('<Help /> component', () => {
  test('should load the component in default state', () => {
    render(<Help />);
    expect(screen.getByText('help.title')).toBeInTheDocument();
    expect(screen.getByText('help.sub-title')).toBeInTheDocument();
    expect(screen.getByText('help.first-step')).toBeInTheDocument();
    expect(screen.getByText('help.first-step-command-line')).toBeInTheDocument();
    expect(screen.getByText('help.second-step')).toBeInTheDocument();
    expect(screen.getByText('help.second-step-command-line')).toBeInTheDocument();
    expect(screen.getByText('help.third-step')).toBeInTheDocument();
    expect(screen.getByText('button.learn-more')).toBeInTheDocument();
  });
});
