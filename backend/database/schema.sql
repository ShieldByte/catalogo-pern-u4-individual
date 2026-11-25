-- Esquema del catálogo (HU01).
-- Ejecutar en el SQL Editor de Neon o con: npm run db:schema
CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120)   NOT NULL CHECK (length(trim(name)) > 0),
  price       NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  image       VARCHAR(500)   NOT NULL,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- INV01: usuarios y roles.
-- admin    → consulta, crea, edita y elimina productos
-- consulta → sólo consulta (sirve para probar la respuesta 403)
CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(80)  NOT NULL,
  email          VARCHAR(120) NOT NULL UNIQUE,
  password_hash  VARCHAR(100) NOT NULL,
  role           VARCHAR(20)  NOT NULL CHECK (role IN ('admin', 'consulta')),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
