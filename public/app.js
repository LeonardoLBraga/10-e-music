// ======================
// MENU MOBILE
// ======================
function toggleMenu() {
  const menu = document.getElementById("menuMobile");
  if (menu) {
    menu.classList.toggle("hidden");
  }
}

window.addEventListener("resize", () => {
  const menu = document.getElementById("menuMobile");
  if (menu && window.innerWidth >= 768) {
    menu.classList.add("hidden");
  }
});

// ======================
// API — ESTOQUE
// ======================
async function buscarEstoque() {
  const res = await fetch(`${API_BASE_URL}/api/estoque`);
  if (!res.ok) throw new Error("Erro ao buscar estoque");
  return res.json();
}

// ======================
// CONTADOR DE INGRESSOS
// ======================
async function atualizarContadorIngressos() {
  try {
    const { total, vendidos, disponiveis } = await buscarEstoque();

    const contadorTexto = document.getElementById("contadorTexto");
    const progressBar = document.getElementById("progressBar");
    const urgenciaTexto = document.getElementById("urgenciaTexto");

    if (!contadorTexto || !progressBar || !urgenciaTexto) return;

    contadorTexto.innerText = `${disponiveis} de ${total} disponíveis`;

    const porcentagem = Math.max(
      0,
      Math.round((disponiveis / total) * 100)
    );

    progressBar.style.width = `${porcentagem}%`;
    progressBar.className =
      "h-6 transition-all duration-500 rounded-full";

    if (disponiveis > total * 0.5) {
      progressBar.classList.add("bg-green-500");
      urgenciaTexto.innerText =
        "Garanta seu ingresso com tranquilidade";
      urgenciaTexto.className =
        "mt-4 text-lg text-green-400";
    } else if (disponiveis > total * 0.2) {
      progressBar.classList.add("bg-yellow-400");
      urgenciaTexto.innerText =
        "Ingressos acabando, não deixe pra depois";
      urgenciaTexto.className =
        "mt-4 text-lg text-yellow-400";
    } else if (disponiveis > 0) {
      progressBar.classList.add("bg-red-500");
      urgenciaTexto.innerText =
        "Últimos ingressos disponíveis!";
      urgenciaTexto.className =
        "mt-4 text-lg text-red-400 animate-pulse";
    } else {
      progressBar.classList.add("bg-gray-500");
      urgenciaTexto.innerText =
        "Ingressos esgotados";
      urgenciaTexto.className =
        "mt-4 text-lg text-gray-400";
    }
  } catch (err) {
    console.error("Erro ao atualizar ingressos:", err);
  }
}

// ======================
// COMPRA DE INGRESSO
// ======================

let compraEmAndamento = false;

async function comprarIngresso() {
  if (compraEmAndamento) return;
  compraEmAndamento = true;

  const buyBtn = document.getElementById("buyBtn");
  buyBtn.disabled = true;
  buyBtn.innerText = "Processando...";

  try {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !email) {
      alert("Nome e email são obrigatórios");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/comprar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        cpf,
        phone
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erro ao processar compra");
      return;
    }

    // Redirect Mercado Pago
    if (data.type === "redirect") {
      window.location.href = data.url;
      return;
    }

  } catch (err) {
    console.error(err);
    alert("Erro inesperado");
  } finally {
    compraEmAndamento = false;
    buyBtn.disabled = false;
    buyBtn.innerText = "Comprar ingresso";
  }
}

// ======================
// INICIALIZAÇÃO
// ======================
document.addEventListener("DOMContentLoaded", async () => {
  await atualizarContadorIngressos();

  const buyBtn = document.getElementById("buyBtn");
  if (buyBtn) {
    buyBtn.addEventListener("click", comprarIngresso);
  }

  //setInterval(atualizarContadorIngressos, 15000);
});
