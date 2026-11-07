import type { CollectionConfig } from 'payload'
import { slugFrom } from '../utilities/slugify'

export const Articulos: CollectionConfig = {
  slug: 'articulos',
  labels: { singular: 'Artículo', plural: 'Artículos' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'mundo', '_status', 'fechaPublicacion'],
  },
  defaultSort: '-fechaPublicacion',
  versions: { drafts: true },
  access: {
    // El público solo ve artículos publicados; nunca borradores.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  fields: [
    { name: 'titulo', type: 'text', required: true, label: 'Título' },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: 'Dirección (URL)',
      admin: { position: 'sidebar', description: 'Se rellena sola a partir del título.' },
      hooks: { beforeValidate: [slugFrom('titulo')] },
    },
    {
      name: 'mundo',
      type: 'relationship',
      relationTo: 'mundos',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'subtema',
      type: 'text',
      admin: { position: 'sidebar', description: 'Ej.: Psicología, Cocina…' },
    },
    {
      name: 'fechaPublicacion',
      type: 'date',
      label: 'Fecha de publicación',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      hooks: {
        beforeChange: [({ value, siblingData }) => value || (siblingData?._status === 'published' ? new Date() : value)],
      },
    },
    { name: 'destacado', type: 'checkbox', label: 'Destacado en su mundo', admin: { position: 'sidebar' } },
    { name: 'portada', type: 'upload', relationTo: 'media', label: 'Imagen de portada' },
    { name: 'entradilla', type: 'textarea', label: 'Entradilla', admin: { description: 'Dos o tres líneas que resumen el artículo.' } },
    { name: 'contenido', type: 'richText', label: 'Contenido' },
    {
      name: 'productos',
      type: 'relationship',
      relationTo: 'productos',
      hasMany: true,
      label: 'Productos relacionados',
      admin: { description: 'Lo que uso y aparece en el artículo.' },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'titulo', type: 'text', label: 'Título para Google' },
        { name: 'descripcion', type: 'textarea', label: 'Descripción para Google' },
      ],
    },
  ],
}
