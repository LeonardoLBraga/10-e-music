// ======================
// MENU MOBILE
// ======================
function toggleMenu() {
  const menu = document.getElementById("menuMobile");
  menu?.classList.toggle("hidden");
}

window.addEventListener("resize", () => {
  const menu = document.getElementById("menuMobile");
  if (menu && window.innerWidth >= 768) {
    menu.classList.add("hidden");
  }
});

// ======================
// MODAL DE COMPRA
// ======================
function abrirModalCompra() {
  const modal = document.getElementById("modalCompra");
  const buyBtn = document.getElementById("buyBtn");

  limparErros();
  resetarCampos();
  resetarTouched();

  buyBtn.disabled = true;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function fecharModalCompra() {
  const modal = document.getElementById("modalCompra");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

document.getElementById("modalCompra")?.addEventListener("click", (e) => {
  if (e.target.id === "modalCompra") fecharModalCompra();
});

// ======================
// ERROS INLINE
// ======================
function mostrarErro(msg) {
  const el = document.getElementById("formError");
  el.innerText = msg;
  el.classList.remove("hidden");
}

function limparErros() {
  const el = document.getElementById("formError");
  el?.classList.add("hidden");
}

// ======================
// CONTROLE DE CAMPOS TOCADOS
// ======================
const touched = {
  nome: false,
  email: false,
  cpf: false,
  telefone: false
};

function resetarTouched() {
  Object.keys(touched).forEach(k => touched[k] = false);
}

// ======================
// ESTILO DOS CAMPOS
// ======================
function marcarCampo(input, valido) {
  input.classList.remove(
    "border-red-500",
    "border-green-500",
    "ring-2",
    "ring-red-500",
    "ring-green-500"
  );

  if (valido) {
    input.classList.add("border-green-500", "ring-2", "ring-green-500");
  } else {
    input.classList.add("border-red-500", "ring-2", "ring-red-500");
  }
}

function resetarCampos() {
  ["nome", "email", "cpf", "telefone"].forEach(id => {
    const el = document.getElementById(id);
    el.value = "";
    el.classList.remove(
      "border-red-500",
      "border-green-500",
      "ring-2",
      "ring-red-500",
      "ring-green-500"
    );
  });
}

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
    const { total, disponiveis } = await buscarEstoque();

    const contadorTexto = document.getElementById("contadorTexto");
    const progressBar = document.getElementById("progressBar");
    const urgenciaTexto = document.getElementById("urgenciaTexto");

    contadorTexto.innerText = `${disponiveis} de ${total} disponíveis`;

    const porcentagem = Math.max(
      0,
      Math.round((disponiveis / total) * 100)
    );

    progressBar.style.width = `${porcentagem}%`;
    progressBar.className = "h-6 rounded-full transition-all duration-500";

    if (disponiveis > total * 0.5) {
      progressBar.classList.add("bg-green-500");
      urgenciaTexto.innerText = "Garanta seu ingresso com tranquilidade!";
      urgenciaTexto.className = "mt-4 text-lg text-green-400";
    } else if (disponiveis > total * 0.2) {
      progressBar.classList.add("bg-yellow-400");
      urgenciaTexto.innerText = "Ingressos acabando!";
      urgenciaTexto.className = "mt-4 text-lg text-yellow-400";
    } else if (disponiveis > 0) {
      progressBar.classList.add("bg-yellow-400");
      urgenciaTexto.innerText = "Últimos ingressos!";
      urgenciaTexto.className = "mt-4 text-lg text-orange-400 animate-pulse";
    } else {
      progressBar.classList.add("bg-red-500");
      urgenciaTexto.innerText = "Ingressos esgotados!";
      urgenciaTexto.className = "mt-4 text-lg text-red-400";
    }

    const buyBtn = document.getElementById("buyBtn");

    if (buyBtn) {
      if (disponiveis <= 0) {
        buyBtn.disabled = true;
        buyBtn.innerText = "Ingressos esgotados";
        buyBtn.classList.add(
          "bg-gray-500",
          "cursor-not-allowed",
          "opacity-70"
        );
      } else {
        buyBtn.disabled = false;
        buyBtn.innerText = "Comprar ingresso";
        buyBtn.classList.remove(
          "bg-gray-500",
          "cursor-not-allowed",
          "opacity-70"
        );
      }
    }

  } catch (e) {
    console.error(e);
  }
}

