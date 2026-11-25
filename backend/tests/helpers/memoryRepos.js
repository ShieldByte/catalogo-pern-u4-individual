// Repositorios en memoria: misma interfaz que los de PostgreSQL, sin base de datos.
function createMemoryProductsRepository(initial = []) {
  let rows = initial.map((p, i) => ({ id: p.id ?? i + 1, created_at: new Date().toISOString(), ...p }));
  let nextId = rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;

  return {
    async findAll() {
      return [...rows].sort((a, b) => b.id - a.id);
    },
    async create({ name, price, image }) {
      const row = { id: nextId++, name, price: String(price), image, created_at: new Date().toISOString() };
      rows.push(row);
      return row;
    },
    _rows: () => rows,
  };
}

module.exports = { createMemoryProductsRepository };
