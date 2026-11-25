const { Router } = require("express");
const { createProductsController } = require("../controllers/products.controller");

// Las rutas sólo delegan cada operación a su controlador.
function createProductsRouter(productsRepo) {
  const router = Router();
  const controller = createProductsController(productsRepo);

  router.get("/", controller.getProducts);

  return router;
}

module.exports = { createProductsRouter };
