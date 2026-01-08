import axios from "axios";
import { tentarVenderIngresso } from "../repositories/estoque.repository.js";
import { marcarPedidoComoAprovado } from "../repositories/pedido.repository.js";

export async function webhookMercadoPago(req, res) {
  try {
    if (req.body?.type !== "payment") {
      return res.sendStatus(200);
    }

    const paymentId = req.body?.data?.id;
    if (!paymentId) {
      return res.sendStatus(200);
    }

    let payment;

    // Protege chamada ao Mercado Pago
    try {
      const response = await axios.get(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
          }
        }
      );

      payment = response.data;

    } catch (err) {
      // ✅ 404 é NORMAL (pagamento ainda não criado)
      if (err.response?.status === 404) {
        console.warn("MP 404 (payment ainda não existe):", paymentId);
        return res.sendStatus(200);
      }

      // ❌ erro real, mas webhook não pode quebrar
      console.error("Erro MP:", err.message);
      return res.sendStatus(200);
    }

    if (payment.status !== "approved") {
      return res.sendStatus(200);
    }

    const pedido_id = Number(payment.external_reference);
    if (!pedido_id) {
      return res.sendStatus(200);
    }

    const atualizado = await marcarPedidoComoAprovado({
      pedido_id,
      paymentId
    });

    if (!atualizado) {
      return res.sendStatus(200);
    }

    const vendido = await tentarVenderIngresso();

    if (!vendido) {
      console.error("⚠️ Pagamento aprovado mas estoque esgotado");
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook erro inesperado:", err.message);
    return res.sendStatus(200);
  }
}
