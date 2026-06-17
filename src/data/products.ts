// Product range. Blurbs are written plainly, in the language a panel shop
// would actually use. One image per line; the cable duct entry is a service.

export interface Product {
  slug: string;
  name: string;
  category: string;
  blurb: string;
  image?: string;
  feature?: boolean;
}

export const products: Product[] = [
  {
    slug: "power-distribution-board",
    name: "Power Distribution Board",
    category: "Distribution",
    blurb:
      "Main and sub distribution boards built to the site single-line diagram, with bus-coupler arrangements, ACBs and MCCBs sized for the load.",
    image: "/images/products/power-distribution-board.webp",
    feature: true,
  },
  {
    slug: "power-control-panel",
    name: "Power Control Panel",
    category: "Distribution",
    blurb:
      "PCC boards that take the incoming supply and feed motors and loads, with metering, protection and busbar work rated for the duty.",
    image: "/images/products/power-control-panel.webp",
  },
  {
    slug: "capacitor-control-panel",
    name: "Capacitor Control Panel",
    category: "Power factor",
    blurb:
      "Automatic power-factor correction with capacitor-duty contactors, detuned reactors and an APFC relay to hold power factor near unity.",
    image: "/images/products/capacitor-control-panel.webp",
    feature: true,
  },
  {
    slug: "ac-drive-panel",
    name: "AC Drive Panel",
    category: "Motor control",
    blurb:
      "Variable frequency drive panels for motor speed control, with the drive, bypass, filtering and protection assembled and tested as one unit.",
    image: "/images/products/ac-drive-panel.webp",
  },
  {
    slug: "plc-panel",
    name: "PLC Panel",
    category: "Automation",
    blurb:
      "Programmable logic panels with field I/O, HMI and marshalling to automate plant and process equipment to your control scheme.",
    image: "/images/products/plc-panel.webp",
  },
  {
    slug: "logic-control-panel",
    name: "Logic Control Panel",
    category: "Automation",
    blurb:
      "Relay and contactor logic for sequencing, interlocks and motor control where hard-wired logic suits the job better than a PLC.",
    image: "/images/products/logic-control-panel.webp",
  },
  {
    slug: "fire-fighting-control-panel",
    name: "Fire Fighting Control Panel",
    category: "Pump control",
    blurb:
      "Pump panels for jockey, main and standby fire pumps, with auto-start on pressure drop and the supervisory wiring fire systems require.",
    image: "/images/products/fire-fighting-control-panel.webp",
  },
  {
    slug: "lighting-control-panel",
    name: "Lighting Control Panel",
    category: "Distribution",
    blurb:
      "Timed and contactor-switched lighting boards for buildings, streets and campuses, wired for staged circuits with manual override.",
    image: "/images/products/lighting-control-panel.webp",
  },
  {
    slug: "three-phase-transformer",
    name: "Control & Isolation Transformers",
    category: "Transformers",
    blurb:
      "Three-phase control and isolation transformers wound to order for stepping voltage and giving control circuits a clean, separate supply.",
    image: "/images/products/three-phase-transformer.webp",
  },
  {
    slug: "cable-duct-fabrication",
    name: "Cable Duct Fabrication",
    category: "Fabrication",
    blurb:
      "Sheet-metal cable ducts and trunking, fabricated and mounted on site to route and protect cabling between equipment.",
  },
];
