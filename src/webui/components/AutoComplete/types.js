/**
 * @prettier
 * @flow
 */

import { InputAdornmentProps } from '@material-ui/core/InputAdornment';

export interface IProps {
  suggestions: any[];
  suggestionsLoading?: boolean;
  suggestionsLoaded?: boolean;
  suggestionsError?: boolean;
  apiLoading?: boolean;
  color?: string;
  value?: string;
  placeholder?: string;
  startAdornment?: React.ComponentType<InputAdornmentProps>;
  disableUnderline?: boolean;
  onChange?: Function;
  onSuggestionsFetch?: Function;
  onCleanSuggestions?: () => void;
  onClick?: Function;
  onKeyDown?: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void;
  onBlur?: Function;
}

export interface IInputField {
  color: string;
}
