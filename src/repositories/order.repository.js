// src/repositories/order.repository.js
import { pool } from "../db/connection.js";

export async function criarPedido({ buyer_id, amount }) {
  const result = await pool.query(
    `
    INSERT INTO orders (buyer_id, amount, status)
    VALUES ($1, $2, 'pending')
    RETURNING *
    `,
    [buyer_id, amount]
  );

  return result.rows[0];
}

export async function atualizarPaymentId(orderId, paymentId) {
  await pool.query(
    `
    UPDATE orders
    SET payment_id = $1
    WHERE id = $2
    `,
    [paymentId, orderId]
  );
}
