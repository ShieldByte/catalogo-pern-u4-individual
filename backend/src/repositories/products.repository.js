// Acceso a datos de productos. Todas las consultas son parametrizadas ($1, $2...).
const COLUMNS = "id, name, price, image, created_at";

function createProductsRepository(db) {
  return {
    async findAll() {
      return db.query(`SELECT ${COLUMNS} FROM products ORDER BY created_at DESC, id DESC`);
    },

    async findById(id) {
      const rows = await db.query(`SELECT ${COLUMNS} FROM products WHERE id = $1`, [id]);
      return rows[0] ?? null;
    },

    async update(id, { name, price, image }) {
      const rows = await db.query(
        `UPDATE products SET name = $1, price = $2, image = $3 WHERE id = $4 RETURNING ${COLUMNS}`,
        [name, price, image, id]
      );
      return rows[0] ?? null;
    },

    async remove(id) {
      const rows = await db.query(`DELETE FROM products WHERE id = $1 RETURNING ${COLUMNS}`, [id]);
      return rows[0] ?? null;
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
