const RASTER_FORMAT_PATTERN = /\/(png|jpe?g|webp|avif|gif)$/i;

/** placehold.co serves SVG by default, which next/image cannot optimize. */
export function getImageSrc(url: string): string {
  if (!url.includes('placehold.co') || RASTER_FORMAT_PATTERN.test(url)) {
    return url;
  }

  const [path, query] = url.split('?');
  const pngPath = `${path}/png`;

  return query ? `${pngPath}?${query}` : pngPath;
}
