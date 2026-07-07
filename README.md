# Blog Técnico

Blog personal para documentar instalaciones, configuraciones de servidores,
programación y tips (PHP, Laravel, PrestaShop, Docker, Proxmox, redes, …).

Construido con [Astro](https://astro.build/), contenido en **Markdown**,
resaltado de sintaxis con **Shiki** y desplegado automáticamente en
**GitHub Pages** mediante GitHub Actions.

- **Producción:** https://krusef-hash.github.io/blog

---

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (recomendado 20/22 LTS).

## Empezar en local

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo en http://localhost:4321/blog
```

> El sitio se sirve bajo la ruta `/blog` (el `base` configurado). Abre
> `http://localhost:4321/blog`, no la raíz.

Otros comandos:

| Comando           | Qué hace                                        |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga en caliente. |
| `npm run build`   | Genera el sitio estático en `dist/`.            |
| `npm run preview` | Sirve `dist/` en local para revisar el build.   |

---

## Cómo escribir un post nuevo

1. Crea un archivo `.md` (o `.mdx`) dentro de [`src/content/blog/`](src/content/blog/).
   El **nombre del archivo es la URL**: `mi-post.md` → `/blog/mi-post`.
   Usa minúsculas y guiones (por ejemplo, `instalar-proxmox-8.md`).

2. Empieza con el **frontmatter** entre `---`:

   ```markdown
   ---
   title: "Título del artículo"
   description: "Resumen corto para listados, SEO y redes."
   pubDate: 2026-07-07
   updatedDate: 2026-07-10   # opcional
   tags: ["docker", "laravel"]
   draft: false             # true para no publicarlo aún
   ---

   Aquí empieza el contenido en Markdown…
   ```

   | Campo         | Obligatorio | Descripción                                   |
   | ------------- | ----------- | --------------------------------------------- |
   | `title`       | Sí          | Título del artículo.                          |
   | `description` | No          | Resumen para listados, SEO y RSS.             |
   | `pubDate`     | Sí          | Fecha de publicación (`AAAA-MM-DD`).          |
   | `updatedDate` | No          | Fecha de última actualización.                |
   | `tags`        | No          | Lista de etiquetas; generan páginas de tags.  |
   | `draft`       | No          | `true` lo oculta del sitio publicado.         |

3. Escribe en Markdown. Para **bloques de código con resaltado**, indica el
   lenguaje tras las triples comillas:

   ````markdown
   ```php
   echo "Hola mundo";
   ```
   ````

   Lenguajes habituales: `php`, `bash`, `yaml`, `nginx`, `json`, `sql`,
   `javascript`, `dockerfile`, `ini`, `apache`… (la lista completa de Shiki).

4. Comprueba cómo queda con `npm run dev` y, cuando estés conforme, publícalo
   (ver más abajo).

Tienes dos posts de ejemplo en [`src/content/blog/`](src/content/blog/) que
puedes usar como plantilla.

### Imágenes

Guarda las imágenes en [`public/`](public/) y enlázalas con ruta absoluta,
por ejemplo `/blog/imagenes/diagrama.png` (incluye el `/blog`), o usa el
helper del proyecto si escribes componentes.

---

## Cómo funciona el deploy

Cada vez que haces **push a la rama `main`**, GitHub Actions:

1. Ejecuta el workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
2. Instala dependencias y ejecuta `astro build` (action oficial `withastro/action`).
3. Publica el contenido de `dist/` en GitHub Pages.

No hay que hacer nada manual: escribes el post, commit y push. En un par de
minutos estará online en https://krusef-hash.github.io/blog.

Puedes seguir el progreso en la pestaña **Actions** del repositorio.

---

## Configuración importante

Toda la config del sitio (título, descripción, autor, menú, redes) está en
[`src/consts.ts`](src/consts.ts).

La configuración de despliegue está en
[`astro.config.mjs`](astro.config.mjs):

```js
site: 'https://krusef-hash.github.io',
base: '/blog',
```

Si cambias el nombre del repositorio, actualiza `base` para que coincida
(`/nuevo-nombre`). Si algún día publicas en un repo llamado
`krusef-hash.github.io`, pon `base: '/'`.

---

## Estructura del proyecto

```text
├── .github/workflows/deploy.yml   # CI/CD a GitHub Pages
├── astro.config.mjs               # config del sitio (site, base, Shiki)
├── src/
│   ├── consts.ts                  # título, menú, redes…
│   ├── content.config.ts          # esquema del frontmatter
│   ├── content/blog/              # 👈 tus posts en Markdown
│   ├── components/                # Header, Footer, tarjetas…
│   ├── layouts/                   # plantillas base y de post
│   ├── pages/                     # rutas (inicio, blog, tags, rss, 404)
│   └── styles/global.css          # tema claro/oscuro
└── public/                        # favicon, imágenes, .nojekyll
```
