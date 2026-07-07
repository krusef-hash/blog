---
title: "Entorno de desarrollo Laravel con Docker Compose"
description: "Un docker-compose.yml mínimo para levantar Laravel con PHP-FPM, Nginx y MySQL en local, sin ensuciar el sistema."
pubDate: 2026-07-06
tags: ["docker", "laravel", "php"]
draft: false
---

Montar Laravel en local sin instalar PHP, Nginx ni MySQL en el sistema es
muy cómodo con Docker. Aquí dejo un `docker-compose.yml` mínimo y funcional.

## Estructura

```text
mi-proyecto/
├── docker-compose.yml
├── docker/
│   └── nginx/
│       └── default.conf
└── src/            # aquí va el código de Laravel
```

## docker-compose.yml

```yaml
services:
  app:
    image: php:8.3-fpm
    volumes:
      - ./src:/var/www/html
    working_dir: /var/www/html

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./src:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: laravel
      MYSQL_ROOT_PASSWORD: secret
    ports:
      - "3306:3306"
    volumes:
      - dbdata:/var/lib/mysql

volumes:
  dbdata:
```

## Configuración de Nginx

```nginx
server {
    listen 80;
    index index.php;
    root /var/www/html/public;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass app:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## Arrancar

```bash
docker compose up -d
docker compose exec app php artisan migrate
```

Y listo: `http://localhost:8080`. En un próximo post veré cómo añadir
**Redis** y **colas** a este mismo stack.
