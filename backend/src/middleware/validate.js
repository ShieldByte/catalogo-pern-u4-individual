// Valida req.body con un esquema de Zod. Si falla responde 400 con el detalle por campo.
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    req.body = result.data; // datos ya limpios (nombre sin espacios, precio numérico)
    next();
  };
}

module.exports = { validateBody };
