const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { toUserDTO } = require("../dto/auth.dto");

// Hash fijo para comparar aunque el correo no exista (mismo tiempo de respuesta).
const DUMMY_HASH = "$2b$10$uSDXZTYLQFffBJIL3F4L5OwYC6Ietju4MMeAKEwb8M4uvHuOVzWMa";

function createAuthController(usersRepo, { jwtSecret, expiresIn = "2h" }) {
  return {
    // POST /api/auth/login
    async login(req, res) {
      const { email, password } = req.body;
      const user = await usersRepo.findByEmail(email);
      const ok = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);

      // Mismo mensaje si falla el correo o la contraseña (OWASP: no revelar cuál).
      if (!user || !ok) {
        return res.status(401).json({ success: false, message: "Correo o contraseña incorrectos" });
      }

      const token = jwt.sign({ sub: String(user.id), role: user.role }, jwtSecret, { expiresIn });
      res.status(200).json({ success: true, data: { token, user: toUserDTO(user) } });
    },

    // GET /api/auth/me
    async me(req, res) {
      const user = await usersRepo.findById(req.user.id);
      if (!user) return res.status(401).json({ success: false, message: "La sesión no es válida o expiró" });
      res.status(200).json({ success: true, data: toUserDTO(user) });
    },
  };
}

module.exports = { createAuthController };
