import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchDialog } from '../src/components/SearchDialog/SearchDialog';
import { mockSearchResults } from '../src/test-fixtures/products';
import { formatPrice } from '../src/utils/formatPrice';

describe('SearchDialog', () => {
  it('renders nothing when there are no results', () => {
    const { container } = render(
      <SearchDialog
        results={[]}
        onSelect={jest.fn()}
        activeIndex={-1}
        listboxId="search-listbox"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders search results with names and prices', () => {
    render(
      <SearchDialog
        results={mockSearchResults}
        onSelect={jest.fn()}
        activeIndex={0}
        listboxId="search-listbox"
      />
    );

    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(screen.getByText(mockSearchResults[0].name)).toBeTruthy();
    expect(screen.getByText(formatPrice(mockSearchResults[0].price))).toBeTruthy();
  });

  it('calls onSelect when a result is clicked', () => {
    const onSelect = jest.fn();

    render(
      <SearchDialog
        results={mockSearchResults}
        onSelect={onSelect}
        activeIndex={-1}
        listboxId="search-listbox"
      />
    );

    fireEvent.click(screen.getByText(mockSearchResults[1].name));

    expect(onSelect).toHaveBeenCalledWith(mockSearchResults[1].id);
  });

  it('marks the active option as selected', () => {
    render(
      <SearchDialog
        results={mockSearchResults}
        onSelect={jest.fn()}
        activeIndex={1}
        listboxId="search-listbox"
      />
    );

    const activeOption = screen.getByRole('option', { selected: true });
    expect(activeOption.id).toBe('search-option-1');
  });
});
