import { useTheme as muiUseTheme } from '@material-ui/styles';

import { Theme } from './theme';

const useTheme = () => muiUseTheme<Theme>();

export default useTheme;
