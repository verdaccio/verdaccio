import styled from '@emotion/styled';
import 'github-markdown-css';
import 'highlight.js/styles/default.css';
import React from 'react';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

import { Props } from './types';
import { parseReadme } from './utils';

const Readme: React.FC<Props> = ({ description }) => {
  return (
    <Wrapper
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: parseReadme(description) as string }}
    />
  );
};
export default Readme;

const Wrapper = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  background: theme?.palette.white,
  color: theme?.palette.black,
  padding: theme?.spacing(2, 3),
  ul: {
    listStyle: 'disc',
  },
  img: {
    maxWidth: '100%',
  },
}));
