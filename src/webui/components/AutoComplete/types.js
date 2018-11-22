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
  onChange?: (event: SyntheticKeyboardEvent<HTMLInputElement>, { newValue: string }) => void;
  onSuggestionsFetch?: ({ value: string }) => Promise<void>;
  onCleanSuggestions?: () => void;
  onClick?: (event: SyntheticKeyboardEvent<HTMLInputElement>, { suggestionValue: any[], method: string }) => void;
  onKeyDown?: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void;
}

export interface IInputField {
  color: string;
}
