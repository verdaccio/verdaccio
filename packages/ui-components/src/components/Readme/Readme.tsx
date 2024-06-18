import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React from 'react';

import { useCustomTheme } from '../../';
import './github-markdown.css';
import { Props } from './types';
import { parseReadme } from './utils';

const Readme: React.FC<Props> = ({ description }) => {
  // @ts-ignore
  const { isDarkMode } = useCustomTheme();

  if (isDarkMode) {
    require('highlight.js/styles/github-dark.css');
  } else {
    require('highlight.js/styles/github.css');
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box data-testid="readme" sx={{ m: 2 }}>
          <Wrapper
            className={`markdown-body ${isDarkMode ? 'markdown-dark' : 'markdown-light'}`}
            dangerouslySetInnerHTML={{ __html: parseReadme(description) as string }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
export default Readme;

const Wrapper = styled('div')({
  ul: {
    listStyle: 'disc',
  },
  img: {
    maxWidth: '100%',
  },
});
