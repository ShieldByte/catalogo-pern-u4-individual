const { toProductDTO } = require("../dto/product.dto");

function createProductsController(productsRepo) {
  return {
    // GET /api/products
    async getProducts(req, res) {
      const rows = await productsRepo.findAll();
      res.status(200).json({ success: true, data: rows.map(toProductDTO) });
    },
  };
}

module.exports = { createProductsController };
