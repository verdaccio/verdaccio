import { useTheme as muiUseTheme } from '@mui/styles';

import { Theme } from './theme';

const useTheme = () => muiUseTheme<Theme>();

export default useTheme;
