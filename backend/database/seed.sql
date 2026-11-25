-- Datos ficticios de prueba (dos productos para HU01).
-- Ejecutar después de schema.sql: npm run db:seed
INSERT INTO products (name, price, image) VALUES
  ('Audífonos inalámbricos', 899.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'),
  ('Reloj minimalista', 1249.50, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600');

-- Usuarios de práctica (contraseñas guardadas con bcrypt).
-- admin@catalogo.test    / Admin123!
-- consulta@catalogo.test / Consulta123!
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Administrador', 'admin@catalogo.test', '$2b$10$toQl8xccxuoze9WwYJ5qE.w/XdjlhsT.8Gkn105.9qil/LXXh.m66', 'admin'),
  ('Usuario de consulta', 'consulta@catalogo.test', '$2b$10$2zI0xW1IRjSxcPgMfk8WiOPkReQNn5SH0WtrHtg4BsJLCZZtvkaDi', 'consulta')
ON CONFLICT (email) DO NOTHING;