// ======================
// VALIDAÇÃO
// ======================
function cpfValido(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += cpf[i] * (10 - i);
  let d1 = (soma * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 != cpf[9]) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += cpf[i] * (11 - i);
  let d2 = (soma * 10) % 11;
  if (d2 === 10) d2 = 0;

  return d2 == cpf[10];
}

function validarCampo(id, forcar = false) {
  const el = document.getElementById(id);
  const valor = el.value.trim();

  let valido = false;

  if (id === "nome") valido = valor.length >= 5;
  if (id === "email") valido = valor.includes("@");
  if (id === "cpf") valido = cpfValido(valor);
  if (id === "telefone") valido = valor.replace(/\D/g, "").length >= 10;

  if (touched[id] || forcar) {
    marcarCampo(el, valido);
  }

  return valido;
}

function validarFormulario() {
  return ["nome", "email", "cpf", "telefone"]
    .every(id => validarCampo(id));
}

// ======================
// COMPRA
// ======================
let compraEmAndamento = false;

async function comprarIngresso() {
  if (compraEmAndamento) return;

  limparErros();

  if (!validarFormulario()) {
    ["nome", "email", "cpf", "telefone"].forEach(id => {
      touched[id] = true;
      validarCampo(id, true);
    });

    mostrarErro("Preencha corretamente todos os campos.");
    return;
  }

  if (document.getElementById("buyBtn")?.disabled) {
    mostrarErro("Ingressos esgotados.");
    return;
  }

  compraEmAndamento = true;

  const buyBtn = document.getElementById("buyBtn");
  buyBtn.disabled = true;
  buyBtn.innerText = "Processando...";

  try {
    const payload = {
      nome: nome.value.trim(),
      email: email.value.trim(),
      cpf: cpf.value.trim(),
      telefone: telefone.value.trim()
    };

    const res = await fetch(`${API_BASE_URL}/api/comprar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        mostrarErro("❌ Ingressos esgotados.");
        await atualizarContadorIngressos();
        return;
      }

      mostrarErro(data.error || "Erro ao processar pagamento.");
      return;
    }

    if (data.type === "redirect") {
      localStorage.setItem("pedido_id", data.pedido_id);
      window.location.href = data.url;
      return;
    }

  } catch (err) {
    console.error(err);
    mostrarErro("Erro inesperado. Tente novamente.");
  } finally {
    compraEmAndamento = false;
    buyBtn.disabled = false;
    buyBtn.innerText = "Ir para pagamento";
  }
}

// ======================
// INPUT MASK
// ======================
cpf.addEventListener("input", () => {
  cpf.value = cpf.value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
});

telefone.addEventListener("input", () => {
  telefone.value = telefone.value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
});

// ======================
// LIVE VALIDATION
// ======================
["nome", "email", "cpf", "telefone"].forEach(id => {
  const el = document.getElementById(id);

  el.addEventListener("input", () => {
    validarCampo(id);
    buyBtn.disabled = !validarFormulario();
  });

  el.addEventListener("blur", () => {
    touched[id] = true;
    const valido = validarCampo(id, true);

    if (!valido) {
      mostrarErro("Preencha corretamente este campo.");
    } else {
      limparErros();
    }
  });
});

// ======================
// INIT
// ======================
document.addEventListener("DOMContentLoaded", atualizarContadorIngressos);

const formCompra = document.getElementById("formCompra");
const buyBtn = document.getElementById("buyBtn");

formCompra.addEventListener("submit", (e) => {
  e.preventDefault();
  comprarIngresso();
});
