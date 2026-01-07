import { buscarEstoque } from "../repositories/ingresso.repository.js";

export async function getEstoque(req, res) {
  try {
    const estoque = await buscarEstoque();

    if (!estoque) {
      return res.status(404).json({
        error: "Estoque não inicializado"
      });
    }

    const { total, vendidos } = estoque;
    const disponiveis = total - vendidos;

    return res.json({
      total,
      vendidos,
      disponiveis
    });

  } catch (err) {
    console.error("Erro ao buscar estoque:", err);
    return res.status(500).json({
      error: "Erro interno ao consultar estoque"
    });
  }
}