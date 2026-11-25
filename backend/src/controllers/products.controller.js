const { toProductDTO } = require("../dto/product.dto");

function createProductsController(productsRepo) {
  return {
    // GET /api/products
    async getProducts(req, res) {
      const rows = await productsRepo.findAll();
      res.status(200).json({ success: true, data: rows.map(toProductDTO) });
    },

    // POST /api/products (req.body ya fue validado con Zod)
    async createProduct(req, res) {
      const created = await productsRepo.create(req.body);
      res.status(201).json({ success: true, data: toProductDTO(created) });
    },
  };
}

module.exports = { createProductsController };
