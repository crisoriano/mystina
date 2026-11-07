import type { GlobalConfig } from 'payload'

export const SobreMi: GlobalConfig = {
  slug: 'sobre-mi',
  label: 'Sobre mí',
  access: { read: () => true },
  fields: [
    { name: 'nombre', type: 'text', defaultValue: 'Mystina', label: 'Nombre artístico' },
    { name: 'foto', type: 'upload', relationTo: 'media', label: 'Retrato' },
    { name: 'presentacion', type: 'textarea', label: 'Presentación corta', admin: { description: 'Aparece en la portada.' } },
    { name: 'historia', type: 'richText', label: 'Tu historia' },
  ],
}
