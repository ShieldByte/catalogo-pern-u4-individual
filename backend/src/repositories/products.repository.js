// Acceso a datos de productos. Todas las consultas son parametrizadas ($1, $2...).
function createProductsRepository(db) {
  return {
    async findAll() {
      return db.query(
        "SELECT id, name, price, image, created_at FROM products ORDER BY created_at DESC, id DESC"
      );
    },
  };
}

module.exports = { createProductsRepository };
