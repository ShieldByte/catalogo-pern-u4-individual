// Conexión a PostgreSQL.
// En Neon se usa @neondatabase/serverless (consultas parametrizadas por HTTP).
// Con un PostgreSQL local se usa el driver "pg". Ambos exponen la misma función query().
const { neon } = require("@neondatabase/serverless");
const { Pool } = require("pg");

function createDb(databaseUrl) {
  if (!databaseUrl) {
    throw new Error("Falta la variable DATABASE_URL. Revisa backend/.env.example");
  }

  if (/neon\.tech/.test(databaseUrl)) {
    const sql = neon(databaseUrl);
    return {
      query: (text, params = []) => sql.query(text, params),
    };
  }

  const pool = new Pool({ connectionString: databaseUrl });
  return {
    query: async (text, params = []) => (await pool.query(text, params)).rows,
    end: () => pool.end(),
  };
}

module.exports = { createDb };
