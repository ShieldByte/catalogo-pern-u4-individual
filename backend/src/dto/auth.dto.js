const { z } = require("zod");

const loginSchema = z.object({
  email: z.string({ error: "El correo es obligatorio" }).trim().toLowerCase().pipe(z.email("Correo inválido")),
  password: z.string({ error: "La contraseña es obligatoria" }).min(1, "La contraseña es obligatoria"),
});

// Lo único que el cliente sabe del usuario.
function toUserDTO(row) {
  return { id: row.id, name: row.name, email: row.email, role: row.role };
}

module.exports = { loginSchema, toUserDTO };
