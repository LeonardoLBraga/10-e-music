import { buscarEstoque } from "../repositories/estoque.repository.js";

export async function getEstoque(req, res) {
  try {
    const estoque = await buscarEstoque();

    if (!estoque) {
      return res.status(404).json({
        error: "Estoque não inicializado"
      });
    }

    const { total, vendido } = estoque;
    const disponiveis = total - vendido;

    return res.json({
      total,
      vendido,
      disponiveis
    });

  } catch (err) {
    console.error("Erro ao buscar estoque:", err);
    return res.status(500).json({
      error: "Erro interno ao consultar estoque"
    });
  }
}