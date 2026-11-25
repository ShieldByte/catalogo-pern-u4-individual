const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createApp } = require("../../src/app");
const { createMemoryProductsRepository, createMemoryUsersRepository } = require("./memoryRepos");

const JWT_SECRET = "secreto-de-pruebas";

const usuarios = [
  { id: 1, name: "Administrador", email: "admin@catalogo.test", password_hash: bcrypt.hashSync("Admin123!", 4), role: "admin" },
  { id: 2, name: "Usuario de consulta", email: "consulta@catalogo.test", password_hash: bcrypt.hashSync("Consulta123!", 4), role: "consulta" },
];

function crearAppDePrueba(productos = []) {
  const productsRepo = createMemoryProductsRepository(productos);
  const usersRepo = createMemoryUsersRepository(usuarios);
  const app = createApp({ productsRepo, usersRepo, jwtSecret: JWT_SECRET });
  return { app, productsRepo };
}

// Encabezado Authorization con un token válido para el rol indicado.
function comoRol(role) {
  const user = usuarios.find((u) => u.role === role);
  const token = jwt.sign({ sub: String(user.id), role }, JWT_SECRET, { expiresIn: "5m" });
  return { Authorization: `Bearer ${token}` };
}

const admin = () => comoRol("admin");

module.exports = { crearAppDePrueba, comoRol, admin, JWT_SECRET };
