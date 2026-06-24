// Central site content. All copy is sourced from Lite Metal Industries'
// own portfolio and written in a plain, specific voice.

export const site = {
  name: "Lite Metal Industries",
  legalName: "Lite Metal Industries",
  shortName: "LMI",

  // Verbatim positioning, lightly tightened.
  tagline:
    "Design, manufacture, erection and commissioning of low-tension control panels and control transformers.",
  metaTitle:
    "Lite Metal Industries · LT control panels & control transformers, Kolkata",
  metaDescription:
    "Lite Metal Industries designs, builds and commissions LT control panels and control transformers in Kolkata. ISO 9001:2015 certified, with more than 40 years of fabrication work delivered across India.",

  yearsExperience: 40,
  certification: "ISO 9001:2015",
  msme: true,

  email: "vishaldalmia@ymail.com",
  partner: { name: "Vishal Dalmia", role: "Partner" },

  phones: [
    { display: "+91 98305 49999", e164: "+919830549999" },
  ],
  landline: { display: "+91 62919 27843", e164: "+916291927843" },

  office: {
    label: "Office",
    lines: ["33/1 N. S. Road", "778 Marshall House", "Kolkata 700001"],
    street: "33/1 N. S. Road, 778 Marshall House",
    postalCode: "700001",
    mapsQuery: "Marshall House, 33/1 Netaji Subhas Road, Kolkata 700001",
  },
  factory: {
    label: "Factory",
    lines: ["5A Dilarjung Road", "Kolkata 700002"],
    street: "5A Dilarjung Road",
    postalCode: "700002",
    mapsQuery: "5A Dilarjung Road, Kolkata 700002",
  },

  // Manufacturing footprint mentioned in the portfolio.
  facilities: [
    { area: "3,000", unit: "sq ft", name: "Cossipore works", role: "Panel build & wiring" },
    { area: "2", unit: "offices", name: "Marshall House", role: "Design & commercial" },
  ],

  statesServed: ["West Bengal", "Gujarat", "Tamil Nadu", "Maharashtra", "Bihar", "Rajasthan"],

  // Flat product-name list for structured data (knowsAbout).
  products: [
    "Capacitor Control Panel",
    "Logic Control Panel",
    "PLC Panel",
    "Lighting Control Panel",
    "Fire Fighting Control Panel",
    "3 Phase Transformer",
    "AC Drive Panel",
    "Power Control Panel",
    "Power Distribution Board",
    "Cable duct fabrication",
  ],

  // Hero / about counters. Mono, tabular figures.
  stats: [
    { value: "40+", label: "Years in build" },
    { value: "10", label: "Product lines" },
    { value: "6", label: "States served" },
    { value: "ISO", label: "9001:2015 certified" },
  ],

  nav: [
    { label: "About", href: "#about", num: "01" },
    { label: "Products", href: "#products", num: "02" },
    { label: "Projects", href: "#projects", num: "03" },
    { label: "Clients", href: "#clients", num: "04" },
    { label: "Contact", href: "#contact", num: "05" },
  ],
} as const;

export type Site = typeof site;
