console.log("🌊 Diário WaveRise funcionando!");

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
            `${item.modelo || "Prancha"} - ${item.tamanho || ""}`;

        prancha.appendChild(option);

    });

}

// ==========================
// Salvar Sessão
// ==========================

function salvarSessao() {

    if (!praia || !data) {
        console.error("Elementos do formulário não encontrados.");
        return;
    }

    if (
        praia.value.trim() === "" ||
        data.value === ""
    ) {

        alert("Preencha a praia e a data.");

        return;
    }

    const sessao = {

        id: Date.now(),

        praia: praia.value.trim(),

        data: data.value,

        tempo: tempo ? tempo.value : "",

        prancha: prancha ? prancha.value : "",

        ondas: ondas
            ? Number(ondas.value) || 0
            : 0,

        nota: nota
            ? Number(nota.value) || 0
            : 0,

        observacoes: observacoes
            ? observacoes.value.trim()
            : ""

    };

    const historico = JSON.parse(
        localStorage.getItem("historicoSurfWaveRise")
    ) || [];

    historico.push(sessao);

    localStorage.setItem(
        "historicoSurfWaveRise",
        JSON.stringify(historico)
    );

    // Atualiza quantidade de sessões da prancha
    atualizarPrancha(sessao.prancha);

    // Limpa formulário
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

    if (!encontrada) return;

    encontrada.sessoes =
        Number(encontrada.sessoes) || 0;

    encontrada.sessoes++;

    localStorage.setItem(
        "pranchasWaveRise",
        JSON.stringify(pranchas)
    );

}

// ==========================
// Limpar formulário
// ==========================

function limparFormulario() {

    if (praia) {
        praia.value = "";
    }

    if (data) {
        data.value = "";
    }

    if (tempo) {
        tempo.value = "";
    }

    if (prancha) {
        prancha.selectedIndex = 0;
    }

    if (ondas) {
        ondas.value = "";
    }

    if (nota) {
        nota.value = "";
    }

    if (observacoes) {
        observacoes.value = "";
    }

}

// ==========================
// Inicialização
// ==========================

carregarPranchas();

if (botaoSalvar) {

    botaoSalvar.addEventListener(
        "click",
        salvarSessao
    );

} else {

    console.error(
        "Botão #salvarSessao não encontrado."
    );

}

console.log("✅ Diário WaveRise carregado sem erros.");
