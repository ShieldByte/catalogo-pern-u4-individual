// Acceso a datos de productos. Todas las consultas son parametrizadas ($1, $2...).
const COLUMNS = "id, name, price, image, created_at";

function createProductsRepository(db) {
  return {
    async findAll() {
      return db.query(`SELECT ${COLUMNS} FROM products ORDER BY created_at DESC, id DESC`);
    },

    async create({ name, price, image }) {
      const rows = await db.query(
        `INSERT INTO products (name, price, image) VALUES ($1, $2, $3) RETURNING ${COLUMNS}`,
        [name, price, image]
      );
      return rows[0];
    },
  };
}

module.exports = { createProductsRepository };
