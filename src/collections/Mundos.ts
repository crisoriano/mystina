import type { CollectionConfig } from 'payload'
import { slugFrom } from '../utilities/slugify'

export const Mundos: CollectionConfig = {
  slug: 'mundos',
  labels: { singular: 'Mundo', plural: 'Mundos' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'slug', 'orden'],
    description: 'Los grandes bloques temáticos del blog. Cada uno tiene su propia landing.',
  },
  defaultSort: 'orden',
  access: { read: () => true },
  fields: [
    { name: 'nombre', type: 'text', required: true, label: 'Nombre' },
    {
      name: 'nombreCorto',
      type: 'text',
      label: 'Nombre corto',
      admin: { description: 'Se usa en la cabecera: «Mystina · mente».' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: 'Dirección (URL)',
      admin: { position: 'sidebar', description: 'Ej.: mente → mystina.blog/mente' },
      hooks: { beforeValidate: [slugFrom('nombreCorto')] },
    },
    { name: 'orden', type: 'number', defaultValue: 1, admin: { position: 'sidebar' } },
    {
      name: 'tema',
      type: 'select',
      label: 'Estilo visual',
      required: true,
      defaultValue: 'rosa',
      options: [
        { label: 'Claro · rosa palo', value: 'rosa' },
        { label: 'Claro · melocotón', value: 'melocoton' },
        { label: 'Granate', value: 'granate' },
        { label: 'Oscuro', value: 'oscuro' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'frase', type: 'text', label: 'Frase principal de la landing' },
    { name: 'descripcion', type: 'textarea', label: 'Descripción breve' },
    {
      name: 'subtemas',
      type: 'array',
      label: 'Subtemas',
      labels: { singular: 'Subtema', plural: 'Subtemas' },
      fields: [{ name: 'nombre', type: 'text', required: true }],
    },
  ],
}
