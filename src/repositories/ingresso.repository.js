import { pool } from "../db/connection.js";

export async function tentarVenderIngresso() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT total, vendidos
       FROM ingressos
       WHERE id = 1
       FOR UPDATE`
    );

    if (rows.length === 0) {
      throw new Error("Registro de ingressos não encontrado");
    }

    const { total, vendidos } = rows[0];

    if (vendidos >= total) {
      await client.query("ROLLBACK");
      return false;
    }

    await client.query(
      `UPDATE ingressos
       SET vendidos = vendidos + 1
       WHERE id = 1`
    );

    await client.query("COMMIT");
    return true;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function inicializarEstoque(quantidade) {
  // Cria a tabela se não existir
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tickets_stock (
      id SERIAL PRIMARY KEY,
      total INT NOT NULL,
      sold INT NOT NULL DEFAULT 0
    )
  `);

  // Verifica se já existe algum registro
  const res = await pool.query("SELECT * FROM tickets_stock LIMIT 1");
  if (res.rowCount === 0) {
    const total = Number(quantidade || 150);
    await pool.query(
      "INSERT INTO tickets_stock (total, sold) VALUES ($1, 0)",
      [total]
    );
    console.log(`Estoque inicializado com ${total} ingressos`);
  }
}

export async function buscarEstoque() {
  const result = await pool.query(
    "SELECT total, sold FROM tickets_stock LIMIT 1"
  );

  if (result.rowCount === 0) {
    return null;
  }

  return {
    total: Number(result.rows[0].total),
    vendidos: Number(result.rows[0].sold)
  };
}