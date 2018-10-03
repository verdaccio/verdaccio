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
import { withRouter } from 'react-router';

import { fontWeight } from '../../utils/styles/sizes';
import { Wrapper, InputField } from './styles';
import { IProps } from './interfaces';

const renderInputComponent = (inputProps): Node => {
  const { ref, startAdornment, disableUnderline, ...others } = inputProps;
  return (
    <InputField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
        },
        startAdornment,
        disableUnderline,
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
  ...others
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
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
        // eslint-disable-next-line no-unused-vars
        onSuggestionSelected={(_, { suggestionValue }) => others.history.push(`detail/${suggestionValue}`)}
      />
    </Wrapper>
  );
};

export default withRouter(AutoComplete);
