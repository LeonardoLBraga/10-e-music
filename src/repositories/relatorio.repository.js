import { pool } from "../db/connection.js";

export async function listarIngressosVendidos() {
  const { rows } = await pool.query(`
    SELECT
      i.codigo AS codigo_ingresso,
      c.nome,
      c.email,
      c.cpf,
      c.telefone,
      p.id AS pedido_id,
      p.status,
      p.created_at
    FROM ingresso i
    JOIN pedido p ON p.id = i.pedido_id
    JOIN comprador c ON c.id = p.comprador_id
    WHERE p.status = 'approved'
    ORDER BY p.created_at DESC
  `);

  return rows;
}
