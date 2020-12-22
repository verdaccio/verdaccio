import styled from '@emotion/styled';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, {
  memo,
  useState,
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Theme } from 'verdaccio-ui/design-tokens/theme';
import { useOnClickOutside } from 'verdaccio-ui/design-tokens/useOnClickOutside';

import IconButton from '../IconButton';
import MenuItem from '../MenuItem';
import Paper from '../Paper';
import TextField from '../TextField';

import { createFilterOptions } from './useAutoComplete';

const defaultFilterOptions = createFilterOptions();

type TextFieldProps = React.ComponentProps<typeof TextField>;

interface Props<Option extends {}> extends Pick<TextFieldProps, 'variant'> {
  options: Option[];
  getOptionLabel: (option: Option) => string;
  renderOption?: (option: Option) => React.ReactNode;
  placeholder?: string;
  label?: React.ReactNode;
  defaultValue?: string;
  inputStartAdornment?: React.ReactNode;
  hasClearIcon?: boolean;
  className?: string;
  onClick?: (option: Option) => void;
}

const AutoComplete = <Option extends {}>({
  placeholder,
  defaultValue = '',
  label,
  variant,
  inputStartAdornment,
  options: suggestions,
  getOptionLabel,
  renderOption: renderOptionProp,
  className,
  onClick,
  hasClearIcon,
}: Props<Option>) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [options, setOptions] = useState(suggestions);
  const [activeOption, setActiveOption] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  // refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const clickOutside = useCallback(() => {
    setShowOptions(false);
    if (!searchTerm.trim()) {
      setSearchTerm(defaultValue);
    }
  }, [searchTerm, defaultValue]);

  const filterOptions = useCallback(() => {
    const filteredOptions = defaultFilterOptions(suggestions, {
      inputValue: searchTerm,
      getOptionLabel,
    });
    setOptions(filteredOptions);
  }, [suggestions, searchTerm, getOptionLabel]);

  const scrollIntoOption = useCallback(() => {
    const option = contentRef?.current?.children[activeOption];
    if (option) {
      option.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, [activeOption]);

  useOnClickOutside(wrapperRef, useCallback(clickOutside, [wrapperRef, searchTerm]));

  useEffect(filterOptions, [searchTerm]);

  useEffect(scrollIntoOption, [activeOption]);

  useEffect(() => {
    setSearchTerm(defaultValue);
  }, [defaultValue]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleToggleShowOptions = useCallback(() => {
    setShowOptions(!showOptions);
  }, [showOptions]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    setOptions([]);
    setShowOptions(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleClickOption = useCallback(
    (option: Option) => () => {
      if (onClick) {
        onClick(option);
      }
      setSearchTerm(getOptionLabel(option));
      setShowOptions(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    },
    [getOptionLabel, onClick]
  );

  const handleFocus = useCallback(() => {
    setShowOptions(true);
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // User pressed the enter key
      if (event.keyCode === 13) {
        setActiveOption(0);
        setShowOptions(false);
        handleClickOption(options[activeOption])();
        return;
      }

      // User pressed the up arrow
      if (event.keyCode === 38) {
        if (activeOption === 0) {
          return;
        }
        setActiveOption(activeOption - 1);
        return;
      }

      // User pressed the down arrow
      if (event.keyCode === 40) {
        if (activeOption + 1 >= options.length) {
          return;
        }
        setActiveOption(activeOption + 1);
        return;
      }
    },
    [activeOption, handleClickOption, options]
  );

  const renderOptions = useCallback(() => {
    if (renderOptionProp) {
      return options.map((option, index) => (
        <Option
          isSelected={index === activeOption}
          key={index}
          onClick={handleClickOption(option)}
          tabIndex={0}>
          {renderOptionProp(option)}
        </Option>
      ));
    }

    return options.map((option, index) => (
      <MenuItem
        component="div"
        key={index}
        onClick={handleClickOption(option)}
        selected={index === activeOption}
        tabIndex={0}>
        {getOptionLabel(option)}
      </MenuItem>
    ));
  }, [options, activeOption, getOptionLabel, renderOptionProp, handleClickOption]);

  return (
    <Wrapper className={className} ref={wrapperRef}>
      <StyledTextField
        autoComplete="off"
        InputProps={{
          startAdornment: inputStartAdornment,
          endAdornment: (
            <EndAdornment>
              {hasClearIcon && searchTerm.length > 0 && (
                <IconButton
                  color="inherit"
                  onClick={handleClear}
                  size="small"
                  title={t('autoComplete.clear')}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
              <ExpandButton
                color="inherit"
                onClick={handleToggleShowOptions}
                showOptions={showOptions}
                size="small"
                title={showOptions ? t('autoComplete.collapse') : t('autoComplete.expand')}>
                <ExpandMoreIcon fontSize="small" />
              </ExpandButton>
            </EndAdornment>
          ),
        }}
        inputRef={inputRef}
        label={label}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        value={searchTerm}
        variant={variant}
      />
      {showOptions && (
        <StyledPaper ref={contentRef} square={true}>
          {renderOptions()}
        </StyledPaper>
      )}
    </Wrapper>
  );
};

const MemoizedAutoComplete = memo(AutoComplete) as typeof AutoComplete;

export { MemoizedAutoComplete as AutoComplete };

const Wrapper = styled('div')`
  position: relative;
  height: 40px;
`;

const EndAdornment = styled('div')({
  display: 'flex',
});

const StyledTextField = styled(TextField)<{ theme?: Theme }>(({ theme }) => ({
  height: 40,
  color: theme?.palette.white,
  ['& .MuiInputBase-root']: {
    height: 40,
    color: theme?.palette.white,
  },
  ['& .MuiInputBase-inputAdornedStart']: {
    paddingLeft: theme?.spacing(2),
  },
  ['& .MuiInputBase-input']: {
    paddingTop: theme?.spacing(1),
    paddingBottom: theme?.spacing(1),
  },
  ['& .MuiOutlinedInput-notchedOutline']: {
    borderColor: 'transparent',
  },
  ['& :hover .MuiOutlinedInput-notchedOutline']: {
    borderColor: theme?.palette.white,
  },
  ['& :active .MuiOutlinedInput-notchedOutline']: {
    borderColor: theme?.palette.white,
  },
}));

const ExpandButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'showOptions',
})<{ showOptions: boolean }>(({ showOptions }) => ({
  transform: showOptions ? 'rotate(180deg)' : 'none',
}));

const Option = styled('div')<{ isSelected: boolean }>(({ isSelected }) => ({
  background: isSelected ? 'rgba(0, 0, 0, 0.08)' : 'none',
}));

const StyledPaper = withStyles((theme: Theme) => ({
  root: {
    marginTop: theme?.spacing(0.5),
    borderRadius: 3,
    maxHeight: 165,
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
}))(Paper);
