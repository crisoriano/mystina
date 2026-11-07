# Mystina blog · Guía de instalación en el servidor de Juan

Hola Juan 👋 Esto se hace **una sola vez**. Después, cada cambio que Mystina suba
a GitHub se publica solo: GitHub Actions construye la imagen
`ghcr.io/crisoriano/mystina` y Watchtower la actualiza en tu servidor
(como mucho, 5 minutos después).

**Qué se instala:** tres contenedores, todos con el prefijo `mystina-`:
- `mystina-web`: Next.js 16 + Payload 3.
- `mystina-db`: PostgreSQL 16 propio, separado del tuyo.
- `mystina-watchtower`: limitado al *scope* `mystina`, así que **no toca tus contenedores de Capse**.

Las migraciones de la base de datos se aplican solas al arrancar, como en tu
web. No hay pagos ni datos de clientes.

---

## 1. Acceso a la imagen

El repositorio es privado, así que la imagen en ghcr.io también lo es por
defecto. Hay dos opciones:

- **A (más simple):** Mystina hace pública *solo la imagen*, desde GitHub →
  su perfil → Packages → `mystina` → Package settings → Change visibility →
  Public. La imagen no contiene contraseñas, porque el `.env` nunca se incluye.
- **B:** Mystina crea un token clásico con permiso `read:packages` y te lo pasa.
  En el servidor:
  ```bash
  echo TOKEN | docker login ghcr.io -u crisoriano --password-stdin
  ```
  En ese caso, Watchtower necesita esas credenciales. Añade este volumen al
  servicio `watchtower` en `docker-compose.yml`:
  `- /root/.docker/config.json:/config.json:ro`. Ajusta la ruta si haces el
  login con otro usuario.

> La imagen se construye para `linux/amd64`. Si tu servidor es ARM, avisa y se
> añade esa plataforma al workflow.

## 2. Copiar la carpeta `deploy/` al servidor

```bash
mkdir -p ~/mystina && cd ~/mystina
# copia aquí docker-compose.yml y .env.example de la carpeta deploy/ del repo
cp .env.example .env
nano .env        # rellena contraseñas, PAYLOAD_SECRET (openssl rand -hex 32) y el email/contraseña del panel
docker compose up -d
docker compose logs -f web    # deberías ver "Migrated: ..." y "Ready"
```

Comprobación local: `curl -I http://127.0.0.1:3010` debe devolver 200.
Si el puerto 3010 está ocupado, cambia `PUERTO_WEB` en el `.env`.

## 3. Dominio en Cloudflare

1. En Cloudflare: **Add a site** → `mystina.blog` → plan Free.
2. Pásale a Mystina los dos *nameservers*. Ella los cambia en Arsys, donde
   compró el dominio.
3. Espera a que Cloudflare marque el dominio como **Active**.

## 4. Ruta en tu Cloudflare Tunnel

Añade un *public hostname* `mystina.blog` (y, si quieres, `www.mystina.blog`) a
tu túnel. El destino depende de dónde corre `cloudflared`:

- **`cloudflared` en un contenedor** (como en Capse): conéctalo a la red de
  Mystina y apunta al nombre del contenedor.
  ```bash
  docker network connect mystina_default <nombre-de-tu-contenedor-cloudflared>
  ```
  Destino: `http://mystina-web:3000`.
  Para que no se pierda al recrear tu contenedor, añade la red como `external`
  en tu `docker-compose`:
  ```yaml
  services:
    cloudflared:
      networks: [default, mystina]
  networks:
    mystina:
      external: true
      name: mystina_default
  ```
- **`cloudflared` instalado directamente en el sistema:** destino `http://127.0.0.1:3010`.

## 5. Comprobar

- `https://mystina.blog` muestra la portada con los cuatro mundos.
- `https://mystina.blog/admin` pide el email y la contraseña del `.env`. Una
  vez dentro, se pueden borrar `ADMIN_EMAIL` y `ADMIN_PASSWORD` del `.env`.

## Copias de seguridad (recomendado)

```bash
docker exec mystina-db pg_dump -U mystina mystina > mystina-$(date +%F).sql
docker run --rm -v mystina_media:/m -v "$PWD":/b alpine tar czf /b/media-$(date +%F).tgz -C /m .
```

¡Gracias! 🙏
