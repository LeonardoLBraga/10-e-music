export const db = {
  ingressos: {
    total: Number(process.env.INGRESSO_TOTAL || 10),
    vendidos: 0,
    lock: false
  },
  vendas: []
};

export function tentarVenderIngresso() {
  if (db.ingressos.vendidos >= db.ingressos.total) {
    return false;
  }

  db.ingressos.vendidos += 1;
  return true;
}
