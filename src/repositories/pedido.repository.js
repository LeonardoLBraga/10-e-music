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
  paymentId = retiraAspas(paymentId);
  pedido_id = retiraAspas(pedido_id);

  const { rowCount } = await pool.query(
    `
    UPDATE pedido
    SET
        status = 'approved',
        payment_id = '$2'
    WHERE id = '$1'
      AND status <> 'approved';
    `,
    [pedido_id, paymentId]
  );

  return rowCount > 0;
}

function retiraAspas(paymentId) {
  if (typeof paymentId === "string") {
    paymentId = paymentId.replace(/(^['"]|['"]$)/g, "");
  }
  return paymentId;
}