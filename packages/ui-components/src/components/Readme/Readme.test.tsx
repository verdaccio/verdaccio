import React from 'react';

import { cleanup, render } from '../../test/test-react-testing-library';
import Readme from './Readme';

describe('<Readme /> component', () => {
  beforeEach(cleanup);

  test('should load the component in default state', () => {
    const { getByText } = render(<Readme description="test" />);
    expect(getByText('test')).toBeInTheDocument();
  });

  test('should dangerously set html', () => {
    const wrapper = render(<Readme description="<h1>This is a test string</h1>" />);
    expect(wrapper.getByText('This is a test string')).toBeInTheDocument();
  });

  test('should sanitize html', () => {
    const markdown = `<script>alert('test')</script>`;
    const wrapper = render(<Readme description={markdown} />);
    expect(wrapper.queryAllByText('test')).toHaveLength(0);
  });

  test('should highlight code', () => {
    const markdown = `\`\`\`js\nconst test = 1 + 2;\n\`\`\``;
    const wrapper = render(<Readme description={markdown} />);
    expect(wrapper.getByText('const')).toBeInTheDocument();
    expect(wrapper.getByText('const')).toHaveClass('hljs-keyword');
    expect(wrapper.getByText('1')).toBeInTheDocument();
    expect(wrapper.getByText('1')).toHaveClass('hljs-number');
    expect(wrapper.getByText('2')).toBeInTheDocument();
    expect(wrapper.getByText('2')).toHaveClass('hljs-number');
  });
});
