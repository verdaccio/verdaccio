import React from 'react';

import { render } from '../../test/test-react-testing-library';
import {
  CommonJS,
  ES6Modules,
  Earth,
  FileBinary,
  Git,
  Law,
  License,
  NodeJS,
  Npm,
  Pnpm,
  Time,
  TypeScript,
  Version,
  Yarn,
} from './';
import { SvgIcon } from './SvgIcon';

describe('Icon components', () => {
  test('should render an SVG graphic', () => {
    const { container } = render(
      <>
        <Earth />
        <FileBinary />
        <Law />
        <License />
        <Time />
        <Version />
      </>
    );
    expect(container.querySelectorAll('svg')).toHaveLength(6);
  });

  test('should render an IMG graphic linking to and SVG', () => {
    const { container } = render(
      <>
        <CommonJS />
        <ES6Modules />
        <Git />
        <NodeJS />
        <TypeScript />
        <Npm />
        <Pnpm />
        <Yarn />
      </>
    );
    expect(container.querySelectorAll('img')).toHaveLength(8);
  });

  test('should render small graphic', () => {
    const { container } = render(
      <SvgIcon size={'sm'}>
        <circle cx="7" cy="7" r="7" />
      </SvgIcon>
    );
    expect(container.querySelector('svg')).toHaveStyle('width: 14px');
  });

  test('should render medium graphic', () => {
    const { container } = render(
      <SvgIcon size={'md'}>
        <circle cx="7" cy="7" r="7" />
      </SvgIcon>
    );
    expect(container.querySelector('svg')).toHaveStyle('width: 18px');
  });
});
