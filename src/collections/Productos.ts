import type { CollectionConfig } from 'payload'

export const Productos: CollectionConfig = {
  slug: 'productos',
  labels: { singular: 'Producto', plural: 'Productos' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'tipo', 'tienda', 'mundos'],
    description: 'Lo que uso (enlaces de afiliado). Los productos propios llegarán más adelante.',
  },
  access: { read: () => true },
  fields: [
    { name: 'nombre', type: 'text', required: true },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      defaultValue: 'afiliado',
      options: [
        { label: 'Lo que uso · afiliado', value: 'afiliado' },
        { label: 'Producto propio (próximamente)', value: 'propio' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'mundos',
      type: 'relationship',
      relationTo: 'mundos',
      hasMany: true,
      required: true,
      admin: { position: 'sidebar', description: 'En qué mundos aparece.' },
    },
    { name: 'destacado', type: 'checkbox', admin: { position: 'sidebar' } },
    { name: 'imagen', type: 'upload', relationTo: 'media' },
    { name: 'descripcion', type: 'textarea', label: 'Por qué lo uso' },
    { name: 'tienda', type: 'text', label: 'Tienda', admin: { description: 'Ej.: Amazon' } },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Enlace',
      admin: { description: 'Tu enlace de afiliado completo.' },
      validate: (v: string | null | undefined) => (!v || /^https?:\/\//.test(v) ? true : 'Debe empezar por https://'),
    },
    { name: 'precio', type: 'text', label: 'Precio orientativo' },
  ],
}
