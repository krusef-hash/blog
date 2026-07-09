---
title: "Cloudflare Access: proteger tus servicios autohospedados con Zero Trust"
description: "Cómo poner una capa de autenticación delante de tus servicios expuestos por Cloudflare Tunnel, para que solo entren los usuarios que tú autorices."
pubDate: 2026-07-09
tags: ["cloudflare", "seguridad", "zero-trust", "redes"]
draft: false
---

Exponer un servicio con [Cloudflare Tunnel](/blog/cloudflared-proxmox) es muy
cómodo, pero deja el subdominio accesible para **cualquiera** que descubra la
URL. Para paneles sensibles (Proxmox, un router, Home Assistant, Portainer…)
eso no es suficiente.

**Cloudflare Access** añade una capa de autenticación **antes** de que la
petición llegue a tu red: el usuario tiene que identificarse en Cloudflare y,
solo si cumple tu política, se le reenvía al servicio. Es la pieza "Zero Trust"
que complementa al túnel.

> Requisito previo: tener el servicio ya publicado mediante un túnel de
> Cloudflare (ver el [post de cloudflared en Proxmox](/blog/cloudflared-proxmox)).

## Cómo funciona

```text
Usuario ─▶ Cloudflare (login Access) ─▶ Túnel ─▶ Tu servicio interno
              ▲
              └── Si no cumple la política, se bloquea aquí.
```

El servicio interno **nunca** recibe tráfico de alguien no autenticado. Todo el
control de acceso ocurre en el borde de Cloudflare.

## 1. Crear la aplicación en Access

En el **Zero Trust Dashboard** (`one.dash.cloudflare.com`):

1. Ve a **Access → Applications → Add an application**.
2. Elige el tipo **Self-hosted**.
3. Rellena los datos básicos:
   - **Application name:** un nombre descriptivo, p. ej. `Proxmox`.
   - **Session Duration:** cuánto dura la sesión antes de volver a pedir login
     (por ejemplo, 24 horas).
   - **Public hostname:** el subdominio que quieres proteger, p. ej.
     `proxmox.midominio.es` (el mismo que publicaste en el túnel).

## 2. Definir la política de acceso

Una **policy** decide quién entra. Al crear la aplicación añades al menos una:

- **Policy name:** por ejemplo `Solo yo`.
- **Action:** `Allow`.
- **Configure rules → Include:** el criterio que deben cumplir los usuarios.
  Lo más habitual es **Emails** y poner tu correo:

  ```text
  Include → Emails → tu-correo@gmail.com
  ```

Puedes combinar reglas más potentes:

| Selector          | Ejemplo de uso                                  |
| ----------------- | ----------------------------------------------- |
| Emails            | Un correo concreto.                             |
| Emails ending in  | Todo un dominio, p. ej. `@miempresa.com`.       |
| Access groups     | Un grupo reutilizable de usuarios.              |
| Country           | Restringir por país.                            |

Solo quien cumpla la regla `Include` (y no caiga en un `Exclude`/`Require`)
podrá acceder.

## 3. Método de identificación

Por defecto, Cloudflare ofrece el **One-time PIN**: el usuario introduce su
email y recibe un código de un solo uso para entrar. No requiere configurar
nada más y va perfecto para uso personal.

Si quieres inicio de sesión con Google, GitHub, Microsoft, etc., configúralo en
**Settings → Authentication → Login methods** y añade el proveedor como
*Identity Provider*. Luego podrás exigirlo en las políticas.

## 4. Probar el acceso

Abre el subdominio protegido (`https://proxmox.midominio.es`) en una ventana de
incógnito. Ahora, en lugar de llegar directo al servicio, verás la pantalla de
login de Cloudflare Access. Tras autenticarte y cumplir la política, te
redirige al servicio. 🎉

## Acceso para APIs: Service Tokens

Si necesitas que un script o un servicio (no una persona) acceda al endpoint
protegido, usa un **Service Token** en lugar de login interactivo:

1. En **Access → Service Auth → Service Tokens**, crea uno y guarda el
   `Client ID` y el `Client Secret`.
2. Añade una política en la aplicación con la acción **Service Auth** que
   incluya ese token.
3. El cliente envía las credenciales en cabeceras:

   ```bash
   curl https://api.midominio.es/estado \
     -H "CF-Access-Client-Id: <CLIENT_ID>" \
     -H "CF-Access-Client-Secret: <CLIENT_SECRET>"
   ```

## Buenas prácticas

- **Protege siempre los paneles de administración** (Proxmox, routers, NAS)
  detrás de Access, aunque estén tras un túnel.
- Usa **sesiones cortas** en servicios críticos.
- Combina Access con las reglas del propio servicio (usuario/contraseña): son
  dos capas independientes.
- Revisa los **logs de acceso** en **Logs → Access** para ver quién entra.

Con Cloudflare Access conviertes un subdominio "abierto al que sepa la URL" en
un servicio que solo abren las personas que tú decides, sin desplegar VPN ni
gestionar certificados de cliente.
