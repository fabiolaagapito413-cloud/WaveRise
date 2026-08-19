console.log("🌊 Diário WaveRise funcionando");

// ======================================================
// ELEMENTOS
// ======================================================

const praia = document.getElementById("praia");
const data = document.getElementById("data");
const tempo = document.getElementById("tempo");
const prancha = document.getElementById("pranchaUsada");
const ondas = document.getElementById("ondas");
const nota = document.getElementById("nota");
const observacoes = document.getElementById("observacoes");

const botaoSalvar = document.getElementById("salvarSessao");
const listaSessoes = document.getElementById("listaSessoes");


// ======================================================
// CARREGAR PRANCHAS
// ======================================================

function carregarPranchas() {

    if (!prancha) return;

    const pranchas =
        JSON.parse(
            localStorage.getItem("pranchasWaveRise")
        ) || [];

    prancha.innerHTML =
        '<option value="">Selecione uma prancha</option>';

    pranchas.forEach(item => {

        const option =
            document.createElement("option");

        option.value = item.id;

        option.textContent =
            `${item.modelo || "Prancha"} - ${item.tamanho || ""}`;

        prancha.appendChild(option);
    });
}


// ======================================================
// SALVAR SESSÃO
// ======================================================

function salvarSessao() {

    if (!praia || !data) {
        console.error("Campos do formulário não encontrados.");
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

        tempo:
            tempo
                ? tempo.value.trim()
                : "",

        prancha:
            prancha
                ? prancha.value
                : "",

        ondas:
            ondas
                ? Number(ondas.value) || 0
                : 0,

        nota:
            nota
                ? Number(nota.value) || 0
                : 0,

        observacoes:
            observacoes
                ? observacoes.value.trim()
                : ""

    };


    // ==============================================
    // HISTÓRICO
    // ==============================================

    let historico =
        JSON.parse(
            localStorage.getItem(
                "historicoSurfWaveRise"
            )
        ) || [];


    historico.push(sessao);


    // ==============================================
    // SALVAR
    // ==============================================

    localStorage.setItem(
        "historicoSurfWaveRise",
        JSON.stringify(historico)
    );


    console.log(
        "Sessão salva:",
        sessao
    );


    // ==============================================
    // ATUALIZA PRANCHA
    // ==============================================

    atualizarPrancha(
        sessao.prancha
    );


    // ==============================================
    // ATUALIZA LISTA
    // ==============================================

    carregarSessoes();


    // ==============================================
    // LIMPA FORMULÁRIO
    // ==============================================

    limparFormulario();


    alert(
        "🌊 Sessão salva com sucesso!"
    );
}


// ======================================================
// CARREGAR SESSÕES
// ======================================================

function carregarSessoes() {

    if (!listaSessoes) return;


    const historico =
        JSON.parse(
            localStorage.getItem(
                "historicoSurfWaveRise"
            )
        ) || [];


    if (historico.length === 0) {

        listaSessoes.innerHTML =
            "<p>Nenhuma sessão registrada.</p>";

        return;
    }


    listaSessoes.innerHTML = "";


    const sessoes =
        [...historico].reverse();


    sessoes.forEach(sessao => {

        let nomePrancha = "Nenhuma";


        if (sessao.prancha) {

            const pranchas =
                JSON.parse(
                    localStorage.getItem(
                        "pranchasWaveRise"
                    )
                ) || [];


            const encontrada =
                pranchas.find(
                    p =>
                        String(p.id) ===
                        String(sessao.prancha)
                );


            if (encontrada) {

                nomePrancha =
                    `${encontrada.modelo || "Prancha"} - ${encontrada.tamanho || ""}`;

            }
        }


        const card =
            document.createElement("div");

        card.className =
            "card";


        card.innerHTML = `

            <h3>
                🌊 ${sessao.praia}
            </h3>

            <p>
                📅 <strong>Data:</strong>
                ${formatarData(sessao.data)}
            </p>

            <p>
                ⏱ <strong>Tempo:</strong>
                ${sessao.tempo || "--"}
            </p>

            <p>
                🏄 <strong>Prancha:</strong>
                ${nomePrancha}
            </p>

            <p>
                🌊 <strong>Ondas:</strong>
                ${sessao.ondas}
            </p>

            <p>
                ⭐ <strong>Nota:</strong>
                ${sessao.nota}/10
            </p>

            ${
                sessao.observacoes
                    ? `
                        <p>
                            📝 ${sessao.observacoes}
                        </p>
                    `
                    : ""
            }

        `;


        listaSessoes.appendChild(card);

    });
}


// ======================================================
// FORMATAR DATA
// ======================================================

function formatarData(dataTexto) {

    if (!dataTexto) return "--";


    const partes =
        dataTexto.split("-");


    if (partes.length !== 3) {

        return dataTexto;

    }


    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );
}


// ======================================================
// ATUALIZAR PRANCHA
// ======================================================

function atualizarPrancha(idPrancha) {

    if (!idPrancha) return;


    const pranchas =
        JSON.parse(
            localStorage.getItem(
                "pranchasWaveRise"
            )
        ) || [];


    const encontrada =
        pranchas.find(
            p =>
                String(p.id) ===
                String(idPrancha)
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


// ======================================================
// LIMPAR FORMULÁRIO
// ======================================================

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


// ======================================================
// INICIALIZAÇÃO
// ======================================================

carregarPranchas();

carregarSessoes();


if (botaoSalvar) {

    botaoSalvar.addEventListener(
        "click",
        salvarSessao
    );

} else {

    console.error(
        "❌ Botão #salvarSessao não encontrado."
    );
}