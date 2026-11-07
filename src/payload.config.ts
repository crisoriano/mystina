import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Mundos } from './collections/Mundos'
import { Articulos } from './collections/Articulos'
import { Productos } from './collections/Productos'
import { SobreMi } from './globals/SobreMi'
import { Ajustes } from './globals/Ajustes'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.SITE_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Mystina blog' },
  },
  i18n: { supportedLanguages: { es }, fallbackLanguage: 'es' },
  collections: [Articulos, Mundos, Productos, Media, Users],
  globals: [SobreMi, Ajustes],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    push: false,
    // En producción las migraciones se aplican solas al arrancar el contenedor.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
})
