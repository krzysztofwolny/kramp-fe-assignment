import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { FrequentlyBoughtTogether } from '../src/components/FrequentlyBoughtTogether/FrequentlyBoughtTogether';
import { getFrequentlyBoughtTogether } from '../src/utils/getFrequentlyBoughtTogether';
import { mockProductList } from '../src/test-fixtures/products';

jest.mock('../src/utils/getFrequentlyBoughtTogether', () => ({
  getFrequentlyBoughtTogether: jest.fn(),
}));

describe('FrequentlyBoughtTogether', () => {
  beforeEach(() => {
    (getFrequentlyBoughtTogether as jest.Mock).mockResolvedValue(
      mockProductList.slice(0, 2)
    );
  });

  it('renders recommendations when products are returned', async () => {
    const { getAllByTestId } = render(
      <FrequentlyBoughtTogether
        excludeProductIds={['1']}
        categorySeeds={['Tools']}
      />
    );

    await waitFor(() => {
      expect(getAllByTestId('product-card')).toHaveLength(2);
    });
  });

  it('renders nothing when no recommendations are returned', async () => {
    (getFrequentlyBoughtTogether as jest.Mock).mockResolvedValue([]);

    const { container } = render(
      <FrequentlyBoughtTogether
        excludeProductIds={['1']}
        categorySeeds={['Tools']}
      />
    );

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
