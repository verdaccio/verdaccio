import styled from '@emotion/styled';
import Search from '@mui/icons-material/Search';
import { Theme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SearchResultWeb } from '@verdaccio/types';

import { StyledTextField } from './styles';
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
  startAdornment?: JSX.Element;
  onSuggestionsFetch: any;
  onCleanSuggestions: (event: React.SyntheticEvent) => void;
  onSelectItem: OnSelecItem;
}

const StyledInputAdornment = styled(InputAdornment)<{ theme?: Theme }>((props) => ({
  color: props.theme?.palette.white,
}));

const AutoComplete: FC<Props> = ({
  suggestions,
  startAdornment,
  onSuggestionsFetch,
  onCleanSuggestions,
  placeholder = '',
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
        disablePortal={true}
        freeSolo={true}
        onChange={onSelectItem}
        autoHighlight={true}
        id="search-header-suggest"
        options={suggestions}
        inputValue={inputValue}
        clearOnBlur={true}
        loading={suggestionsLoading}
        renderTags={() => null}
        onClose={handleOnClose}
        loadingText={t('autoComplete.loading')}
        onInputChange={handleOnInputChange}
        getOptionLabel={(option) => option.name}
        fullWidth={true}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              startAdornment: startAdornment || (
                <StyledInputAdornment position="start">
                  <Search />
                </StyledInputAdornment>
              ),
            }}
            label=""
            variant="standard"
          />
        )}
      />
    </Wrapper>
  );
};

export default AutoComplete;
