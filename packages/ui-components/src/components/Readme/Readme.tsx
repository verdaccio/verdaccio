import 'highlight.js/styles/default.css';
import React from 'react';

import { useCustomTheme } from '../../';
import ReadmeDark from './ReadmeDark';
import ReadmeLight from './ReadmeLight';
import { Props } from './types';

const Readme: React.FC<Props> = ({ description }) => {
  // @ts-ignore
  const { isDarkMode } = useCustomTheme();
  return isDarkMode ? (
    <ReadmeDark description={description} />
  ) : (
    <ReadmeLight description={description} />
  );
};
export default Readme;
