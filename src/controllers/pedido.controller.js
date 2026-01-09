import { buscarStatusPedido } from "../repositories/pedido.repository.js";

export async function getStatusPedido(req, res) {
  try {
    const { pedido_id } = req.query;

    if (!pedido_id || pedido_id === "undefined") {
    return res.status(400).json({
        error: "pedido_id inválido"
    });
    }

    const pedido = await buscarStatusPedido(pedido_id);

    if (!pedido) {
      return res.status(404).json({
        error: "Pedido não encontrado"
      });
    }

    return res.json({
      status: pedido.status
    });

  } catch (err) {
    console.error("[PEDIDO][STATUS]", err);
    return res.status(500).json({
      error: "Erro interno"
    });
  }
}
