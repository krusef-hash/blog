// Une el `base` configurado (p. ej. "/blog") con una ruta interna.
// Úsalo SIEMPRE para enlaces internos y assets, así funciona igual en
// local (base "/") que en GitHub Pages (base "/blog").
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // sin barra final
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}` || '/';
}

// Formatea una fecha en español: "7 de julio de 2026".
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Versión corta para atributos datetime (ISO).
export function isoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
