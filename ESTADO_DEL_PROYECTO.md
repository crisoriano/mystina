# Mystina blog · Estado del proyecto

_Última actualización: 7 de noviembre de 2026_

## Reglas del proyecto
- **Nunca inventar datos de Mystina:** textos, historia, productos o precios.
  Mientras no existan, se muestran como `[texto entre corchetes]`.
- **Avanzar por fases**, con su aprobación antes de pasar a la siguiente.
- **Preguntar antes de cambios grandes:** proveedores, servidor o estructura de datos.

## Decisiones tomadas
| Tema | Decisión |
|---|---|
| Nombre | **Mystina blog** (Mystina = nombre artístico) |
| Dominio | **mystina.blog** (comprado en Arsys; DNS en el Cloudflare de Juan) |
| Estructura | Portada general + 4 mundos con landing propia: **Mente y crecimiento** (psicología, crecimiento personal) · **Salud, bienestar y cocina** · **Marca y marketing** (imagen de marca, marketing digital) · **Música** |
| Portada | Entradas a los mundos + «Lo último de todo» (con etiqueta de mundo) |
| Estilo | «Cuaderno sereno»: Instrument Serif + DM Sans; paleta cálida con granate `#7A1F33` y rosa palo `#EED3CF`; Música en oscuro. Regla: sobre fondo oscuro, texto siempre claro, también en hover |
| Movimiento | GSAP (ver demo): titular palabra a palabra, palabra rotatoria, tarjetas 3D, cortinas al hacer scroll, cursor propio, transición tarjeta → mundo, reproductor en Música. Respetar `prefers-reduced-motion` |
| Tienda | De momento **solo afiliados** («Lo que uso»). Productos propios digitales, más adelante |
| Técnica | Next.js 16 + Payload CMS 3 (panel en español) + PostgreSQL, en Docker |
| Publicación | GitHub (`crisoriano/mystina`) → GitHub Actions publica la imagen en ghcr.io → Watchtower la actualiza en el servidor de Juan → Cloudflare Tunnel |
| Correo | Más adelante: reenvío gratuito de Cloudflare (hola@mystina.blog → Gmail) |

## Hecho
- [x] Fase 1 · Diseño: lienzo con la portada y los 4 mundos, más la demo animada.
- [x] Bloque 1 · Cimientos:
  - Panel con Artículos (borradores y publicados), Mundos, Productos, Imágenes, Usuarios, Sobre mí y Ajustes.
  - Los 4 mundos se crean solos.
  - Migraciones automáticas al arrancar.
  - Primer usuario del panel desde `.env`.
  - Portada y landing de cada mundo conectadas a los datos, con el estilo base.
  - Dockerfile, workflow de GitHub Actions, `deploy/` con docker-compose y guía para Juan.

## Pendiente
- [ ] Bloque 2 · Portada definitiva con animaciones.
- [ ] Bloque 3 · Landings de cada mundo con su toque propio (Música: reproductor).
- [ ] Bloque 4 · Página de artículo (barra de lectura, productos relacionados) y listado por mundo.
- [ ] Bloque 5 · Página «Sobre mí».
- [ ] Pulido:
  - Móvil y accesibilidad.
  - SEO: sitemap, robots, Open Graph y datos estructurados.
  - Páginas legales (aviso legal, privacidad, cookies, afiliados) y banner de cookies.
- [ ] Juan: instalación inicial (`deploy/GUIA_JUAN.md`) y ruta en el túnel.
- [ ] Mystina: nameservers en Arsys y contenido real desde el panel.

## Desarrollo local
```bash
cp .env.example .env   # DATABASE_URL a un Postgres local
npm install
npm run migrate        # crea tablas y mundos
npm run dev            # http://localhost:3000 · panel en /admin
```
Para cambiar colecciones: `npx payload migrate:create nombre` y añadir la
migración a `src/migrations/index.ts`.
