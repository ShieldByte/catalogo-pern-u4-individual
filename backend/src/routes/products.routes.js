const { Router } = require("express");
const { createProductsController } = require("../controllers/products.controller");
const { validateBody } = require("../middleware/validate");
const { productInputSchema } = require("../dto/product.dto");

// Las rutas sólo delegan cada operación a su controlador.
function createProductsRouter(productsRepo) {
  const router = Router();
  const controller = createProductsController(productsRepo);

  router.get("/", controller.getProducts);
  router.post("/", validateBody(productInputSchema), controller.createProduct);
  router.get("/:id", controller.getProduct);
  router.put("/:id", validateBody(productInputSchema), controller.updateProduct);
  router.delete("/:id", controller.deleteProduct);

  return router;
}

module.exports = { createProductsRouter };
