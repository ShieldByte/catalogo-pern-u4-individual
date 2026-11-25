const request = require("supertest");
const { crearAppDePrueba, admin } = require("./helpers/testApp");

const dosProductos = [
  { id: 1, name: "Audífonos inalámbricos", price: "899.00", image: "https://example.com/a.jpg" },
  { id: 2, name: "Reloj minimalista", price: "1249.50", image: "https://example.com/b.jpg" },
];

describe("HU01 · GET /api/products", () => {
  test("con dos productos responde 200 y devuelve ambos", async () => {
    const app = crearAppDePrueba(dosProductos).app;

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data.map((p) => p.name)).toEqual(
      expect.arrayContaining(["Audífonos inalámbricos", "Reloj minimalista"])
    );
  });

  test("convierte el precio a número en el DTO", async () => {
    const app = crearAppDePrueba(dosProductos).app;

    const res = await request(app).get("/api/products");

    expect(typeof res.body.data[0].price).toBe("number");
  });

  test("con la tabla vacía responde 200 con una lista vacía en data", async () => {
    const app = crearAppDePrueba([]).app;

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: [] });
  });
});
