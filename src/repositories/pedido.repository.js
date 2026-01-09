import { pool } from "../db/connection.js";

export async function criarPedido({ comprador_id, quantidade }) {
  const result = await pool.query(
    `
    INSERT INTO pedido (comprador_id, quantidade, status)
    VALUES ($1, $2, 'pending')
    RETURNING *
    `,
    [comprador_id, quantidade]
  );

  return result.rows[0];
}

export async function atualizarPreferenceId(pedido_id, preference_id) {
  await pool.query(
    `
    UPDATE pedido
    SET preference_id = $1
    WHERE id = $2
    `,
    [preference_id, pedido_id]
  );
}

export async function marcarPedidoComoAprovado({ pedido_id, paymentId }) {
  const { rowCount } = await pool.query(
    `
    UPDATE pedido
    SET
      status = 'approved',
      payment_id = $2
    WHERE id = $1
      AND status <> 'approved'
    RETURNING id;
    `,
    [
      pedido_id,
      paymentId
    ]
  );

  return rowCount > 0;
}

export async function buscarStatusPedido(pedidoId) {
  const result = await pool.query(
    `
    SELECT status
    FROM pedido
    WHERE id = $1
    LIMIT 1
    `,
    [pedidoId]
  );

  return result.rows[0]; // { status } ou undefined
}

export async function buscarCompradorPorPedido(pedido_id) {
  const result = await pool.query(
    `
    SELECT c.nome, c.email
    FROM pedido p
    JOIN comprador c ON c.id = p.comprador_id
    WHERE p.id = $1
    `,
    [pedido_id]
  );

  return result.rows[0] || null;
}