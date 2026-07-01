// Central site content — company + contact info now sourced from Sanity CMS
// (edit at /studio → Site Settings). `nav` stays hardcoded here (site
// structure, not editorial content), and `products` (a flat name list used for
// JSON-LD knowsAbout) is derived from the product documents.
import { getSiteSettings } from "../lib/queries";
import { products as productList } from "./products";

// Navigation is structural, not content — kept in code.
const nav = [
  { label: "About", href: "#about", num: "01" },
  { label: "Products", href: "#products", num: "02" },
  { label: "Projects", href: "#projects", num: "03" },
  { label: "Clients", href: "#clients", num: "04" },
  { label: "Contact", href: "#contact", num: "05" },
] as const;

const settings = await getSiteSettings();

export const site = {
  ...settings,
  nav,
  // Flat product-name list for structured data (knowsAbout).
  products: productList.map((p) => p.name),
};

export type Site = typeof site;
