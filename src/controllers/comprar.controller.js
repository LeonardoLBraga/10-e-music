import { criarPagamentoAPI } from "../services/pagamento.service.js";
import { criarComprador } from "../repositories/comprador.repository.js";
import { criarPedido, atualizarPaymentId } from "../repositories/pedido.repository.js";

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
    // CRIA COMPRADOR (OU RETORNA EXISTENTE)
    // ======================
    const comprador = await criarComprador({
      name,
      email,
      cpf,
      phone
    });

    // ======================
    // CRIA PEDIDO NO BANCO (STATUS PENDING)
    // ======================
    // Usando o valor do ingresso do .env ou default 50
    const pedido = await criarPedido({
      buyer_id: comprador.id,
      amount: Number(process.env.INGRESSO_PRECO || 50),
      status: "pending",         // Mantido no banco
      payment_mode: "mercado_pago" // novo campo se você adicionou
    });

    // ======================
    // CRIA PAGAMENTO NA API EXTERNA
    // ======================
    const pagamento = await criarPagamentoAPI({
      orderId: pedido.id,
      buyer: {
        name,
        email,
        cpf,
        phone
      },
      amount: pedido.amount      // garante valor correto
    });

    // ======================
    // ATUALIZA PEDIDO COM ID DO PAGAMENTO
    // ======================
    await atualizarPaymentId(pedido.id, pagamento.preference_id);

    // ======================
    // RETORNA REDIRECIONAMENTO
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
