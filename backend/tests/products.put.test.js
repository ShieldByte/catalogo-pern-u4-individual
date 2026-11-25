const request = require("supertest");
const { createApp } = require("../src/app");
const { createMemoryProductsRepository } = require("./helpers/memoryRepos");

function crearApp() {
  const productsRepo = createMemoryProductsRepository([
    { id: 1, name: "Audífonos inalámbricos", price: "899.00", image: "https://example.com/a.jpg" },
  ]);
  return createApp({ productsRepo });
}

const cambios = { name: "Audífonos con cancelación de ruido", price: 1099, image: "https://example.com/a2.jpg" };

describe("HU03 · GET y PUT /api/products/:id", () => {
  test("GET carga un producto existente por su id", async () => {
    const res = await request(crearApp()).get("/api/products/1");

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Audífonos inalámbricos");
  });

  test("GET de un id inexistente responde 404", async () => {
    const res = await request(crearApp()).get("/api/products/99");

    expect(res.status).toBe(404);
  });

  test("PUT guarda el formulario completo y el cambio persiste al volver a consultar", async () => {
    const app = crearApp();

    const res = await request(app).put("/api/products/1").send(cambios);
    const despues = await request(app).get("/api/products/1");

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ id: 1, ...cambios });
    expect(despues.body.data).toMatchObject(cambios);
  });

  test("PUT con datos inválidos responde 400 y no cambia el producto", async () => {
    const app = crearApp();

    const res = await request(app).put("/api/products/1").send({ ...cambios, price: 0 });
    const despues = await request(app).get("/api/products/1");

    expect(res.status).toBe(400);
    expect(despues.body.data.price).toBe(899);
  });

  test("PUT de un id inexistente responde 404", async () => {
    const res = await request(crearApp()).put("/api/products/99").send(cambios);

    expect(res.status).toBe(404);
  });

  test("un id que no es entero positivo responde 400", async () => {
    const res = await request(crearApp()).get("/api/products/abc");

    expect(res.status).toBe(400);
  });
});
