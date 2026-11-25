// Manejo centralizado de errores: el cliente nunca recibe detalles internos.
function notFoundApi(req, res) {
  res.status(404).json({ success: false, message: "Ruta no encontrada" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err);
  res.status(500).json({ success: false, message: "Error interno del servidor" });
}

module.exports = { notFoundApi, errorHandler };
