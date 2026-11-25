const { Router } = require("express");
const { createAuthController } = require("../controllers/auth.controller");
const { validateBody } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const { loginSchema } = require("../dto/auth.dto");

function createAuthRouter(usersRepo, { jwtSecret }) {
  const router = Router();
  const controller = createAuthController(usersRepo, { jwtSecret });

  router.post("/login", validateBody(loginSchema), controller.login);
  router.get("/me", requireAuth(jwtSecret), controller.me);

  return router;
}

module.exports = { createAuthRouter };
