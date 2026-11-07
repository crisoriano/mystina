import Link from 'next/link'
import { notFound } from 'next/navigation'
import { payload, temaClase } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ mundo: string }> }

async function getMundo(slug: string) {
  const p = await payload()
  const res = await p.find({ collection: 'mundos', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return res.docs[0]
}

export async function generateMetadata({ params }: Props) {
  const m = await getMundo((await params).mundo)
  return m ? { title: m.nombre, description: m.descripcion || undefined } : {}
}

export default async function MundoPage({ params }: Props) {
  const { mundo: slug } = await params
  const m = await getMundo(slug)
  if (!m) notFound()
  const p = await payload()
  const [articulos, productos] = await Promise.all([
    p.find({
      collection: 'articulos',
      where: { and: [{ mundo: { equals: m.id } }, { _status: { equals: 'published' } }] },
      sort: '-fechaPublicacion',
      limit: 12,
      depth: 0,
    }),
    p.find({ collection: 'productos', where: { mundos: { in: [m.id] } }, limit: 6, depth: 1 }),
  ])

  return (
    <div className={`mundo-pagina ${temaClase[m.tema] || ''}`}>
      <header className="cabecera">
        <div className="wrap cabecera-in">
          <div>
            <Link className="volver" href="/">
              ← Mystina blog
            </Link>
            <span className="logo pequeno">
              Mystina · <em>{m.nombreCorto || m.nombre}</em>
            </span>
          </div>
          <nav aria-label={m.nombre} className="menu">
            <a href="#articulos">Artículos</a>
            <a href="#lo-que-uso">Lo que uso</a>
            <Link href="/#sobre-mi">Sobre mí</Link>
          </nav>
        </div>
      </header>

      <main id="contenido">
        <section className="hero wrap estrecho">
          <p className="eyebrow">{m.nombre}</p>
          <h1>{m.frase || '[Frase de este mundo: se edita en el panel]'}</h1>
          <p className="intro">{m.descripcion || '[Qué va a encontrar aquí quien te lee.]'}</p>
          <div className="chips">
            {(m.subtemas || []).map((s) => (
              <span key={s.id} className="chip">
                {s.nombre}
              </span>
            ))}
          </div>
        </section>

        <section id="articulos" className="wrap">
          {articulos.docs.length === 0 ? (
            <p className="vacio">Aún no hay artículos en este mundo.</p>
          ) : (
            <div className="posts">
              {articulos.docs.map((a) => (
                <Link key={a.id} className="post" href={`/${m.slug}/${a.slug}`}>
                  <div className="img" />
                  {a.subtema && <p className="tag">{a.subtema}</p>}
                  <h3>{a.titulo}</h3>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section id="lo-que-uso" className="banda">
          <div className="wrap">
            <h2 className="titulo-sec centrado">
              Lo que uso <em>y lo que creo</em>
            </h2>
            {productos.docs.length === 0 ? (
              <p className="vacio centrado">Aquí aparecerán los productos que añadas a este mundo.</p>
            ) : (
              <div className="productos">
                {productos.docs.map((pr) => (
                  <a key={pr.id} className="producto" href={pr.url} rel="sponsored noopener" target="_blank">
                    <span className="k">{pr.tipo === 'afiliado' ? 'Lo que uso · afiliado' : 'Producto propio'}</span>
                    <span className="n">{pr.nombre}</span>
                    {pr.descripcion && <span className="d">{pr.descripcion}</span>}
                    <b>Ver en {pr.tienda || 'la tienda'} ↗</b>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
