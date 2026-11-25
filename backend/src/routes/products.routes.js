const { Router } = require("express");
const { createProductsController } = require("../controllers/products.controller");
const { validateBody } = require("../middleware/validate");
const { requireAuth, requireRole } = require("../middleware/auth");
const { productInputSchema } = require("../dto/product.dto");

// Las rutas sólo delegan cada operación a su controlador.
// Matriz de permisos (INV01): consultar es público; crear, editar y eliminar es sólo para admin.
function createProductsRouter(productsRepo, { jwtSecret }) {
  const router = Router();
  const controller = createProductsController(productsRepo);
  const soloAdmin = [requireAuth(jwtSecret), requireRole("admin")];

  router.get("/", controller.getProducts);
  router.get("/:id", controller.getProduct);
  router.post("/", ...soloAdmin, validateBody(productInputSchema), controller.createProduct);
  router.put("/:id", ...soloAdmin, validateBody(productInputSchema), controller.updateProduct);
  router.delete("/:id", ...soloAdmin, controller.deleteProduct);

  return router;
}

module.exports = { createProductsRouter };
