// One-time migration: uploads the existing images and content into Sanity so
// the CMS starts pre-populated matching the current site.
//
//   1. Fill .env with PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET and
//      SANITY_WRITE_TOKEN (an Editor token from sanity.io/manage).
//   2. npm run seed
//
// Safe to re-run: documents use deterministic _id values (createOrReplace) and
// image assets are de-duplicated by Sanity on content hash.
//
// _id values use hyphens, not dots: Sanity's default "public" access group
// grants read only via `_id in path("*")`, which matches a single path
// segment — a dotted id like `product.foo` needs `path("**")` and silently
// stays unreadable by anonymous (build-time) clients.
import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// --- tiny .env loader (no dependency) ---
function loadEnv() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const val = m[2].replace(/^["']|["']$/g, '');
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadEnv();

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing config. Set PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env',
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });

// Cache uploaded assets by public path so we upload each file once.
const assetCache = new Map();
async function uploadImage(publicPath) {
  if (!publicPath) return undefined;
  if (assetCache.has(publicPath)) return assetCache.get(publicPath);
  const filePath = join(root, 'public', publicPath.replace(/^\//, ''));
  if (!existsSync(filePath)) {
    console.warn(`  ! image not found, skipping: ${filePath}`);
    return undefined;
  }
  const asset = await client.assets.upload('image', readFileSync(filePath), {
    filename: basename(filePath),
  });
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  assetCache.set(publicPath, ref);
  return ref;
}

// ---------------------------------------------------------------------------
// Content snapshot (mirrors the original src/data/*.ts at migration time)
// ---------------------------------------------------------------------------

const products = [
  { slug: 'power-distribution-board', name: 'Power Distribution Board', category: 'Distribution', blurb: 'Main and sub distribution boards built to the site single-line diagram, with bus-coupler arrangements, ACBs and MCCBs sized for the load.', image: '/images/products/power-distribution-board.webp', feature: true },
  { slug: 'power-control-panel', name: 'Power Control Panel', category: 'Distribution', blurb: 'PCC boards that take the incoming supply and feed motors and loads, with metering, protection and busbar work rated for the duty.', image: '/images/products/power-control-panel.webp' },
  { slug: 'capacitor-control-panel', name: 'Capacitor Control Panel', category: 'Power factor', blurb: 'Automatic power-factor correction with capacitor-duty contactors, detuned reactors and an APFC relay to hold power factor near unity.', image: '/images/products/capacitor-control-panel.webp', feature: true },
  { slug: 'ac-drive-panel', name: 'AC Drive Panel', category: 'Motor control', blurb: 'Variable frequency drive panels for motor speed control, with the drive, bypass, filtering and protection assembled and tested as one unit.', image: '/images/products/ac-drive-panel.webp' },
  { slug: 'plc-panel', name: 'PLC Panel', category: 'Automation', blurb: 'Programmable logic panels with field I/O, HMI and marshalling to automate plant and process equipment to your control scheme.', image: '/images/products/plc-panel.webp' },
  { slug: 'logic-control-panel', name: 'Logic Control Panel', category: 'Automation', blurb: 'Relay and contactor logic for sequencing, interlocks and motor control where hard-wired logic suits the job better than a PLC.', image: '/images/products/logic-control-panel.webp' },
  { slug: 'fire-fighting-control-panel', name: 'Fire Fighting Control Panel', category: 'Pump control', blurb: 'Pump panels for jockey, main and standby fire pumps, with auto-start on pressure drop and the supervisory wiring fire systems require.', image: '/images/products/fire-fighting-control-panel.webp' },
  { slug: 'lighting-control-panel', name: 'Lighting Control Panel', category: 'Distribution', blurb: 'Timed and contactor-switched lighting boards for buildings, streets and campuses, wired for staged circuits with manual override.', image: '/images/products/lighting-control-panel.webp' },
  { slug: 'three-phase-transformer', name: 'Control & Isolation Transformers', category: 'Transformers', blurb: 'Three-phase control and isolation transformers wound to order for stepping voltage and giving control circuits a clean, separate supply.', image: '/images/products/three-phase-transformer.webp' },
  { slug: 'cable-duct-fabrication', name: 'Cable Duct Fabrication', category: 'Fabrication', blurb: 'Sheet-metal cable ducts and trunking, fabricated and mounted on site to route and protect cabling between equipment.', image: '/images/products/cable-duct-fabrication.webp' },
];

const clientGroups = [
  { sector: 'Utilities & Government', clients: ['CESC Limited', 'Government of West Bengal', 'WBHIDCO', 'Premier Irrigation Adritec'] },
  { sector: 'Industry & Manufacturing', clients: ['Birla Sugar (K.K. Birla Group)', 'Beekay Steel Industries', 'Kamakhya Bottlers', 'Gamut Infosystems', 'Dot & Key', 'Prospace Industrial Parks'] },
  { sector: 'Real Estate & Infrastructure', clients: ['PS Group', 'Srijan', 'Jain Group', 'Jalan Builders', 'Purti Realty', 'Sugam', 'Alcove Realty', 'Swayam City', 'Primarc', 'Prasad Group', 'AG Group', 'Infinity', 'DTC', 'Natural Group', 'ATK Kalim Group', 'Premierworld'] },
];

const fountainProjects = [
  { name: 'Fountain of Joy', place: 'Victoria Memorial Hall, Kolkata', state: 'West Bengal', scope: 'Control system for the musical fountain', image: '/images/projects/fountain-of-joy.webp', tall: true },
  { name: 'Biswa Bangla', place: 'Kolkata', state: 'West Bengal', scope: 'Fountain control and lighting', image: '/images/projects/biswa-bangla.webp' },
  { name: 'Water Fountain Show', place: 'Eco Park, New Town, Kolkata', state: 'West Bengal', scope: 'Musical fountain control', image: '/images/projects/eco-park.webp' },
  { name: 'Krishna River Musical Fountain', place: 'Ahmedabad', state: 'Gujarat', scope: 'Fountain control panels', image: '/images/projects/krishna-river.webp' },
];

const installations = [
  { name: 'VFD Panel', place: 'Mumbai', state: 'Maharashtra' },
  { name: 'Distribution Panel, Tirupathy Bright', place: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Distribution boards, Birla Sugar Mills', place: 'Birla Sugar', state: 'Bihar' },
];

const fountainNote =
  "The Fountain of Joy, opposite Victoria Memorial Hall, was listed among the world's 26 leading fountains by a global travel portal, in the company of the Trevi Fountain, the fountains at Versailles and the Bellagio in Las Vegas.";

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  name: 'Lite Metal Industries',
  legalName: 'Lite Metal Industries',
  shortName: 'LMI',
  tagline: 'Design, manufacture, erection and commissioning of low-tension control panels and control transformers.',
  metaTitle: 'Lite Metal Industries · LT control panels & control transformers, Kolkata',
  metaDescription: 'Lite Metal Industries designs, builds and commissions LT control panels and control transformers in Kolkata. ISO 9001:2015 certified, with more than 40 years of fabrication work delivered across India.',
  yearsExperience: 40,
  certification: 'ISO 9001:2015',
  msme: true,
  email: 'vishaldalmia@ymail.com',
  partner: { name: 'Vishal Dalmia', role: 'Partner' },
  phones: [{ _key: 'ph0', display: '+91 98305 49999', e164: '+919830549999' }],
  landline: { display: '+91 62919 27843', e164: '+916291927843' },
  office: {
    _type: 'address',
    label: 'Office',
    lines: ['33/1 N. S. Road', '778 Marshall House', 'Kolkata 700001'],
    street: '33/1 N. S. Road, 778 Marshall House',
    postalCode: '700001',
    mapsQuery: 'Marshall House, 33/1 Netaji Subhas Road, Kolkata 700001',
  },
  factory: {
    _type: 'address',
    label: 'Factory',
    lines: ['5A Dilarjung Road', 'Kolkata 700002'],
    street: '5A Dilarjung Road',
    postalCode: '700002',
    mapsQuery: '5A Dilarjung Road, Kolkata 700002',
  },
  facilities: [
    { _key: 'fac0', area: '3,000', unit: 'sq ft', name: 'Cossipore works', role: 'Panel build & wiring' },
    { _key: 'fac1', area: '2', unit: 'offices', name: 'Marshall House', role: 'Design & commercial' },
  ],
  statesServed: ['West Bengal', 'Gujarat', 'Tamil Nadu', 'Maharashtra', 'Bihar', 'Rajasthan'],
  stats: [
    { _key: 'st0', value: '40+', label: 'Years in build' },
    { _key: 'st1', value: '10', label: 'Product lines' },
    { _key: 'st2', value: '6', label: 'States served' },
    { _key: 'st3', value: 'ISO', label: '9001:2015 certified' },
  ],
  fountainNote,
};

// ---------------------------------------------------------------------------

async function run() {
  const tx = client.transaction();

  console.log('Uploading images + building product docs…');
  let i = 0;
  for (const p of products) {
    const image = await uploadImage(p.image);
    tx.createOrReplace({
      _id: `product-${p.slug}`,
      _type: 'product',
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      category: p.category,
      blurb: p.blurb,
      ...(image ? { image } : {}),
      feature: !!p.feature,
      order: i++,
    });
  }

  console.log('Building client sector docs…');
  clientGroups.forEach((g, idx) => {
    tx.createOrReplace({
      _id: `clientSector-${idx}`,
      _type: 'clientSector',
      sector: g.sector,
      clients: g.clients,
      order: idx,
    });
  });

  console.log('Uploading images + building special project docs…');
  i = 0;
  for (const p of fountainProjects) {
    const image = await uploadImage(p.image);
    tx.createOrReplace({
      _id: `fountainProject-${i}`,
      _type: 'fountainProject',
      name: p.name,
      place: p.place,
      state: p.state,
      scope: p.scope,
      ...(image ? { image } : {}),
      tall: !!p.tall,
      order: i++,
    });
  }

  console.log('Building installation docs…');
  installations.forEach((it, idx) => {
    tx.createOrReplace({
      _id: `installation-${idx}`,
      _type: 'installation',
      name: it.name,
      place: it.place,
      state: it.state,
      order: idx,
    });
  });

  console.log('Building site settings singleton…');
  tx.createOrReplace(siteSettings);

  console.log('Committing transaction…');
  await tx.commit();
  console.log('✓ Seed complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
