// Product range — now sourced from Sanity CMS (edit at /studio). Shapes are
// preserved so the components consuming `products` are unchanged. `image` is a
// ready-sized WebP CDN URL string; the top-level await resolves at build time.
import { getProducts, type Product } from "../lib/queries";

export type { Product };

export const products: Product[] = await getProducts();
