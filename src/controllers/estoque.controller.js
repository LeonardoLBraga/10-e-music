import { db } from "../db/database.js";

export function getEstoque(req, res) {
  const total = db.ingressos.total;
  const vendidos = db.ingressos.vendidos;
  const disponiveis = total - vendidos;

  return res.json({
    total,
    vendidos,
    disponiveis
  });
}
