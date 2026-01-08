export function validarWebhookMercadoPago(req, res, next) {
  try {
    if (req.body?.type !== "payment") {
      console.info("[WEBHOOK] Evento ignorado:", req.body?.type);
      return res.sendStatus(200);
    }

    const paymentId = req.body?.data?.id;
    if (!paymentId) {
      console.warn("[WEBHOOK] Payment ID ausente");
      return res.sendStatus(200);
    }

    req.paymentId = paymentId;
    next();

  } catch (err) {
    console.error("[WEBHOOK] Middleware erro:", err.message);
    return res.sendStatus(200);
  }
}
