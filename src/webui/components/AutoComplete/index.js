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

const getSuggestionValue = (suggestion): string => suggestion.label;

const renderSuggestion = (suggestion, { query, isHighlighted }): Node => {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} href={suggestion.link} style={{ fontWeight: fontWeight.semiBold }}>
              {part.text}
            </span>
          ) : (
            <span key={String(index)} href={suggestion.link} style={{ fontWeight: fontWeight.light }}>
              {part.text}
            </span>
          );
        })}
      </div>
    </MenuItem>
  );
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
        inputProps={{
          value,
          onChange,
          placeholder,
          startAdornment,
          disableUnderline,
          color,
          onKeyDown,
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
        onSuggestionSelected={onClick}
      />
    </Wrapper>
  );
};

export default AutoComplete;
