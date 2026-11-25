const jwt = require("jsonwebtoken");

// 1) Identidad: ¿quién hace la petición? Lee "Authorization: Bearer <token>".
//    Sin token o con token inválido → 401 Unauthorized.
function requireAuth(jwtSecret) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ success: false, message: "Inicia sesión para realizar esta acción" });
    }
    try {
      const payload = jwt.verify(token, jwtSecret);
      req.user = { id: Number(payload.sub), role: payload.role };
      next();
    } catch {
      return res.status(401).json({ success: false, message: "La sesión no es válida o expiró" });
    }
  };
}

// 2) Permiso: ¿su rol puede hacer esto? Autenticado sin permiso → 403 Forbidden.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ success: false, message: "No tienes permiso para realizar esta acción" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
