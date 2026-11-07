import type { FieldHook } from 'payload'

export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Rellena el slug a partir de otro campo si se deja vacío. */
export const slugFrom =
  (source: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const from = data?.[source]
    return typeof from === 'string' ? slugify(from) : value
  }
