require("dotenv").config({ quiet: true });
const { createDb } = require("./config/db");
const { createApp } = require("./app");
const { createProductsRepository } = require("./repositories/products.repository");

const PORT = process.env.PORT || 3000;
const db = createDb(process.env.DATABASE_URL);

const app = createApp({
  productsRepo: createProductsRepository(db),
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
