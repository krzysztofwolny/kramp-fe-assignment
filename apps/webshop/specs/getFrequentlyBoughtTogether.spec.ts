import { getFrequentlyBoughtTogether } from '../src/utils/getFrequentlyBoughtTogether';
import { fetchGraphQL } from '../src/utils/fetchGraphQL';
import { mockProductList } from '../src/test-fixtures/products';

jest.mock('../src/utils/fetchGraphQL', () => ({
  fetchGraphQL: jest.fn(),
}));

describe('getFrequentlyBoughtTogether', () => {
  beforeEach(() => {
    (fetchGraphQL as jest.Mock).mockResolvedValue({
      searchProducts: mockProductList,
    });
  });

  it('excludes the current product from recommendations', async () => {
    const recommendations = await getFrequentlyBoughtTogether({
      excludeProductIds: ['1'],
      categorySeeds: ['Tools'],
    });

    expect(recommendations.some(product => product.id === '1')).toBe(false);
  });

  it('prioritizes products from the seeded category', async () => {
    const recommendations = await getFrequentlyBoughtTogether({
      excludeProductIds: ['1'],
      categorySeeds: ['Tools'],
      limit: 2,
    });

    expect(recommendations[0]?.category).toBe('Tools');
    expect(recommendations.some(product => product.id === '1')).toBe(false);
  });

  it('skips out of stock products', async () => {
    (fetchGraphQL as jest.Mock).mockResolvedValue({
      searchProducts: [...mockProductList, { ...mockProductList[0], id: '100', stock: 0 }],
    });

    const recommendations = await getFrequentlyBoughtTogether({
      excludeProductIds: [],
      categorySeeds: ['Tools'],
    });

    expect(recommendations.some(product => product.id === '100')).toBe(false);
  });

  it('returns an empty list when no category seeds can be derived', async () => {
    const recommendations = await getFrequentlyBoughtTogether({
      excludeProductIds: ['missing-id'],
      categorySeeds: [],
    });

    expect(recommendations).toEqual([]);
  });
});
