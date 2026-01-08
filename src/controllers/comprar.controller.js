import { criarPagamentoAPI } from "../services/pagamento.service.js";
import { criarComprador } from "../repositories/comprador.repository.js";
import { criarPedido, atualizarPreferenceId } from "../repositories/pedido.repository.js";

export async function comprarIngresso(req, res) {
  try {
    // DADOS DO COMPRADOR
    const { nome, email, cpf, telefone } = req.body;

    if (!nome || !email) {
      return res.status(400).json({
        error: "Nome e email são obrigatórios"
      });
    }

    // CRIA COMPRADOR
    const comprador = await criarComprador({
      nome,
      email,
      cpf,
      telefone
    });

    // CRIA PEDIDO NO BANCO (STATUS PENDING)
    const pedido = await criarPedido({
      comprador_id: comprador.id,
      quantidade: 1
    });

    // CRIA PAGAMENTO NA API EXTERNA
    const pagamento = await criarPagamentoAPI({
      pedido_id: pedido.id,
      comprador: {
        nome,
        email,
        cpf,
        telefone
      }
    });

    // ATUALIZA PEDIDO COM ID DO PAGAMENTO
    await atualizarPreferenceId(pedido.id, pagamento.preference_id);

    // RETORNA REDIRECIONAMENTO
    return res.json({
      type: "redirect",
      url: pagamento.init_point
    });

  } catch (err) {
    console.error("Erro ao comprar ingresso:", err);
    return res.status(500).json({
      error: "Erro interno ao processar compra"
    });
  }
}
