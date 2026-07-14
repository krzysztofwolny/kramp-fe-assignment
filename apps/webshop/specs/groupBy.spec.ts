import { groupBy } from '../src/utils/groupBy';

describe('groupBy', () => {
  it('groups items by the given key', () => {
    const items = [
      { id: '1', category: 'Tools' },
      { id: '2', category: 'Fasteners' },
      { id: '3', category: 'Tools' },
    ];

    const grouped = groupBy(items, 'category');

    expect(grouped.Tools).toHaveLength(2);
    expect(grouped.Fasteners).toHaveLength(1);
  });

  it('returns an empty object for an empty array', () => {
    expect(groupBy([], 'category')).toEqual({});
  });
});
