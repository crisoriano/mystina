import { getPayload } from 'payload'
import config from '@payload-config'

export const payload = () => getPayload({ config })

export const temaClase: Record<string, string> = {
  rosa: 'tema-rosa',
  melocoton: 'tema-melocoton',
  granate: 'tema-granate',
  oscuro: 'tema-oscuro',
}
