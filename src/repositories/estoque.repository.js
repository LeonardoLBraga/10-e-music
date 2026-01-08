import { pool } from "../db/connection.js";

export async function tentarVenderIngresso() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT total, vendido
       FROM estoque_ingresso
       WHERE id = 1
       FOR UPDATE`
    );

    if (rows.length === 0) {
      throw new Error("Registro de ingressos não encontrado");
    }

    const { total, vendido } = rows[0];

    if (vendido >= total) {
      await client.query("ROLLBACK");
      return false;
    }

    await client.query(
      `UPDATE estoque_ingresso
       SET vendido = vendido + 1
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
    CREATE TABLE IF NOT EXISTS estoque_ingresso (
      id SERIAL PRIMARY KEY,
      total INT NOT NULL,
      vendido INT NOT NULL DEFAULT 0
    )
  `);

  // Verifica se já existe algum registro
  const res = await pool.query("SELECT * FROM estoque_ingresso LIMIT 1");
  if (res.rowCount === 0) {
    const total = Number(quantidade || 150);
    await pool.query(
      "INSERT INTO estoque_ingresso (total, vendido) VALUES ($1, 0)",
      [total]
    );
    console.log(`Estoque inicializado com ${total} ingressos`);
  }
}

export async function buscarEstoque() {
  const result = await pool.query(
    "SELECT total, vendido FROM estoque_ingresso LIMIT 1"
  );

  if (result.rowCount === 0) {
    return null;
  }

  return {
    total: Number(result.rows[0].total),
    vendido: Number(result.rows[0].vendido)
  };
}