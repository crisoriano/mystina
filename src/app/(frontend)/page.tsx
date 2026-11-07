import Link from 'next/link'
import { payload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const temaTarjeta: Record<string, string> = {
  rosa: 'w1',
  melocoton: 'w2',
  granate: 'w3',
  oscuro: 'w4',
}

export default async function Inicio() {
  const p = await payload()
  const [mundos, ultimos, ajustes, sobreMi] = await Promise.all([
    p.find({ collection: 'mundos', sort: 'orden', limit: 12, depth: 0 }),
    p.find({ collection: 'articulos', sort: '-fechaPublicacion', limit: 3, depth: 1, where: { _status: { equals: 'published' } } }),
    p.findGlobal({ slug: 'ajustes' }),
    p.findGlobal({ slug: 'sobre-mi' }),
  ])

  return (
    <>
      <header className="cabecera">
        <div className="wrap cabecera-in centrada">
          <Link className="logo" href="/">
            Mystina <em>blog</em>
          </Link>
          <nav aria-label="Principal" className="menu">
            {mundos.docs.map((m) => (
              <Link key={m.id} href={`/${m.slug}`}>
                {m.nombreCorto ? m.nombreCorto[0].toUpperCase() + m.nombreCorto.slice(1) : m.nombre}
              </Link>
            ))}
            <Link href="/#sobre-mi">Sobre mí</Link>
          </nav>
        </div>
      </header>

      <main id="contenido">
        <section className="hero wrap estrecho">
          <h1>{ajustes.fraseInicio || '[Tu frase principal]'}</h1>
          <p className="intro">{ajustes.introInicio || '[Dos líneas presentándote: se editan en Ajustes de la web.]'}</p>
        </section>

        <section className="wrap mundos" aria-label="Los mundos">
          {mundos.docs.map((m, i) => (
            <Link key={m.id} href={`/${m.slug}`} className={`mundo ${temaTarjeta[m.tema] || 'w1'}`}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <span className="t">{m.nombre}</span>
              <span className="s">{(m.subtemas || []).map((s) => s.nombre).join(' · ')}</span>
              <span className="go">Entrar →</span>
            </Link>
          ))}
        </section>

        <section className="banda-clara">
          <div className="wrap">
            <h2 className="titulo-sec">
              Lo último <em>de todo</em>
            </h2>
            {ultimos.docs.length === 0 ? (
              <p className="vacio">Todavía no hay artículos publicados. Escribe el primero desde el panel.</p>
            ) : (
              <div className="posts">
                {ultimos.docs.map((a) => {
                  const mundo = typeof a.mundo === 'object' ? a.mundo : null
                  return (
                    <Link key={a.id} className="post" href={`/${mundo?.slug}/${a.slug}`}>
                      <div className="img" />
                      <p className="tag">
                        {mundo?.nombreCorto}
                        {a.subtema ? ` · ${a.subtema}` : ''}
                      </p>
                      <h3>{a.titulo}</h3>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section id="sobre-mi" className="wrap estrecho sobre">
          <div className="retrato" aria-hidden="true" />
          <h2>
            Hola, soy <em>{sobreMi.nombre || 'Mystina'}</em>
          </h2>
          <p>{sobreMi.presentacion || '[Tu presentación: se edita en Sobre mí.]'}</p>
        </section>
      </main>
    </>
  )
}
