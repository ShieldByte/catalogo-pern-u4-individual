# INV01 · Diseño del acceso por roles

Investigación aplicada sobre el inicio de sesión del catálogo y su implementación.

## 1. Flujo de inicio de sesión

```
Visitante ──► Catálogo (GET /api/products) ──► puede ver todo sin sesión
    │
    └─► "Iniciar sesión" ──► POST /api/auth/login { email, password }
                                  │
                   Express: Zod valida el cuerpo
                                  │
                   usersRepo.findByEmail(email)  (consulta parametrizada)
                                  │
                   bcrypt.compare(password, password_hash)
                       │                         │
                  no coincide                 coincide
                       │                         │
          401 "Correo o contraseña      200 { token (JWT, 2 h), user: { id, name, email, role } }
               incorrectos"                      │
                                   React guarda la sesión y envía
                                   Authorization: Bearer <token> en cada petición
                                                 │
                     POST / PUT / DELETE /api/products ──► requireAuth ──► requireRole("admin") ──► controlador
```

- La contraseña nunca se guarda en texto: la tabla `users` sólo tiene `password_hash` (bcrypt, costo 10).
- El token JWT lleva únicamente `sub` (id del usuario) y `role`. Se firma con `JWT_SECRET`, que vive en `.env` y no se sube a Git.
- El mensaje de error es el mismo si el correo no existe o la contraseña es incorrecta, para no revelar qué cuentas existen (recomendación de OWASP). Cuando el correo no existe se compara contra un hash de relleno para que el tiempo de respuesta sea parecido.
- Si la API responde 401 a una petición con sesión, React cierra la sesión y pide volver a entrar.

## 2. Matriz de permisos

| Operación | Ruta | Visitante (sin sesión) | Usuario `consulta` | `admin` |
|---|---|:---:|:---:|:---:|
| Consultar catálogo | `GET /api/products` | ✅ | ✅ | ✅ |
| Ver un producto | `GET /api/products/:id` | ✅ | ✅ | ✅ |
| Crear producto | `POST /api/products` | ❌ 401 | ❌ 403 | ✅ 201 |
| Editar producto | `PUT /api/products/:id` | ❌ 401 | ❌ 403 | ✅ 200 |
| Eliminar producto | `DELETE /api/products/:id` | ❌ 401 | ❌ 403 | ✅ 200 |

El rol `consulta` existe para comprobar el caso «autenticado pero sin permiso».

## 3. Dónde se comprueba identidad y rol en Express

| Capa | Archivo | Qué decide |
|---|---|---|
| Identidad | `backend/src/middleware/auth.js` → `requireAuth` | Lee `Authorization: Bearer`, verifica la firma y la expiración del JWT. Sin token o token inválido → **401**. |
| Rol | `backend/src/middleware/auth.js` → `requireRole("admin")` | Compara `req.user.role`. Autenticado sin permiso → **403**. |
| Rutas | `backend/src/routes/products.routes.js` | Aplica `[requireAuth, requireRole("admin")]` sólo a POST, PUT y DELETE. Los GET quedan públicos. |
| Validación | `backend/src/middleware/validate.js` | Se ejecuta **después** de los permisos: quien no tiene permiso recibe 401/403 aunque mande datos inválidos. |

El frontend oculta los botones de crear, editar y eliminar a quien no es administrador, pero la seguridad real está en la API: aunque alguien llame directamente a la API con Postman, Express rechaza la operación.

## 4. Pruebas propuestas e implementadas

Archivo `backend/tests/auth.test.js` (Jest + Supertest):

| Caso | Petición | Esperado |
|---|---|---|
| Solicitud sin sesión | POST, PUT y DELETE sin `Authorization` | **401** y el producto no cambia |
| Token alterado | DELETE con `Bearer token.falso.123` | **401** |
| Autenticado sin permiso | POST, PUT y DELETE con token de `consulta` | **403** y el producto no cambia |
| Administrador autorizado | POST, PUT y DELETE con token de `admin` | **201**, **200**, **200** |
| Visitante consulta | GET lista y detalle sin sesión | **200** |
| Login correcto | `admin@catalogo.test` / `Admin123!` | **200** con token y rol, sin contraseña en la respuesta |
| Login incorrecto | contraseña mala o correo inexistente | **401** con el mismo mensaje |

## 5. Usuarios de práctica (datos ficticios)

| Correo | Contraseña | Rol |
|---|---|---|
| admin@catalogo.test | Admin123! | admin |
| consulta@catalogo.test | Consulta123! | consulta |

Se cargan con `npm run db:seed`. En un sistema real estas cuentas se crearían con contraseñas propias y no se publicarían.

## Referencias

- Fazt · *PERN Stack* (proyecto de referencia para autenticación con JWT en Express y React).
- OWASP · *Authentication Cheat Sheet*: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP · *Password Storage Cheat Sheet*: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
