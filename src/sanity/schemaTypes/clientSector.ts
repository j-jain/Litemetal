import { defineField, defineType } from 'sanity';

// Mirrors the ClientGroup interface in src/data/clients.ts. Clients are shown
// as a typographic wall grouped by sector — no logos, just names.
export const clientSector = defineType({
  name: 'clientSector',
  title: 'Client Sector',
  type: 'document',
  fields: [
    defineField({
      name: 'sector',
      title: 'Sector',
      type: 'string',
      description: 'e.g. Utilities & Government',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'sector', clients: 'clients' },
    prepare: ({ title, clients }) => ({
      title,
      subtitle: `${clients?.length ?? 0} clients`,
    }),
  },
});
