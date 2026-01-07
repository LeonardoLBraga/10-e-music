import { pool } from "../db/connection.js";

export async function criarComprador({ name, email, cpf, phone }) {
  const result = await pool.query(
    `
    INSERT INTO buyers (name, email, cpf, phone)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, email, cpf, phone]
  );

  return result.rows[0];
}
