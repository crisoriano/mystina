import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Los cuatro mundos acordados con Mystina. Frases y descripciones se dejan
// vacías a propósito: las escribe ella desde el panel.
const MUNDOS = [
  { nombre: 'Mente y crecimiento', nombreCorto: 'mente', slug: 'mente', orden: 1, tema: 'rosa', subtemas: ['Psicología', 'Crecimiento personal'] },
  { nombre: 'Salud, bienestar y cocina', nombreCorto: 'bienestar', slug: 'bienestar', orden: 2, tema: 'melocoton', subtemas: ['Salud', 'Bienestar', 'Cocina'] },
  { nombre: 'Marca y marketing', nombreCorto: 'marca', slug: 'marca', orden: 3, tema: 'granate', subtemas: ['Imagen de marca', 'Marketing digital'] },
  { nombre: 'Música', nombreCorto: 'música', slug: 'musica', orden: 4, tema: 'oscuro', subtemas: ['Mis canciones'] },
] as const

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // Primer usuario del panel desde variables de entorno, para que nadie más
  // pueda «reclamar» el panel vacío al publicar la web.
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (email && password) {
    const users = await payload.count({ collection: 'users', req })
    if (users.totalDocs === 0) {
      await payload.create({ collection: 'users', req, data: { email, password, nombre: 'Mystina' } })
    }
  }

  for (const m of MUNDOS) {
    const existing = await payload.find({ collection: 'mundos', where: { slug: { equals: m.slug } }, limit: 1, req })
    if (existing.docs.length) continue
    await payload.create({
      collection: 'mundos',
      req,
      data: { ...m, subtemas: m.subtemas.map((nombre) => ({ nombre })) },
    })
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.delete({ collection: 'mundos', where: { slug: { in: MUNDOS.map((m) => m.slug) } }, req })
}
