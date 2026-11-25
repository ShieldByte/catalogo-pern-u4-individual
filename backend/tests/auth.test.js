const request = require("supertest");
const { crearAppDePrueba, comoRol, admin } = require("./helpers/testApp");

const producto = { id: 1, name: "Audífonos inalámbricos", price: "899.00", image: "https://example.com/a.jpg" };
const nuevo = { name: "Teclado", price: 500, image: "https://example.com/t.jpg" };

describe("INV01 · inicio de sesión", () => {
  test("credenciales correctas devuelven 200, un token y el rol sin la contraseña", async () => {
    const { app } = crearAppDePrueba();

    const res = await request(app).post("/api/auth/login").send({ email: "ADMIN@catalogo.test", password: "Admin123!" });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toEqual(expect.any(String));
    expect(res.body.data.user).toEqual({ id: 1, name: "Administrador", email: "admin@catalogo.test", role: "admin" });
    expect(JSON.stringify(res.body)).not.toContain("password");
  });

  test("contraseña incorrecta responde 401 con un mensaje genérico", async () => {
    const { app } = crearAppDePrueba();

    const res = await request(app).post("/api/auth/login").send({ email: "admin@catalogo.test", password: "mala" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Correo o contraseña incorrectos");
  });

  test("un correo que no existe responde el mismo 401", async () => {
    const { app } = crearAppDePrueba();

    const res = await request(app).post("/api/auth/login").send({ email: "nadie@catalogo.test", password: "Admin123!" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Correo o contraseña incorrectos");
  });

  test("GET /api/auth/me devuelve el usuario de la sesión", async () => {
    const { app } = crearAppDePrueba();

    const res = await request(app).get("/api/auth/me").set(comoRol("consulta"));

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe("consulta");
  });
});

describe("INV01 · matriz de permisos", () => {
  test("el visitante sin sesión puede consultar el catálogo (200)", async () => {
    const { app } = crearAppDePrueba([producto]);

    expect((await request(app).get("/api/products")).status).toBe(200);
    expect((await request(app).get("/api/products/1")).status).toBe(200);
  });

  test.each([
    ["POST", "/api/products"],
    ["PUT", "/api/products/1"],
    ["DELETE", "/api/products/1"],
  ])("%s %s sin sesión responde 401", async (method, url) => {
    const { app, productsRepo } = crearAppDePrueba([producto]);

    const res = await request(app)[method.toLowerCase()](url).send(nuevo);

    expect(res.status).toBe(401);
    expect(productsRepo._rows()).toHaveLength(1);
  });

  test("un token alterado responde 401", async () => {
    const { app } = crearAppDePrueba([producto]);

    const res = await request(app).delete("/api/products/1").set({ Authorization: "Bearer token.falso.123" });

    expect(res.status).toBe(401);
  });

  test.each([
    ["POST", "/api/products"],
    ["PUT", "/api/products/1"],
    ["DELETE", "/api/products/1"],
  ])("%s %s con usuario autenticado sin permiso responde 403", async (method, url) => {
    const { app, productsRepo } = crearAppDePrueba([producto]);

    const res = await request(app)[method.toLowerCase()](url).set(comoRol("consulta")).send(nuevo);

    expect(res.status).toBe(403);
    expect(productsRepo._rows()[0].name).toBe("Audífonos inalámbricos");
  });

  test("el administrador autorizado sí puede crear, editar y eliminar", async () => {
    const { app } = crearAppDePrueba([producto]);

    expect((await request(app).post("/api/products").set(admin()).send(nuevo)).status).toBe(201);
    expect((await request(app).put("/api/products/1").set(admin()).send(nuevo)).status).toBe(200);
    expect((await request(app).delete("/api/products/1").set(admin())).status).toBe(200);
  });
});
