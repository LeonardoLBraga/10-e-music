import axios from "axios";
import { tentarVenderIngresso } from "../repositories/ingresso.repository.js";
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

    // 1️⃣ Marca pedido como aprovado (idempotente)
    const atualizado = await marcarPedidoComoAprovado({ paymentId });

    if (!atualizado) {
      // Já estava aprovado ou não existe
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
