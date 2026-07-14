import { getImageSrc } from '../src/utils/getImageSrc';

describe('getImageSrc', () => {
  it('appends png suffix to placehold.co urls', () => {
    expect(getImageSrc('https://placehold.co/300x200')).toBe(
      'https://placehold.co/300x200/png'
    );
  });

  it('preserves query strings when converting placehold.co urls', () => {
    expect(getImageSrc('https://placehold.co/300x200?text=Kramp')).toBe(
      'https://placehold.co/300x200/png?text=Kramp'
    );
  });

  it('returns non-placehold urls unchanged', () => {
    const url = 'https://example.com/image.jpg';
    expect(getImageSrc(url)).toBe(url);
  });

  it('returns placehold.co urls that already include a raster extension unchanged', () => {
    const url = 'https://placehold.co/300x200/png';
    expect(getImageSrc(url)).toBe(url);
  });
});
