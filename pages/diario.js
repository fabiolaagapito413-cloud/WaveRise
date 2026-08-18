console.log("Diário WaveRise funcionando 🌊");

// ==========================
// Elementos
// ==========================

const praia = document.getElementById("praia");
const data = document.getElementById("data");
const tempo = document.getElementById("tempo");
const prancha = document.getElementById("pranchaUsada");
const ondas = document.getElementById("ondas");
const nota = document.getElementById("nota");
const observacoes = document.getElementById("observacoes");

const botaoSalvar = document.getElementById("salvarSessao");

// ==========================
// Carregar pranchas
// ==========================

function carregarPranchas() {

    if (!prancha) return;

    const pranchas = JSON.parse(
        localStorage.getItem("pranchasWaveRise")
    ) || [];

    prancha.innerHTML =
        '<option value="">Selecione uma prancha</option>';

    pranchas.forEach(item => {

        const option = document.createElement("option");

        option.value = item.id;

        option.textContent =
            `${item.modelo} - ${item.tamanho}`;

        prancha.appendChild(option);

    });

}

carregarPranchas();

// ==========================
// Salvar Sessão
// ==========================

botaoSalvar.addEventListener("click", salvarSessao);

function salvarSessao() {

    if (
        praia.value.trim() === "" ||
        data.value === ""
    ) {

        alert("Preencha a praia e a data.");

        return;

    }

    const sessao = {

        id: Date.now(),

        praia: praia.value,

        data: data.value,

        tempo: tempo.value,

        prancha: prancha ? prancha.value : "",

        ondas: Number(ondas.value) || 0,

        nota: Number(nota.value) || 0,

        observacoes: observacoes.value

    };

    const historico = JSON.parse(
        localStorage.getItem("historicoSurfWaveRise")
    ) || [];

    historico.push(sessao);

    localStorage.setItem(
        "historicoSurfWaveRise",
        JSON.stringify(historico)
    );

    atualizarPrancha(sessao.prancha);

    limparFormulario();

    alert("🌊 Sessão salva com sucesso!");

}

// ==========================
// Atualizar sessões da prancha
// ==========================

function atualizarPrancha(idPrancha) {

    if (!idPrancha) return;

    const pranchas = JSON.parse(
        localStorage.getItem("pranchasWaveRise")
    ) || [];

    const encontrada = pranchas.find(
        p => String(p.id) === String(idPrancha)
    );

    if (encontrada) {

        encontrada.sessoes++;

        localStorage.setItem(
            "pranchasWaveRise",
            JSON.stringify(pranchas)
        );

    }

}

// ==========================
// Limpar formulário
// ==========================

function limparFormulario() {

    praia.value = "";

    data.value = "";

    tempo.value = "";

    if (prancha) {

        prancha.selectedIndex = 0;

    }

    ondas.value = "";

    nota.value = "";

    observacoes.value = "";

}