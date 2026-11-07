import React from 'react'
import './styles.css'

export const metadata = {
  title: { default: 'Mystina blog', template: '%s · Mystina blog' },
  description: 'Mystina blog: mente y crecimiento, salud y cocina, marca y marketing, y música.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <a className="skip" href="#contenido">
          Saltar al contenido
        </a>
        {children}
        <footer className="pie">
          <div className="wrap">
            <span>© {new Date().getFullYear()} Mystina</span>
            <span>Aviso legal · Privacidad · Cookies · Enlaces de afiliado (próximamente)</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
