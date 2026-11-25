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

module.exports = { toProductDTO };
