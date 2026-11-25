// Repositorios en memoria: misma interfaz que los de PostgreSQL, sin base de datos.
function createMemoryProductsRepository(initial = []) {
  let rows = initial.map((p, i) => ({ id: p.id ?? i + 1, created_at: new Date().toISOString(), ...p }));
  let nextId = rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;

  return {
    async findAll() {
      return [...rows].sort((a, b) => b.id - a.id);
    },
    async findById(id) {
      return rows.find((r) => r.id === id) ?? null;
    },
    async update(id, { name, price, image }) {
      const row = rows.find((r) => r.id === id);
      if (!row) return null;
      Object.assign(row, { name, price: String(price), image });
      return row;
    },
    async remove(id) {
      const row = rows.find((r) => r.id === id);
      if (!row) return null;
      rows = rows.filter((r) => r.id !== id);
      return row;
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

function createMemoryUsersRepository(users = []) {
  return {
    async findByEmail(email) {
      return users.find((u) => u.email === email) ?? null;
    },
    async findById(id) {
      const u = users.find((x) => x.id === id);
      return u ? { id: u.id, name: u.name, email: u.email, role: u.role } : null;
    },
  };
}

module.exports.createMemoryUsersRepository = createMemoryUsersRepository;
