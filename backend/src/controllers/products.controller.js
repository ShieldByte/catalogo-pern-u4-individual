const { toProductDTO, idParamSchema } = require("../dto/product.dto");

const notFound = (res) => res.status(404).json({ success: false, message: "Producto no encontrado" });
const badId = (res) => res.status(400).json({ success: false, message: "El id debe ser un entero positivo" });

function createProductsController(productsRepo) {
  return {
    // GET /api/products
    async getProducts(req, res) {
      const rows = await productsRepo.findAll();
      res.status(200).json({ success: true, data: rows.map(toProductDTO) });
    },

    // GET /api/products/:id
    async getProduct(req, res) {
      const id = idParamSchema.safeParse(req.params.id);
      if (!id.success) return badId(res);
      const row = await productsRepo.findById(id.data);
      if (!row) return notFound(res);
      res.status(200).json({ success: true, data: toProductDTO(row) });
    },

    // PUT /api/products/:id (formulario completo, validado con Zod)
    async updateProduct(req, res) {
      const id = idParamSchema.safeParse(req.params.id);
      if (!id.success) return badId(res);
      const updated = await productsRepo.update(id.data, req.body);
      if (!updated) return notFound(res);
      res.status(200).json({ success: true, data: toProductDTO(updated) });
    },

    // DELETE /api/products/:id
    async deleteProduct(req, res) {
      const id = idParamSchema.safeParse(req.params.id);
      if (!id.success) return badId(res);
      const deleted = await productsRepo.remove(id.data);
      if (!deleted) return notFound(res);
      res.status(200).json({ success: true, data: toProductDTO(deleted) });
    },

    // POST /api/products (req.body ya fue validado con Zod)
    async createProduct(req, res) {
      const created = await productsRepo.create(req.body);
      res.status(201).json({ success: true, data: toProductDTO(created) });
    },
  };
}

module.exports = { createProductsController };
