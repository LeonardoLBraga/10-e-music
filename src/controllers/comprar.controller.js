import { criarPagamentoAPI } from "../services/payment.service.js";
import { criarComprador } from "../repositories/buyer.repository.js";
import { criarPedido } from "../repositories/order.repository.js";
import { atualizarPaymentId } from "../repositories/order.repository.js";

export async function comprarIngresso(req, res) {
  try {
    // ======================
    // DADOS DO COMPRADOR
    // ======================
    const { name, email, cpf, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Nome e email são obrigatórios"
      });
    }

    // ======================
    // CRIA COMPRADOR
    // ======================
    const comprador = await criarComprador({
      name,
      email,
      cpf,
      phone
    });

    // ======================
    // CRIA PEDIDO (PENDING)
    // ======================
    const pedido = await criarPedido({
      buyer_id: comprador.id,
      amount: Number(process.env.INGRESSO_PRECO || 50),
      status: "pending"
    });

    // ======================
    // CRIA PAGAMENTO (MP)
    // ======================
    const pagamento = await criarPagamentoAPI({
      orderId: pedido.id,
      buyer: {
        name,
        email
      }
    });

    // ======================
    // SALVA ID DO MP
    // ======================
    await atualizarPaymentId(pedido.id, pagamento.preference_id);

    // ======================
    // REDIRECT FRONT
    // ======================
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
