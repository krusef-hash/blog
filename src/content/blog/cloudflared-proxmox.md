---
title: "Cloudflare Tunnel (cloudflared) en Proxmox: exponer servicios sin abrir puertos"
description: "Cómo montar un túnel de Cloudflare en un contenedor LXC de Proxmox para acceder a tus servicios desde fuera sin abrir puertos en el router ni exponer tu IP."
pubDate: 2026-07-08
tags: ["proxmox", "cloudflare", "redes", "seguridad"]
draft: false
---

Con **Cloudflare Tunnel** (el daemon `cloudflared`) puedes publicar servicios
de tu red local en internet **sin abrir puertos** en el router, sin IP pública
fija y sin exponer la IP de tu casa. El túnel establece una conexión saliente
hacia Cloudflare, y el tráfico entra por ahí.

En este post lo montamos en un **contenedor LXC** de Proxmox dedicado, para
tenerlo aislado del host.

> Requisito previo: un dominio gestionado por Cloudflare (los nameservers del
> dominio apuntando a Cloudflare).

## 1. Crear el contenedor con el script de Proxmox VE

En lugar de crear el LXC e instalar `cloudflared` a mano, usamos el script de la
comunidad [community-scripts.org](https://community-scripts.org/scripts/cloudflared),
que hace todo de una vez: crea el contenedor, instala cloudflared y lo deja
listo.

Desde la **shell del nodo Proxmox** (no dentro de un contenedor), ejecuta:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/ct/cloudflared.sh)"
```

El script es interactivo: te preguntará por los recursos (CPU, RAM, disco) o
puedes aceptar los ajustes por defecto, que sobran para cloudflared. Al terminar
tendrás un LXC funcionando con el daemon ya instalado.

> Ejecuta siempre estos scripts sabiendo qué hacen. Puedes revisar el código en
> el repositorio [ProxmoxVE](https://github.com/community-scripts/ProxmoxVE)
> antes de lanzarlo.

Entra en el contenedor recién creado (sustituye `<ID>` por el que te haya
asignado) para los siguientes pasos:

```bash
pct enter <ID>
cloudflared --version   # comprobar que está instalado
```

## 2. Crear el túnel en el dashboard de Cloudflare

El método más sencillo y actual es un túnel **gestionado desde el dashboard**
(*remotely-managed*): Cloudflare guarda la configuración y tú solo instalas el
daemon con un token. Así no tienes que crear ni mantener el `config.yml` ni el
`cert.pem` a mano.

En el **Zero Trust Dashboard** (`one.dash.cloudflare.com`):

1. Ve a **Networks → Tunnels → Create a tunnel**.
2. Elige el tipo **Cloudflared**.
3. Ponle un nombre, por ejemplo `homelab`, y guarda.
4. Cloudflare te mostrará el comando de instalación con un **token**. Copia la
   cadena larga que va tras `--token`.

> Con este método **no necesitas** `cloudflared tunnel login` ni gestionar
> `cert.pem` manualmente: el token ya lleva embebidas las credenciales del túnel.

## 3. Instalar el túnel como servicio con el token

En el contenedor `cloudflared`, instala el daemon como servicio de systemd
pasándole el token que copiaste:

```bash
cloudflared service install <TOKEN>
```

Esto registra y arranca cloudflared como servicio systemd con el token
embebido. Verifica que está corriendo y conectado:

```bash
systemctl status cloudflared
journalctl -u cloudflared -f
```

En el dashboard, el túnel `homelab` debería aparecer como **HEALTHY**.

## 4. Publicar servicios (Public Hostnames)

Con el túnel gestionado desde el dashboard, las rutas se definen ahí mismo, no
en un fichero local. En la página del túnel `homelab`, pestaña
**Public Hostnames → Add a public hostname**:

| Campo     | Ejemplo                       |
| --------- | ----------------------------- |
| Subdomain | `homeassistant`               |
| Domain    | `midominio.es`                |
| Service   | `HTTPS` → `192.168.1.30:8123` |

Al guardar, Cloudflare crea automáticamente el registro DNS (CNAME hacia el
túnel). Repite para cada servicio (por ejemplo `proxmox.midominio.es` →
`HTTPS` `192.168.1.10:8006`).

> Si el servicio usa un certificado autofirmado (como Proxmox o Home Assistant
> por HTTPS), despliega **Additional application settings → TLS** y activa
> **No TLS Verify** para evitar errores de certificado.

Y listo: `https://homeassistant.midominio.es` resuelve a tu servicio interno
sin haber abierto un solo puerto.

## Recomendación de seguridad

Exponer el panel de Proxmox directamente a internet no es lo más prudente,
aunque sea por túnel. Protégelo con **Cloudflare Access** (Zero Trust) para
exigir login antes de llegar al servicio:

- En el panel de **Zero Trust → Access → Applications**, crea una aplicación
  self-hosted apuntando a `proxmox.midominio.es`.
- Define una política que solo permita tu email (o un grupo).

Así, aunque alguien descubra el subdominio, Cloudflare le pedirá autenticarse
antes de reenviar la petición a tu red.

## Comandos útiles

```bash
systemctl status cloudflared      # estado del servicio
systemctl restart cloudflared     # reiniciar tras cambios
journalctl -u cloudflared -f      # ver logs en vivo
cloudflared --version             # versión instalada
```

Con esto tienes acceso remoto a tu laboratorio de Proxmox sin abrir un solo
puerto. En un próximo post veré cómo enrutar **redes completas** con
`warp-routing` en lugar de servicios sueltos.
