const request = require("supertest");
const { createApp } = require("../src/app");
const { createMemoryProductsRepository } = require("./helpers/memoryRepos");

const valido = { name: "  Teclado mecánico  ", price: 1599.9, image: "https://example.com/teclado.jpg" };

function crearApp() {
  const productsRepo = createMemoryProductsRepository([]);
  return { app: createApp({ productsRepo }), productsRepo };
}

describe("HU02 · POST /api/products", () => {
  test("un alta válida responde 201, quita espacios del nombre y aparece en la lista", async () => {
    const { app } = crearApp();

    const res = await request(app).post("/api/products").send(valido);

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ id: 1, name: "Teclado mecánico", price: 1599.9 });

    const lista = await request(app).get("/api/products");
    expect(lista.body.data.map((p) => p.name)).toContain("Teclado mecánico");
  });

  test("un precio inválido responde 400 y no crea el registro", async () => {
    const { app, productsRepo } = crearApp();

    const res = await request(app).post("/api/products").send({ ...valido, price: -10 });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "price" })])
    );
    expect(productsRepo._rows()).toHaveLength(0);
  });

  test("un precio que no es número responde 400", async () => {
    const { app } = crearApp();

    const res = await request(app).post("/api/products").send({ ...valido, price: "abc" });

    expect(res.status).toBe(400);
  });

  test("un nombre con sólo espacios responde 400", async () => {
    const { app, productsRepo } = crearApp();

    const res = await request(app).post("/api/products").send({ ...valido, name: "    " });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe("name");
    expect(productsRepo._rows()).toHaveLength(0);
  });

  test("una imagen que no es URL responde 400", async () => {
    const { app } = crearApp();

    const res = await request(app).post("/api/products").send({ ...valido, image: "foto.jpg" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe("image");
  });

  test("un cuerpo vacío responde 400 con los tres campos", async () => {
    const { app } = crearApp();

    const res = await request(app).post("/api/products").send({});

    expect(res.status).toBe(400);
    expect(res.body.errors.map((e) => e.field).sort()).toEqual(["image", "name", "price"]);
  });
});
