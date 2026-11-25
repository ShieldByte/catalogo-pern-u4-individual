const { z } = require("zod");

// DTO de entrada: qué campos y tipos acepta la API al crear o editar un producto.
// Zod valida la entrada antes de que llegue a la base de datos.
const productInputSchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio" })
    .trim()
    .min(1, "El nombre no puede estar vacío")
    .max(120, "El nombre admite como máximo 120 caracteres"),
  price: z.coerce
    .number({ error: "El precio debe ser numérico" })
    .refine(Number.isFinite, "El precio debe ser numérico")
    .positive("El precio debe ser mayor que cero")
    .max(99999999.99, "El precio es demasiado grande"),
  image: z
    .string({ error: "La imagen es obligatoria" })
    .trim()
    .pipe(z.url({ protocol: /^https?$/, error: "La imagen debe ser una URL http o https" })),
});

// DTO de salida: define qué campos de un producto cruzan la interfaz HTTP.
function toProductDTO(row) {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    image: row.image,
    createdAt: row.created_at,
  };
}

module.exports = { productInputSchema, toProductDTO };
