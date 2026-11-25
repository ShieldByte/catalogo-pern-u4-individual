# Catálogo PERN · Unidad 4 (versión individual)

Aplicación para consultar, crear, editar y eliminar productos de un comercio pequeño. Cada producto tiene identificador, nombre, precio e imagen (URL). Los datos son ficticios.

| Componente | Responsabilidad |
|---|---|
| **React + Vite** | Presenta el catálogo y los formularios, y muestra el resultado de cada operación. |
| **API REST en Express** | Recibe la petición, valida la entrada con Zod, ejecuta la operación y responde con JSON y un estado HTTP. |
| **PostgreSQL en Neon** | Almacena los productos y aplica las restricciones del esquema. |

Autor: Pablo Alexander Alejos Macías (ShieldByte) · Ingeniería de Software, Grupo A · TecNM Celaya.

- **Repositorio:** https://github.com/ShieldByte/catalogo-pern-u4-individual
- **Aplicación publicada:** _(se agrega al desplegar en Render)_
- **Tablero:** GitHub Projects «Catálogo PERN · U4 individual» _(enlace en la pestaña Projects del repositorio)_
- **Investigación de login:** [docs/INV01-login.md](docs/INV01-login.md)

## Historias por jornada

| Jornada | Historia | Incremento | Etiqueta |
|---|---|---|---|
| 1 | HU01 · Consultar catálogo | Lista de productos persistidos visible en React | `u4-j1` |
| 2 | HU02 · Dar de alta | Formulario conectado a la API y alta validada con Zod | `u4-j2` |
| 3 | HU03 · Editar | Cambio persistente desde la pantalla de producto | `u4-j3` |
| 4 | HU04 · Eliminar | Baja confirmada y catálogo actualizado | `u4-j4` |
| 5 | HU05 · Usar el catálogo publicado | Versión desplegada en Render | `u4-j5` |
| Compl. | INV01 · Diseñar el acceso por roles | Login, matriz de permisos y pruebas 401/403 | — |

## Requisitos

- Node.js 20 o superior y npm
- Una base de datos PostgreSQL en [Neon](https://neon.tech) (plan gratuito)

## Variables de entorno

Copia `backend/.env.example` como `backend/.env` (el archivo `.env` no se sube a Git):

| Variable | Obligatoria | Ejemplo / uso |
|---|---|---|
| `DATABASE_URL` | Sí | Cadena de conexión de Neon (`postgresql://...neon.tech/neondb?sslmode=require`) |
| `JWT_SECRET` | Sí | Cadena larga y aleatoria para firmar los tokens de sesión |
| `PORT` | No | Puerto de la API, por defecto `3000` |
| `CLIENT_URL` | No | Origen permitido por CORS, por defecto `http://localhost:5173` |
| `NODE_ENV` | No | `development`, `test` o `production` |
| `ARCJET_KEY` | No | Activa el límite de solicitudes (token bucket) y la detección de bots |

## Preparación de PostgreSQL (Neon)

1. En Neon crea un proyecto y copia la *connection string* (Dashboard → Connect).
2. Pégala en `DATABASE_URL` dentro de `backend/.env`.
3. Crea las tablas y carga los datos de ejemplo:

```bash
cd backend
npm install
npm run db:schema   # database/schema.sql: tablas products y users
npm run db:seed     # database/seed.sql: 2 productos y 2 usuarios de práctica
```

También puedes pegar el contenido de esos dos archivos en el SQL Editor de Neon.

Usuarios de práctica (datos ficticios):

| Correo | Contraseña | Rol |
|---|---|---|
| admin@catalogo.test | Admin123! | admin (crea, edita y elimina) |
| consulta@catalogo.test | Consulta123! | consulta (sólo consulta) |

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

Vite redirige las peticiones `/api` al backend.

## Pruebas automatizadas

```bash
cd backend
npm test
```

Jest + Supertest prueban la interfaz HTTP de Express con repositorios en memoria (no necesitan base de datos): 31 pruebas que cubren HU01–HU04 e INV01.

| Archivo | Qué comprueba |
|---|---|
| `tests/products.get.test.js` | HU01: 200 con dos productos y 200 con lista vacía |
| `tests/products.post.test.js` | HU02: alta válida 201; precio, nombre o imagen inválidos 400 sin crear registro |
| `tests/products.put.test.js` | HU03: edición persistente, datos inválidos 400, id inexistente 404 |
| `tests/products.delete.test.js` | HU04: baja 200, ya no aparece; id inexistente 404 |
| `tests/auth.test.js` | INV01: login, sin sesión 401, autenticado sin permiso 403, admin autorizado |

Para pruebas manuales importa `postman/catalogo-pern.postman_collection.json` en Postman (ejecuta primero «Login admin»).

## API

| Método | Ruta | Acceso | Respuestas |
|---|---|---|---|
| GET | `/api/products` | Público | 200 `{ success, data: [] }` |
| GET | `/api/products/:id` | Público | 200, 400 id inválido, 404 |
| POST | `/api/products` | admin | 201, 400 validación, 401, 403 |
| PUT | `/api/products/:id` | admin | 200, 400, 401, 403, 404 |
| DELETE | `/api/products/:id` | admin | 200, 401, 403, 404 |
| POST | `/api/auth/login` | Público | 200 `{ token, user }`, 400, 401 |
| GET | `/api/auth/me` | Con sesión | 200, 401 |
| GET | `/api/health` | Público | 200 |

DTO de entrada (Zod): `name` texto de 1 a 120 caracteres sin espacios sobrantes, `price` número mayor que cero, `image` URL http(s).

## Despliegue en Render (HU05)

El repositorio incluye `render.yaml`. Un solo servicio web: Express sirve la API y la compilación de React desde el mismo origen.

1. En Render: **New → Blueprint** y elige este repositorio (o **New → Web Service** con los comandos de abajo).
2. Build command: `npm run build` · Start command: `npm start`.
3. Variables: `NODE_ENV=production`, `DATABASE_URL` (la de Neon) y `JWT_SECRET` (Render puede generarla).
4. Abre la URL pública desde otra computadora: el catálogo debe cargar los productos de PostgreSQL. La consulta es pública; crear, editar y eliminar exige iniciar sesión como administrador.

## Estructura

```
backend/
  database/        schema.sql y seed.sql
  scripts/         run-sql.js (ejecuta un .sql contra DATABASE_URL)
  src/
    config/db.js   conexión: @neondatabase/serverless con Neon, pg con PostgreSQL local
    dto/           esquemas Zod de entrada y DTO de salida
    repositories/  consultas parametrizadas
    controllers/   lógica de cada operación
    routes/        rutas REST que delegan en los controladores
    middleware/    validación, autenticación/roles, Arcjet y errores
  tests/           Jest + Supertest
frontend/
  src/store/       Zustand (productos y sesión)
  src/pages/       catálogo, producto y login
  src/components/  tarjetas, formulario y modales
docs/              INV01 y evidencias
postman/           colección de pruebas manuales
```
