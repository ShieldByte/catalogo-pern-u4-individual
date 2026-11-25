const request = require("supertest");
const { crearAppDePrueba, admin } = require("./helpers/testApp");

function crearApp() {
  return crearAppDePrueba([
    { id: 1, name: "Audífonos inalámbricos", price: "899.00", image: "https://example.com/a.jpg" },
    { id: 2, name: "Reloj minimalista", price: "1249.50", image: "https://example.com/b.jpg" },
  ]).app;
}

describe("HU04 · DELETE /api/products/:id", () => {
  test("confirmar la baja responde 200 y el producto ya no aparece en la lista", async () => {
    const app = crearApp();

    const res = await request(app).delete("/api/products/1").set(admin());
    const lista = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
    expect(lista.body.data.map((p) => p.id)).toEqual([2]);
  });

  test("después de eliminar, consultar el mismo id responde 404", async () => {
    const app = crearApp();

    await request(app).delete("/api/products/1").set(admin());
    const res = await request(app).get("/api/products/1");

    expect(res.status).toBe(404);
  });

  test("si el id ya no existe, la API devuelve 404", async () => {
    const app = crearApp();

    await request(app).delete("/api/products/1").set(admin());
    const res = await request(app).delete("/api/products/1").set(admin());

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
