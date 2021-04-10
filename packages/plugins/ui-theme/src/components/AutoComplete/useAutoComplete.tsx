// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
// Give up on IE 11 support for this feature
function stripDiacritics(value: string) {
  return typeof value.normalize !== 'undefined'
    ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    : value;
}

// Based on https://github.com/netochaves/material-ui/tree/test/useAutocomplete/packages/material-ui-lab/src/useAutocomplete
type CreateFilterOptionsConfig = {
  ignoreAccents?: boolean;
  ignoreCase?: boolean;
  limit?: number;
  matchFrom?: 'any' | 'start';
  trim?: boolean;
};

export interface FilterOptionsState<Option> {
  inputValue: string;
  getOptionLabel: (option: Option) => string;
}

function createFilterOptions(config?: CreateFilterOptionsConfig) {
  const { ignoreAccents = true, ignoreCase = true, trim = false, limit, matchFrom = 'any' } =
    config || {};

  return <Option extends {}>(
    options: Option[],
    { inputValue, getOptionLabel }: FilterOptionsState<Option>
  ): Option[] => {
    let input = trim ? inputValue.trim() : inputValue;
    if (ignoreCase) {
      input = input.toLowerCase();
    }

    if (ignoreAccents) {
      input = stripDiacritics(input);
    }

    const filteredOptions = options.filter((option) => {
      let candidate = getOptionLabel(option);
      if (ignoreCase) {
        candidate = candidate.toLowerCase();
      }
      if (ignoreAccents) {
        candidate = stripDiacritics(candidate);
      }

      return matchFrom === 'start' ? candidate.indexOf(input) === 0 : candidate.indexOf(input) > -1;
    });

    return typeof limit === 'number' ? filteredOptions.slice(0, limit) : filteredOptions;
  };
}

export { createFilterOptions };
