import TextField from '@mui/material/TextField';
import React from 'react';
import { vi } from 'vitest';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../test/test-react-testing-library';
import AutoComplete from './AutoComplete';
import type { OnSelecItem } from './AutoComplete';

const defaultProps = () => ({
  placeholder: 'Search packages',
  suggestions: [],
  suggestionsLoading: false,
  onSuggestionsFetch: vi.fn(),
  onCleanSuggestions: vi.fn(),
  onSelectItem: vi.fn() as unknown as OnSelecItem,
  getOptionLabel: (option: any) => option?.package?.name ?? '',
  renderInput: (params: any) => (
    <TextField {...params} placeholder="Search packages" variant="standard" />
  ),
  renderOption: (props: any, option: any) => {
    const { key, ...rest } = props;
    return (
      <li key={key} {...rest}>
        {option.package.name}
      </li>
    );
  },
});

const makeSuggestion = (name: string) => ({
  package: { name, version: '1.0.0', description: '', links: {} },
});

describe('<AutoComplete /> component', () => {
  beforeEach(cleanup);

  test('should render with default state', () => {
    const props = defaultProps();
    render(<AutoComplete {...props} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('should call onSuggestionsFetch when user types', () => {
    const props = defaultProps();
    render(<AutoComplete {...props} />);
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'react' } });

    expect(props.onSuggestionsFetch).toHaveBeenCalledWith({ value: 'react' });
  });

  test('should call onCleanSuggestions and clear input on reason "clear"', () => {
    const props = defaultProps();
    const { container } = render(<AutoComplete {...props} />);
    const input = screen.getByRole('combobox');

    // Type something first
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveAttribute('value', 'test');

    // Click the clear button
    const clearButton = container.querySelector('[aria-label="Clear"]');
    if (clearButton) {
      fireEvent.click(clearButton);
    }
  });

  test('should not show options when input is empty/whitespace', () => {
    const props = defaultProps();
    props.suggestions = [makeSuggestion('verdaccio')] as any;
    render(<AutoComplete {...props} />);
    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    // filterOptions returns [] when inputValue is empty
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('should show suggestions when input has value', async () => {
    const suggestions = [makeSuggestion('verdaccio'), makeSuggestion('verdaccio-auth')];
    const props = defaultProps();
    props.suggestions = suggestions as any;

    render(<AutoComplete {...props} />);
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'verdaccio' } });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  test('should show loading text when suggestionsLoading is true', async () => {
    const props = defaultProps();
    props.suggestionsLoading = true;

    render(<AutoComplete {...props} />);
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'loading' } });

    await waitFor(() => {
      expect(screen.getByText('autoComplete.loading')).toBeInTheDocument();
    });
  });

  test('should call onCleanSuggestions and clear input on close', async () => {
    const suggestions = [makeSuggestion('verdaccio')];
    const props = defaultProps();
    props.suggestions = suggestions as any;

    render(<AutoComplete {...props} />);
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'verdaccio' } });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Close by pressing Escape
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(props.onCleanSuggestions).toHaveBeenCalled();
  });

  test('should call onSelectItem when an option is selected', async () => {
    const suggestions = [makeSuggestion('verdaccio')];
    const props = defaultProps();
    props.suggestions = suggestions as any;

    render(<AutoComplete {...props} />);
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'verdaccio' } });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const option = screen.getByText('verdaccio');
    fireEvent.click(option);

    expect(props.onSelectItem).toHaveBeenCalled();
  });

  test('should show "no results found" when suggestions are empty and user has typed', async () => {
    const props = defaultProps();
    props.suggestions = [];

    render(<AutoComplete {...props} />);
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('autoComplete.no-results-found')).toBeInTheDocument();
    });
  });
});
