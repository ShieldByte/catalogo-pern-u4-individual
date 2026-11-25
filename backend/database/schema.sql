-- Esquema del catálogo (HU01).
-- Ejecutar en el SQL Editor de Neon o con: npm run db:schema
CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120)   NOT NULL CHECK (length(trim(name)) > 0),
  price       NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  image       VARCHAR(500)   NOT NULL,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
