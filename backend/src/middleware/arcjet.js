// Protección opcional con Arcjet (límite de solicitudes con token bucket y detección de bots).
// Sólo se activa si existe ARCJET_KEY; sin la clave la API funciona igual.
// @arcjet/node es un módulo ES, por eso se carga con import() dinámico la primera vez.
function createArcjetMiddleware(key) {
  if (!key) return (req, res, next) => next();

  const ajPromise = import("@arcjet/node").then(({ default: arcjet, tokenBucket, detectBot, shield }) =>
    arcjet({
      key,
      characteristics: ["ip.src"],
      rules: [
        shield({ mode: "LIVE" }),
        detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),
        // Cubeta de 10 fichas que se rellena con 5 fichas cada 10 segundos.
        tokenBucket({ mode: "LIVE", refillRate: 5, interval: 10, capacity: 10 }),
      ],
    })
  );

  return async (req, res, next) => {
    try {
      const aj = await ajPromise;
      const decision = await aj.protect(req, { requested: 1 });
      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          return res.status(429).json({ success: false, message: "Demasiadas solicitudes, intenta más tarde" });
        }
        if (decision.reason.isBot()) {
          return res.status(403).json({ success: false, message: "Acceso de bots no permitido" });
        }
        return res.status(403).json({ success: false, message: "Acceso denegado" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { createArcjetMiddleware };
