const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProductsRouter } = require("./routes/products.routes");
const { createAuthRouter } = require("./routes/auth.routes");
const { notFoundApi, errorHandler } = require("./middleware/errorHandler");
const { createArcjetMiddleware } = require("./middleware/arcjet");

// createApp recibe sus dependencias (repositorios). Así las pruebas pueden usar
// repositorios en memoria y la aplicación real usa PostgreSQL.
function createApp({ productsRepo, usersRepo, jwtSecret }) {
  if (!jwtSecret) throw new Error("Falta JWT_SECRET");
  const app = express();

  // Las imágenes del catálogo vienen de URLs externas: se permite cargarlas por https.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: { "img-src": ["'self'", "data:", "https:"] },
      },
    })
  );
  app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
  app.use(express.json());
  if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

  app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));
  app.use("/api", createArcjetMiddleware(process.env.ARCJET_KEY));
  app.use("/api/auth", createAuthRouter(usersRepo, { jwtSecret }));
  app.use("/api/products", createProductsRouter(productsRepo, { jwtSecret }));

  app.use("/api", notFoundApi);

  // HU05: en producción Express también sirve la compilación de React (mismo origen).
  if (process.env.NODE_ENV === "production") {
    const dist = path.resolve(__dirname, "../../frontend/dist");
    app.use(express.static(dist));
    app.get("/{*splat}", (req, res) => res.sendFile(path.join(dist, "index.html")));
  }

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
