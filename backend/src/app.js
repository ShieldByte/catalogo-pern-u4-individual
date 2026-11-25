const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProductsRouter } = require("./routes/products.routes");
const { notFoundApi, errorHandler } = require("./middleware/errorHandler");

// createApp recibe sus dependencias (repositorios). Así las pruebas pueden usar
// repositorios en memoria y la aplicación real usa PostgreSQL.
function createApp({ productsRepo }) {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
  app.use(express.json());
  if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

  app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));
  app.use("/api/products", createProductsRouter(productsRepo));

  app.use("/api", notFoundApi);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
