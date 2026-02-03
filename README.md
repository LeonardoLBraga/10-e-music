# 🎉 Quiosque 10 & Music --- Venda de Ingressos (Carnaval 2026)

Sistema completo de **venda online de ingressos** desenvolvido para o
evento **Carnaval 2026 do Quiosque 10 & Music**, com foco em
**experiência do usuário, segurança, urgência de compra e integração com
pagamentos**.

------------------------------------------------------------------------

## 🚀 Visão Geral

O projeto consiste em:

-   **Landing page responsiva** com informações do evento
-   **Modal de compra** com validações em tempo real
-   **Controle de estoque** de ingressos
-   **Integração com Mercado Pago**
-   **Backend com API REST**
-   **Persistência em PostgreSQL**
-   **Deploy em produção na Render**

------------------------------------------------------------------------

## 🧱 Stack Tecnológica

### Frontend

-   HTML5
-   Tailwind CSS
-   JavaScript (Vanilla)
-   UX focado em conversão
-   Modal responsiva com scroll interno
-   Validação de formulário + máscaras de input

### Backend

-   Node.js
-   Express
-   PostgreSQL
-   Arquitetura em camadas (Controllers / Repositories)
-   Integração com Mercado Pago
-   Webhooks para atualização de pedidos

### Infra / Deploy

-   Render (Backend + Banco de Dados)
-   Variáveis de ambiente (`.env`)
-   PostgreSQL gerenciado

------------------------------------------------------------------------

## 🧠 Funcionalidades Principais

### 🎟️ Venda de Ingressos

-   Criação de pedido com status `pending`
-   Redirecionamento para checkout do Mercado Pago
-   Atualização automática do status após pagamento

### 📦 Controle de Estoque

-   Total de ingressos
-   Quantidade vendida
-   Disponíveis em tempo real
-   Barra de progresso com alerta de urgência

### 🔐 Validações de Segurança

-   Validação de CPF (dígitos verificadores)
-   Máscara de CPF e WhatsApp
-   Bloqueio de envio com dados inválidos
-   Prevenção contra múltiplos envios
-   Validação duplicada no backend

### 📲 UX & Conversão

-   Modal adaptável para mobile
-   Teclado numérico em campos sensíveis
-   Botão desativado até formulário válido
-   Feedback visual de urgência
-   Interface inspirada em e-commerces reais

------------------------------------------------------------------------

## 📁 Estrutura do Projeto

    ├── public/
    │   ├── index.html
    │   ├── app.js
    │   ├── config.js
    │
    ├── src/
    │   ├── controllers/
    │   │   ├── estoque.controller.js
    │   │   ├── compra.controller.js
    │   │   └── webhook.controller.js
    │   │
    │   ├── repositories/
    │   │   ├── estoque.repository.js
    │   │   └── order.repository.js
    │   │
    │   ├── routes/
    │   │   └── api.routes.js
    │   │
    │   ├── db/
    │   │   └── connection.js
    │   │
    │   └── server.js
    │
    ├── .env.example
    ├── package.json
    └── README.md

------------------------------------------------------------------------

## ⚙️ Configuração Local

### 1️⃣ Clonar o repositório

``` bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

### 2️⃣ Instalar dependências

``` bash
pnpm install
```

### 3️⃣ Criar arquivo `.env`

``` env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/quiosque
MP_ACCESS_TOKEN=seu_token_mercado_pago
ADMIN_EXPORT_TOKEN=seu_token_oara_o_relatorio
```

### 4️⃣ Rodar o servidor

``` bash
pnpm dev
```

------------------------------------------------------------------------

## 🧪 Endpoints Principais

### 🔍 Estoque

    GET /api/estoque

### 🛒 Criar Pedido

    POST /api/comprar

### 🔔 Webhook Mercado Pago

    POST /webhook/mercadopago

------------------------------------------------------------------------

## 🛡️ Boas Práticas Aplicadas

-   Separação de responsabilidades (Clean Code)
-   Repository Pattern
-   Validação no frontend **e** backend
-   Variáveis sensíveis fora do código
-   UX mobile-first

------------------------------------------------------------------------

## 📸 Preview

> Landing page moderna, modal de compra responsiva e fluxo de pagamento
> profissional.

------------------------------------------------------------------------

## 👨‍💻 Autor

**Leonardo Lourenço Braga**\
Projeto desenvolvido para evento real --- Carnaval 2026\
Quiosque 10 & Music

------------------------------------------------------------------------

## 🏁 Licença

Este projeto está sob a licença MIT. Você pode usar, modificar e distribuir livremente — consulte o arquivo LICENSE para mais detalhes.
