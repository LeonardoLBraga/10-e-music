import { pool } from "../db/connection.js";

export async function criarIngresso({ pedido_id, codigo }) {
  const result = await pool.query(
    `
    INSERT INTO ingresso (pedido_id, codigo)
    VALUES ($1, $2)
    ON CONFLICT (pedido_id) DO NOTHING
    RETURNING *
    `,
    [pedido_id, codigo]
  );

  return result.rows[0];
}
