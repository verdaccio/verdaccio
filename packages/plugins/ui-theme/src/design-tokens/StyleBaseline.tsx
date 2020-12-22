import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import 'normalize.css';
import 'typeface-roboto/index.css';

import ResetCSS from './ResetStyles';

const StyleBaseline: React.FC = () => (
  <>
    <CssBaseline />
    <ResetCSS />
  </>
);

export default StyleBaseline;
