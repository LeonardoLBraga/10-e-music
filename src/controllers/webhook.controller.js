import axios from "axios";
import crypto from "crypto";

import { tentarVenderIngresso } from "../repositories/estoque.repository.js";
import { marcarPedidoComoAprovado, buscarCompradorPorPedido } from "../repositories/pedido.repository.js";
import { criarIngresso } from "../repositories/ingresso.repository.js";
import { gerarCodigoIngresso } from "../utils/gerarCodigoIngresso.js";
import { enviarEmailIngresso } from "../services/email.service.js";

export async function webhookMercadoPago(req, res) {
  const requestId = crypto.randomUUID();

  try {
    if (req.body?.type !== "payment") {
      console.info(`[WEBHOOK][${requestId}] Evento ignorado`);
      return res.sendStatus(200);
    }

    const paymentId = req.body?.data?.id;
    if (!paymentId) {
      console.warn(`[WEBHOOK][${requestId}] paymentId ausente`);
      return res.sendStatus(200);
    }

    let payment;

    try {
      const { data } = await axios.get(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
          },
          timeout: 5000
        }
      );

      payment = data;

    } catch (err) {
      const status = err.response?.status;

      if (status === 404) {
        console.info(
          `[WEBHOOK][${requestId}] MP 404 - pagamento ainda não disponível`,
          { paymentId }
        );
        return res.sendStatus(200);
      }

      console.error(
        `[WEBHOOK][${requestId}] Erro ao consultar MP`,
        { paymentId, status, message: err.message }
      );

      return res.sendStatus(200);
    }

    if (payment.status !== "approved") {
      console.info(
        `[WEBHOOK][${requestId}] Pagamento não aprovado`,
        { paymentId, status: payment.status }
      );
      return res.sendStatus(200);
    }

    const pedido_id = payment.external_reference;
    if (!pedido_id) {
      console.error(
        `[WEBHOOK][${requestId}] external_reference ausente`,
        { paymentId }
      );
      return res.sendStatus(200);
    }

    const pedido = await marcarPedidoComoAprovado({
      pedido_id,
      paymentId
    });

    if (!pedido) {
      console.info(
        `[WEBHOOK][${requestId}] Pedido já processado`,
        { pedido_id }
      );
      return res.sendStatus(200);
    }

    const vendido = await tentarVenderIngresso();

    if (!vendido) {
      console.error(
        `[WEBHOOK][${requestId}] Pagamento aprovado sem estoque`,
        { pedido_id }
      );
      return res.sendStatus(200);
    }

    const codigo = gerarCodigoIngresso();

    const ingresso = await criarIngresso({
      pedido_id,
      codigo
    });

    const comprador = await buscarCompradorPorPedido(pedido_id);

    if (!comprador) {
      console.error(
        `[WEBHOOK][${requestId}] Comprador não encontrado`,
        { pedido_id }
      );
      return res.sendStatus(200);
    }

    if (ingresso) {
      try {
        await enviarEmailIngresso({
          email: comprador.email,
          nome: comprador.nome,
          codigo: ingresso.codigo
        });
      } catch (err) {
        console.error(
          `[WEBHOOK][${requestId}] Falha ao enviar email`,
          err.message
        );
      }
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error(
      `[WEBHOOK][${requestId}] Erro inesperado`,
      err
    );

    return res.sendStatus(200);
  }
}
