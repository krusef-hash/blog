---
title: "Vaultwarden: configurar el panel de administración y cerrar el registro"
description: "Cómo generar el ADMIN_TOKEN para el panel /admin de Vaultwarden, desactivar el registro público de cuentas y permitir el acceso solo por invitación."
pubDate: 2026-07-08
tags: ["vaultwarden", "seguridad", "self-hosting"]
draft: false
---

[Vaultwarden](https://github.com/dani-garcia/vaultwarden) es una
implementación ligera del servidor de Bitwarden, ideal para autohospedar tu
gestor de contraseñas. Tras instalarlo conviene hacer dos cosas cuanto antes:
**activar el panel de administración** (`/admin`) de forma segura y **cerrar el
registro público** para que no cualquiera pueda crearse una cuenta en tu
servidor.

Toda la configuración vive en un fichero de variables de entorno (`.env`).

## 1. Generar el ADMIN_TOKEN

El panel `/admin` se protege con un token. Genera uno aleatorio y robusto con
OpenSSL:

```bash
openssl rand -base64 48
```

Copia la cadena que devuelve; la usaremos en el siguiente paso.

## 2. Localizar el fichero de configuración

La ruta del `.env` depende de cómo hayas instalado Vaultwarden:

| Sistema         | Ruta habitual                                    |
| --------------- | ------------------------------------------------ |
| Debian / Ubuntu | `/opt/vaultwarden/.env` o `/etc/vaultwarden.env` |
| Alpine Linux    | `/etc/conf.d/vaultwarden`                         |

Ábrelo con tu editor favorito, por ejemplo:

```bash
nano /opt/vaultwarden/.env
```

## 3. Añadir el token de administración

Pega el token generado en la variable `ADMIN_TOKEN`:

```ini
ADMIN_TOKEN='K3f7z9Qw1xR2mN8pL5vT6yB4hC0jD2sE9uG7iA1oW3rX...'
```

Con esto, tras reiniciar podrás entrar en `https://tu-dominio/admin` e
introducir el token para acceder al panel.

> Guarda el token en tu propio gestor de contraseñas. Si lo pierdes, tendrás
> que generar otro y reiniciar el servicio.

## 4. Desactivar el registro público de cuentas

Para que nadie pueda crearse una cuenta libremente en tu instancia, pon
`SIGNUPS_ALLOWED` a `false`:

```ini
SIGNUPS_ALLOWED=false
```

## 5. Permitir acceso solo por invitación (opcional)

Con el registro cerrado, aún puedes dar de alta a usuarios concretos desde el
panel `/admin`. Para habilitar las invitaciones, añade:

```ini
INVITATIONS_ALLOWED=true
```

Así podrás invitar por email a las personas que quieras (familia, equipo, …)
sin abrir el registro a todo el mundo.

## 6. Reiniciar el servicio

Los cambios en el `.env` solo se aplican al reiniciar Vaultwarden:

```bash
# Debian / Ubuntu (systemd)
systemctl restart vaultwarden

# Alpine (OpenRC)
rc-service vaultwarden restart
```

## Resumen del .env

El bloque de configuración queda así:

```ini
ADMIN_TOKEN='<tu-token-generado-con-openssl>'
SIGNUPS_ALLOWED=false
INVITATIONS_ALLOWED=true
```

Con esto tienes el panel de administración protegido y tu instancia cerrada al
registro público, pero pudiendo invitar a quien quieras.

Un último apunte: para que las invitaciones **lleguen realmente** al correo de
los usuarios, hay que configurar el **SMTP** desde el propio panel `/admin`
(sección *SMTP Email Settings*): servidor, puerto, usuario y contraseña de tu
proveedor de correo. Sin un SMTP válido, Vaultwarden no puede enviar los emails
de invitación y tendrías que pasar el enlace de alta a mano.
