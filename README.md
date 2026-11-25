# Catálogo PERN · Unidad 4 (versión individual)

Aplicación para consultar, crear, editar y eliminar productos de un comercio pequeño.

- **React + Vite** presenta el catálogo y los formularios.
- **Express** ofrece la API REST.
- **PostgreSQL en Neon** conserva los productos.

Autor: Pablo Alexander Alejos Macías (ShieldByte) · Ingeniería de Software, Grupo A · TecNM Celaya.

## Requisitos

- Node.js 20 o superior y npm
- Una base de datos PostgreSQL en [Neon](https://neon.tech) (plan gratuito)

## Preparación de PostgreSQL (Neon)

1. En Neon crea un proyecto y copia la *connection string* (Dashboard → Connect).
2. Copia `backend/.env.example` como `backend/.env` y pega la cadena en `DATABASE_URL`.
3. Crea la tabla y carga los dos productos de ejemplo:

```bash
cd backend
npm install
npm run db:schema   # ejecuta database/schema.sql
npm run db:seed     # ejecuta database/seed.sql
```

También puedes pegar el contenido de `database/schema.sql` y `database/seed.sql` en el SQL Editor de Neon.

## Arranque en desarrollo

```bash
# Terminal 1: API en http://localhost:3000
cd backend
npm run dev

# Terminal 2: React en http://localhost:5173
cd frontend
npm install
npm run dev
```

Vite redirige las peticiones `/api` al backend, por eso no hace falta configurar CORS en desarrollo.

## Pruebas

```bash
cd backend
npm test
```
