---
title: "Bienvenida al blog: cómo está montado y cómo escribir aquí"
description: "Primer post del blog. Explico la estructura del frontmatter, cómo se ven los bloques de código y qué me espera documentar por aquí."
pubDate: 2026-07-07
tags: ["meta", "astro", "markdown"]
draft: false
---

¡Hola! Este es el primer artículo del blog. Aquí iré documentando
**instalaciones, configuraciones de servidores, programación y tips** sobre
PHP, Laravel, PrestaShop, Docker, Proxmox, redes y todo lo que me vaya
encontrando por el camino.

Este post sirve además como **plantilla de referencia**: enséñate a ti mismo
mirando su frontmatter y su Markdown.

## El frontmatter

Cada post empieza con un bloque `---` con sus metadatos. Los campos disponibles:

| Campo         | Obligatorio | Descripción                                  |
| ------------- | ----------- | -------------------------------------------- |
| `title`       | Sí          | Título del artículo.                          |
| `description` | No          | Resumen para listados, SEO y redes.          |
| `pubDate`     | Sí          | Fecha de publicación (`AAAA-MM-DD`).          |
| `updatedDate` | No          | Fecha de última actualización.                |
| `tags`        | No          | Lista de etiquetas. Genera páginas de tags.  |
| `draft`       | No          | `true` para ocultarlo del sitio publicado.   |

## Bloques de código con resaltado

El resaltado de sintaxis lo hace [Shiki](https://shiki.style/), integrado en
Astro. Solo tienes que indicar el lenguaje tras las triples comillas. Un
ejemplo en PHP:

```php
<?php

namespace App\Services;

class Saludo
{
    public function paraTodos(string $nombre): string
    {
        return "¡Hola, {$nombre}!";
    }
}
```

Y algo de shell, que usaremos mucho:

```bash
# Actualizar el sistema en Debian/Ubuntu
sudo apt update && sudo apt upgrade -y
```

También hay soporte para `código en línea`, útil para comandos cortos como
`git status` o nombres de fichero como `astro.config.mjs`.

## Citas y notas

> Consejo: guarda las imágenes en `public/` y enlázalas con una ruta
> absoluta desde la raíz del sitio.

## Qué viene por aquí

- Configuraciones de **Proxmox** y máquinas virtuales.
- **Docker** y `docker compose` para entornos de desarrollo.
- Despliegues de **Laravel** y **PrestaShop**.
- Notas de **redes**: VLANs, firewall, VPN.

Nos leemos en el próximo post 👋
