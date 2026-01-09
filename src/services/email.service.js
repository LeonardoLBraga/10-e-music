import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function enviarEmailIngresso({ email, nome, codigo }) {
  await transporter.sendMail({
    from: `"Quiosque 10 & Music" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎟️ Seu ingresso – Carnaval 2026",
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
