import crypto from "crypto";

export function validarWebhookMercadoPago(req, res, next) {
  const signature = req.headers["x-signature"];
  const requestId = req.headers["x-request-id"];

  if (!signature || !requestId) {
    return res.status(401).json({ error: "Webhook não autorizado" });
  }

  const secret = process.env.MP_WEBHOOK_SECRET;

  const payload = `${requestId}.${JSON.stringify(req.body)}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: "Assinatura inválida" });
  }

  next();
}
