/* eslint-disable verdaccio/jsx-spread */
import Autocomplete from '@mui/material/Autocomplete';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SearchResultWeb } from '@verdaccio/types';

import { Wrapper } from './styles';

export type OnSelecItem = (
  event: React.SyntheticEvent,
  value: SearchResultWeb,
  reason: string,
  details?: string
) => void;
interface Props {
  suggestions: SearchResultWeb[];
  suggestionsLoading: boolean;
  placeholder: string;
  renderOption?: (props: any, option: any) => Element;
  renderInput: (startAdornment) => JSX.Element;
  onSuggestionsFetch: any;
  getOptionLabel: () => void;
  onCleanSuggestions: (event: React.SyntheticEvent) => void;
  onSelectItem: OnSelecItem;
}

const AutoComplete: FC<Props> = ({
  suggestions,
  onSuggestionsFetch,
  onCleanSuggestions,
  renderInput,
  renderOption,
  getOptionLabel,
  onSelectItem,
  suggestionsLoading = false,
}: Props) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const handleOnInputChange = (event: React.SyntheticEvent, value: string, reason: string) => {
    if (reason === 'input') {
      event.preventDefault();
      onSuggestionsFetch({ value });
      setInputValue(value);
    } else if (reason === 'clear') {
      onCleanSuggestions(event);
      setInputValue('');
    }
  };

  const handleOnClose = (event) => {
    onCleanSuggestions(event);
    setInputValue('');
  };

  return (
    <Wrapper>
      <Autocomplete
        clearOnBlur={true}
        disablePortal={true}
        freeSolo={true}
        fullWidth={true}
        getOptionLabel={getOptionLabel}
        id="search-header-suggest"
        inputValue={inputValue}
        loading={suggestionsLoading}
        loadingText={t('autoComplete.loading')}
        onChange={onSelectItem}
        onClose={handleOnClose}
        onInputChange={handleOnInputChange}
        options={suggestions}
        renderInput={renderInput}
        renderOption={renderOption}
        renderTags={() => null}
      />
    </Wrapper>
  );
};

export default AutoComplete;
