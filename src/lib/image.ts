// Build sized WebP URLs from Sanity image references, served off Sanity's CDN.
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityClient } from './sanity';

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Return a ready-to-use <img src> string for a Sanity image at a given width,
 * as WebP. Returns undefined when there is no image (callers already handle a
 * missing product image with an SVG fallback).
 */
export function imgUrl(
  source: SanityImageSource | undefined | null,
  width: number,
): string | undefined {
  if (!source) return undefined;
  return urlFor(source).width(width).auto('format').fit('max').url();
}
