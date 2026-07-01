import { defineField, defineType } from 'sanity';

// Singleton mirroring src/data/site.ts (company + contact info, counters, meta).
// `nav` stays hardcoded in the data wrapper (site structure, not content), and
// the flat `products` list used for JSON-LD is derived from product documents.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity & Meta', default: true },
    { name: 'contact', title: 'Contact & Addresses' },
    { name: 'company', title: 'Company Facts' },
    { name: 'projects', title: 'Projects' },
  ],
  fields: [
    // Identity & meta
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'identity', validation: (r) => r.required() }),
    defineField({ name: 'legalName', title: 'Legal name', type: 'string', group: 'identity' }),
    defineField({ name: 'shortName', title: 'Short name', type: 'string', group: 'identity' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'text', rows: 2, group: 'identity' }),
    defineField({ name: 'metaTitle', title: 'Meta title', type: 'string', group: 'identity' }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3, group: 'identity' }),

    // Contact
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact' }),
    defineField({
      name: 'partner',
      title: 'Partner',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string' }),
        defineField({ name: 'role', title: 'Role', type: 'string' }),
      ],
    }),
    defineField({
      name: 'phones',
      title: 'Phones',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'display', title: 'Display', type: 'string' }),
            defineField({ name: 'e164', title: 'E.164 (tel: link)', type: 'string' }),
          ],
          preview: { select: { title: 'display' } },
        },
      ],
    }),
    defineField({
      name: 'landline',
      title: 'Landline',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'display', title: 'Display', type: 'string' }),
        defineField({ name: 'e164', title: 'E.164 (tel: link)', type: 'string' }),
      ],
    }),
    defineField({ name: 'office', title: 'Office', type: 'address', group: 'contact' }),
    defineField({ name: 'factory', title: 'Factory', type: 'address', group: 'contact' }),

    // Company facts
    defineField({ name: 'yearsExperience', title: 'Years experience', type: 'number', group: 'company' }),
    defineField({ name: 'certification', title: 'Certification', type: 'string', group: 'company' }),
    defineField({ name: 'msme', title: 'MSME registered', type: 'boolean', group: 'company' }),
    defineField({
      name: 'facilities',
      title: 'Facilities',
      type: 'array',
      group: 'company',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'area', title: 'Area', type: 'string' }),
            defineField({ name: 'unit', title: 'Unit', type: 'string' }),
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'role', title: 'Role', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'role' } },
        },
      ],
    }),
    defineField({
      name: 'statesServed',
      title: 'States served',
      type: 'array',
      group: 'company',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'stats',
      title: 'Stats (counters)',
      type: 'array',
      group: 'company',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),

    // Projects
    defineField({
      name: 'fountainNote',
      title: 'Fountain pull-quote',
      type: 'text',
      rows: 4,
      group: 'projects',
      description: 'The "world\'s 26 leading fountains" note shown beside the hero project.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
});

// Reusable address object used by office & factory.
export const address = defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({
      name: 'lines',
      title: 'Lines',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Display lines, one per row.',
    }),
    defineField({ name: 'street', title: 'Street (structured data)', type: 'string' }),
    defineField({ name: 'postalCode', title: 'Postal code', type: 'string' }),
    defineField({ name: 'mapsQuery', title: 'Google Maps query', type: 'string' }),
  ],
});
