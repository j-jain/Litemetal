import { defineField, defineType } from 'sanity';

// Mirrors the Project interface in src/data/projects.ts (the musical-fountain
// control work). The first one (lowest order) renders as the hero.
export const fountainProject = defineType({
  name: 'fountainProject',
  title: 'Special Project',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'place',
      title: 'Place',
      type: 'string',
      description: 'e.g. Victoria Memorial Hall, Kolkata',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'string',
      description: 'e.g. Control system for the musical fountain',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tall',
      title: 'Tall image',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first; the lowest becomes the hero.',
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'place', media: 'image' },
  },
});
