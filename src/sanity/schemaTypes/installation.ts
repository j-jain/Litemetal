import { defineField, defineType } from 'sanity';

// Mirrors the Install interface in src/data/projects.ts — panel installations
// listed as a text roster (no image).
export const installation = defineType({
  name: 'installation',
  title: 'Panel Installation',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. VFD Panel, Distribution Panel',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'place',
      title: 'Place',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      validation: (r) => r.required(),
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
    select: { title: 'name', place: 'place', state: 'state' },
    prepare: ({ title, place, state }) => ({
      title,
      subtitle: [place, state].filter(Boolean).join(', '),
    }),
  },
});
