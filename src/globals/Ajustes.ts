import type { GlobalConfig } from 'payload'

export const Ajustes: GlobalConfig = {
  slug: 'ajustes',
  label: 'Ajustes de la web',
  access: { read: () => true },
  fields: [
    { name: 'nombreSitio', type: 'text', defaultValue: 'Mystina blog', label: 'Nombre de la web' },
    { name: 'fraseInicio', type: 'text', label: 'Frase principal de la portada' },
    { name: 'introInicio', type: 'textarea', label: 'Texto bajo la frase principal' },
    {
      name: 'redes',
      type: 'array',
      label: 'Redes sociales',
      fields: [
        { name: 'red', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'legal',
      type: 'group',
      label: 'Datos legales (aviso legal y privacidad)',
      admin: { description: 'Mientras estén vacíos, las páginas legales muestran [PENDIENTE].' },
      fields: [
        { name: 'titular', type: 'text', label: 'Nombre del titular' },
        { name: 'nif', type: 'text', label: 'NIF' },
        { name: 'email', type: 'email', label: 'Email de contacto' },
        { name: 'direccion', type: 'text', label: 'Dirección' },
      ],
    },
  ],
}
