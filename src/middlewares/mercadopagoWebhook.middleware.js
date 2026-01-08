import crypto from "crypto";

export function validarWebhookMercadoPago(req, res, next) {
  try {
    const signatureHeader = req.headers["x-signature"];
    if (!signatureHeader) {
      console.warn("[WEBHOOK] Assinatura ausente");
      return res.sendStatus(401);
    }

    const secret = process.env.MP_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[WEBHOOK] MP_WEBHOOK_SECRET não configurado");
      return res.sendStatus(500);
    }

    const parts = signatureHeader.split(",").map(p => p.trim());

    const ts = parts.find(p => p.startsWith("ts="))?.split("=")[1];
    const v1 = parts.find(p => p.startsWith("v1="))?.split("=")[1];

    if (!ts || !v1) {
      console.warn("[WEBHOOK] Assinatura mal formatada");
      return res.sendStatus(401);
    }

    if (!req.rawBody) {
      console.error("[WEBHOOK] rawBody ausente");
      return res.sendStatus(400);
    }

    const payload = `${ts}.${req.rawBody}`;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const valid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(v1, "hex")
    );

    if (!valid) {
      console.warn("[WEBHOOK] Assinatura inválida");
      return res.sendStatus(401);
    }

    return next();
  } catch (err) {
    console.error("[WEBHOOK] Erro na validação:", err.message);
    return res.sendStatus(401);
  }
}
