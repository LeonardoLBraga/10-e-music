import axios from "axios";
import { db, tentarVenderIngresso } from "../db/database.js";

export async function webhookMercadoPago(req, res) {
  try {
    const paymentId = req.body?.data?.id;

    if (!paymentId) {
      return res.sendStatus(200);
    }

    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    const payment = response.data;

    if (payment.status !== "approved") {
      return res.sendStatus(200);
    }

    const venda = db.vendas.find(v => v.id === paymentId);

    if (!venda || venda.status === "approved") {
      return res.sendStatus(200);
    }

    const vendido = tentarVenderIngresso();

    if (!vendido) {
      console.error("Pagamento aprovado mas estoque esgotado");
      return res.sendStatus(200);
    }

    venda.status = "approved";
    venda.approved_at = new Date();

    return res.sendStatus(200);

  } catch (err) {
    console.error("Erro no webhook:", err);
    return res.sendStatus(500);
  }
}
