// Acceso a usuarios. Nunca se devuelve password_hash fuera del backend.
function createUsersRepository(db) {
  return {
    async findByEmail(email) {
      const rows = await db.query(
        "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
        [email]
      );
      return rows[0] ?? null;
    },
    async findById(id) {
      const rows = await db.query("SELECT id, name, email, role FROM users WHERE id = $1", [id]);
      return rows[0] ?? null;
    },
  };
}

module.exports = { createUsersRepository };
