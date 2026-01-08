import { MercadoPagoConfig, Preference } from "mercadopago";

// CONFIGURAÇÃO DO CLIENT
if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN não configurado no .env");
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});


// CRIAR PAGAMENTO (API)
export async function criarPagamentoAPI({ pedido_id, comprador }) {
  const preference = new Preference(client);

  const response = await preference.create({
    body: {
      items: [
        {
          title: "Ingresso Quiosque 10 & Music",
          quantity: 1,
          currency_id: "BRL",
          unit_price: Number(process.env.INGRESSO_PRECO || 50)
        }
      ],

      payer: {
        name: comprador?.nome,
        email: comprador?.email
      },

      external_reference: String(pedido_id),

      back_urls: {
        success: `${process.env.BASE_URL}/sucesso.html`,
        failure: `${process.env.BASE_URL}/erro.html`,
        pending: `${process.env.BASE_URL}/pendente.html`
      },

      // auto_return: "approved",

      // 👇 AQUI habilita PIX
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 1
      },

      notification_url: `${process.env.BASE_URL}/webhook/mercadopago`
    }
  });

  return {
    preference_id: response.id,
    init_point: response.init_point
  };

}
