export function adminAuth(req, res, next) {
  const token = req.headers["x-admin-token"];

  if (!token) {
    console.warn("⛔ Tentativa sem token admin");
    return res.status(401).json({ error: "Token admin ausente" });
  }

  if (token !== process.env.ADMIN_EXPORT_TOKEN) {
    console.warn("⛔ Token admin inválido");
    return res.status(403).json({ error: "Token admin inválido" });
  }

  next();
}