import axios from "axios";
import { tentarVenderIngresso } from "../repositories/estoque.repository.js";
import { marcarPedidoComoAprovado } from "../repositories/pedido.repository.js";

export async function webhookMercadoPago(req, res) {
  try {
    const paymentId = req.body?.data?.id;

    if (!paymentId) {
      return res.sendStatus(200);
    }

    const { data: payment } = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    if (payment.status !== "approved") {
      return res.sendStatus(200);
    }

    const pedido_id = Number(payment.external_reference);
    if (!pedido_id) return res.sendStatus(200);

    // 1️⃣ Marca pedido como aprovado
    const atualizado = await marcarPedidoComoAprovado({ pedido_id, paymentId });

    if (!atualizado) {
      return res.sendStatus(200);
    }

    // 2️⃣ Baixa estoque
    const vendido = await tentarVenderIngresso();

    if (!vendido) {
      console.error("⚠️ Pagamento aprovado mas estoque esgotado");
      return res.sendStatus(200);
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ Erro no webhook:", err);
    return res.sendStatus(500);
  }
}
