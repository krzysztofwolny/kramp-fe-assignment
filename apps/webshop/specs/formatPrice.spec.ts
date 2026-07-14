import { formatPrice } from '../src/utils/formatPrice';

describe('formatPrice', () => {
  it('formats prices in EUR', () => {
    expect(formatPrice(18.99)).toMatch(/18\.99/);
    expect(formatPrice(18.99)).toContain('€');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toContain('0');
  });
});
