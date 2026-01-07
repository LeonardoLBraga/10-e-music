const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:3000"
  : "https://api.quiosque10.com"; //trocar aqui pela URL da sua API em produção
