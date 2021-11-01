import CssBaseline from '@material-ui/core/CssBaseline';
import 'normalize.css';
import React from 'react';

import ResetCSS from './ResetStyles';

const StyleBaseline: React.FC = () => (
  <>
    <CssBaseline />
    <ResetCSS />
  </>
);

export default StyleBaseline;
