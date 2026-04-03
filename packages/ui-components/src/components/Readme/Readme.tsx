import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import React from 'react';

import './github-markdown.css';
import './hljs-github-dark.css';
import './hljs-github-light.css';
import type { Props } from './types';
import { parseReadme } from './utils';

const Readme: React.FC<Props> = ({ description }) => {
  const theme = useTheme();
  const dataTheme = theme.palette.mode;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box data-testid="readme" sx={{ m: 2 }}>
          <Wrapper
            className="markdown-body hljs"
            data-theme={dataTheme}
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
