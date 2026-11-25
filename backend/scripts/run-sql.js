// Ejecuta un archivo .sql contra DATABASE_URL. Uso: node scripts/run-sql.js database/schema.sql
require("dotenv").config({ quiet: true });
const fs = require("fs");
const path = require("path");
const { createDb } = require("../src/config/db");

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Indica el archivo .sql");
  const db = createDb(process.env.DATABASE_URL);
  const sql = fs.readFileSync(path.resolve(file), "utf8");
  // Se separan las sentencias por ";" al final de línea.
  const statements = sql
    .split(/;\s*$/m)
    .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);
  for (const statement of statements) {
    await db.query(statement);
  }
  console.log(`OK: ${statements.length} sentencia(s) de ${file}`);
  if (db.end) await db.end();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
