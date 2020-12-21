/* eslint-disable react/jsx-no-bind */
import styled from '@emotion/styled';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, { KeyboardEvent, memo } from 'react';
import Autosuggest, {
  SuggestionSelectedEventData,
  InputProps,
  ChangeEvent,
  SuggestionsFetchRequested,
  GetSuggestionValue,
  RenderSuggestion,
  RenderSuggestionsContainer,
  RenderInputComponent,
} from 'react-autosuggest';
import { useTranslation } from 'react-i18next';

import { Theme } from 'verdaccio-ui/design-tokens/theme';

import MenuItem from '../MenuItem';

import { Wrapper, InputField, SuggestionContainer } from './styles';

const StyledAnchor = styled('a')<{ highlight: boolean; theme?: Theme }>((props) => ({
  fontWeight:
    props.theme && props.highlight ? props.theme.fontWeight.semiBold : props.theme.fontWeight.light,
}));

const StyledMenuItem = styled(MenuItem)({
  cursor: 'pointer',
});

interface Props {
  suggestions: Suggestion[];
  suggestionsLoading?: boolean;
  suggestionsLoaded?: boolean;
  suggestionsError?: boolean;
  apiLoading?: boolean;
  value?: string;
  placeholder?: string;
  startAdornment?: JSX.Element;
  disableUnderline?: boolean;
  onChange: (event: React.FormEvent<HTMLInputElement>, params: ChangeEvent) => void;
  onSuggestionsFetch: SuggestionsFetchRequested;
  onCleanSuggestions?: () => void;
  onClick?: (
    event: React.FormEvent<HTMLInputElement>,
    data: SuggestionSelectedEventData<unknown>
  ) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FormEvent<HTMLInputElement>) => void;
}

interface Suggestion {
  name: string;
}

type CustomInputProps = Pick<Props, 'disableUnderline' | 'startAdornment'>;

/* eslint-disable react/jsx-sort-props  */
/* eslint-disable verdaccio/jsx-spread */
const renderInputComponent: RenderInputComponent<Suggestion> = (inputProps) => {
  // @ts-ignore
  const { ref, startAdornment, disableUnderline, onKeyDown, ...others } = inputProps;
  return (
    <InputField
      fullWidth={true}
      InputProps={{
        inputRef: (node: any) => {
          // @ts-ignore
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

const getSuggestionValue: GetSuggestionValue<Suggestion> = (suggestion): string => suggestion.name;

const renderSuggestion: RenderSuggestion<Suggestion> = (
  suggestion,
  { query, isHighlighted }
): JSX.Element => {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);
  return (
    <StyledMenuItem component="div" selected={isHighlighted}>
      <div>
        {parts.map((part, index) => {
          return (
            <StyledAnchor highlight={part.highlight} key={String(index)}>
              {part.text}
            </StyledAnchor>
          );
        })}
      </div>
    </StyledMenuItem>
  );
};

const renderMessage = (message: string): JSX.Element => {
  return (
    <MenuItem component="div" selected={false}>
      <div>{message}</div>
    </MenuItem>
  );
};

const AutoComplete = memo(
  ({
    suggestions,
    startAdornment,
    onChange,
    onSuggestionsFetch,
    onCleanSuggestions,
    value = '',
    placeholder = '',
    disableUnderline = false,
    onClick,
    onKeyDown,
    onBlur,
    suggestionsLoading = false,
    suggestionsLoaded = false,
    suggestionsError = false,
  }: Props) => {
    const { t } = useTranslation();

    const inputProps: InputProps<Suggestion> = {
      value,
      onChange,
      placeholder,
      // material-ui@4.5.1 introduce better types for TextInput, check readme
      // @ts-ignore
      startAdornment,
      disableUnderline,
      onKeyDown,
      onBlur,
    };

    // this format avoid arrow function eslint rule
    // eslint-disable-next-line prettier/prettier
    const renderSuggestionsContainer: RenderSuggestionsContainer = function ({
      containerProps,
      children,
      query,
    }): JSX.Element {
      return (
        <SuggestionContainer {...containerProps} square={true}>
          {suggestionsLoaded &&
            children === null &&
            query &&
            renderMessage(t('autoComplete.no-results-found'))}
          {suggestionsLoading && query && renderMessage(t('autoComplete.loading'))}
          {suggestionsError && renderMessage(t('error.unspecific'))}
          {children}
        </SuggestionContainer>
      );
    };

    return (
      <Wrapper>
        <Autosuggest<Suggestion>
          renderInputComponent={renderInputComponent}
          suggestions={suggestions}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionsFetchRequested={onSuggestionsFetch}
          onSuggestionsClearRequested={onCleanSuggestions}
          inputProps={inputProps}
          onSuggestionSelected={onClick}
          renderSuggestionsContainer={renderSuggestionsContainer}
        />
      </Wrapper>
    );
  }
);

export default AutoComplete;
