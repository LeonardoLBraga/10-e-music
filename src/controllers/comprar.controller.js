import { temEstoqueDisponivel } from "../repositories/estoque.repository.js";
import { criarComprador } from "../repositories/comprador.repository.js";
import { criarPedido, atualizarPreferenceId } from "../repositories/pedido.repository.js";
import { criarPagamentoAPI } from "../services/pagamento.service.js";

export async function comprarIngresso(req, res) {
  try {
    const { nome, email, cpf, telefone } = req.body;
    if (!nome || !email || !cpf || !telefone) {
      return res.status(400).json({
        error: "Dados obrigatórios não preenchidos"
      });
    }

    const disponivel = await temEstoqueDisponivel();

    if (!disponivel) {
      return res.status(409).json({
        error: "Ingressos esgotados"
      });
    }

    const comprador = await criarComprador({
      nome,
      email,
      cpf,
      telefone
    });

    const pedido = await criarPedido({
      comprador_id: comprador.id,
      quantidade: 1
    });

    const pagamento = await criarPagamentoAPI({
      pedido_id: pedido.id,
      comprador: { nome, email, cpf, telefone }
    });

    await atualizarPreferenceId(pedido.id, pagamento.preference_id);

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
