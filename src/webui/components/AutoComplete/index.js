/**
 * @prettier
 * @flow
 */

import React from 'react';
import type { Node } from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

import { fontWeight } from '../../utils/styles/sizes';
import { Wrapper, InputField } from './styles';
import { IProps } from './types';

const renderInputComponent = (inputProps): Node => {
  const { ref, startAdornment, disableUnderline, onKeyDown, ...others } = inputProps;
  return (
    <InputField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
        },
        startAdornment,
        disableUnderline,
        onKeyDown,
      }}
      {...others}
    />
  );
};

const getSuggestionValue = (suggestion): string => suggestion.name;

const renderSuggestion = (suggestion, { query, isHighlighted }): Node => {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);
  return (
    <MenuItem component={'div'} selected={isHighlighted}>
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span href={ suggestion.link } key={ String(index) } style={ { fontWeight: fontWeight.semiBold } }>
              {part.text}
            </span>
          ) : (
            <span href={ suggestion.link } key={ String(index) } style={ { fontWeight: fontWeight.light } }>
              {part.text}
            </span>
          );
        })}
      </div>
    </MenuItem>
  );
};

const renderMessage = (message): Node => {
  return (
    <MenuItem component={'div'} selected={false}>
      <div>{message}</div>
    </MenuItem>
  );
};

const SUGGESTIONS_RESPONSE = {
  LOADING: 'Loading...',
  FAILURE: 'Something went wrong.',
  NO_RESULT: 'No results found.',
};

const AutoComplete = ({
  suggestions,
  startAdornment,
  onChange,
  onSuggestionsFetch,
  onCleanSuggestions,
  value = '',
  placeholder = '',
  disableUnderline = false,
  color,
  onClick,
  onKeyDown,
  onBlur,
  suggestionsLoading = false,
  suggestionsLoaded = false,
  suggestionsError = false,
}: IProps): Node => {
  const autosuggestProps = {
    renderInputComponent,
    suggestions,
    getSuggestionValue,
    renderSuggestion,
    onSuggestionsFetchRequested: onSuggestionsFetch,
    onSuggestionsClearRequested: onCleanSuggestions,
  };
  return (
    <Wrapper>
      <Autosuggest
        {...autosuggestProps}
        inputProps={ {
          value,
          onChange,
          placeholder,
          startAdornment,
          disableUnderline,
          color,
          onKeyDown,
          onBlur,
        } }
        onSuggestionSelected={ onClick }
        renderSuggestionsContainer={ ({ containerProps, children, query }) => (
          <Paper { ...containerProps } square={true}>
            {suggestionsLoaded && children === null && query && renderMessage(SUGGESTIONS_RESPONSE.NO_RESULT)}
            {suggestionsLoading && query && renderMessage(SUGGESTIONS_RESPONSE.LOADING)}
            {suggestionsError && renderMessage(SUGGESTIONS_RESPONSE.FAILURE)}
            {children}
          </Paper>
        ) }
      />
    </Wrapper>
  );
};

export default AutoComplete;
