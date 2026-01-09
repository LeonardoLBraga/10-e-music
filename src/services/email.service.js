import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmailIngresso({ email, nome, codigo }) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "🎟️ Seu ingresso – Carnaval Quiosque 10 & Music",
    html: `
      <h2>🎟️ Ingresso confirmado!</h2>

      <p>Olá <strong>${nome}</strong>,</p>

      <p>
        Sua compra para o evento
        <strong>Quiosque 10 & Music – Carnaval 2026</strong>
        foi confirmada.
      </p>

      <p><strong>Código do ingresso:</strong></p>
      <h1 style="letter-spacing:4px;">${codigo}</h1>

      <p>
        📍 Apresente este ingresso juntamente com um
        <strong>documento oficial com foto (CPF, RG ou CNH)</strong>
        na entrada do evento.
      </p>

      <p>⚠️ Ingresso pessoal e intransferível.</p>

      <br />
      <p><strong>Bom evento!</strong></p>
      <p>Equipe Quiosque 10 & Music</p>
    `
  });
}