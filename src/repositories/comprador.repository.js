import { pool } from "../db/connection.js";

export async function criarComprador({ nome, email, cpf, telefone }) {
  const result = await pool.query(
    `
    INSERT INTO comprador (nome, email, cpf, telefone)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [nome, email, cpf, telefone]
  );

  return result.rows[0];
}
