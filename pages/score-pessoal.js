console.log("🔥 WaveRise Score — carregado");

// =====================================================
// ELEMENTOS
// =====================================================

const scoreNumero = document.getElementById("scoreNumero");
const classificacao = document.getElementById("classificacao");
const descricaoScore = document.getElementById("descricaoScore");

const valorSessoes = document.getElementById("valorSessoes");
const valorOndas = document.getElementById("valorOndas");
const valorMedia = document.getElementById("valorMedia");
const valorXP = document.getElementById("valorXP");

const barraSessoes = document.getElementById("barraSessoes");
const barraOndas = document.getElementById("barraOndas");
const barraMedia = document.getElementById("barraMedia");
const barraXP = document.getElementById("barraXP");

const tecnicaEquilibrio =
    document.getElementById("tecnicaEquilibrio");

const tecnicaPostura =
    document.getElementById("tecnicaPostura");

const tecnicaPernas =
    document.getElementById("tecnicaPernas");

const tecnicaBracos =
    document.getElementById("tecnicaBracos");

const tecnicaPrancha =
    document.getElementById("tecnicaPrancha");

const tecnicaManobra =
    document.getElementById("tecnicaManobra");

const pontosFortes =
    document.getElementById("pontosFortes");

const pontosMelhoria =
    document.getElementById("pontosMelhoria");

const nivelAtual =
    document.getElementById("nivelAtual");

const xpNivel =
    document.getElementById("xpNivel");

const xpAtual =
    document.getElementById("xpAtual");

const proximaMeta =
    document.getElementById("proximaMeta");

const barraNivel =
    document.getElementById("barraNivel");

const coachMensagem =
    document.getElementById("coachMensagem");


// =====================================================
// CARREGAR HISTÓRICO
// =====================================================

let historico = [];

try {

    historico = JSON.parse(
        localStorage.getItem("historicoSurfWaveRise")
    ) || [];

} catch (erro) {

    console.error(
        "Erro ao carregar histórico:",
        erro
    );

    historico = [];
}

if (!Array.isArray(historico)) {
    historico = [];
}


// =====================================================
// CARREGAR ANÁLISES DO COACH
// =====================================================

function carregarAnalises() {

    const analises = [];

    const chaves = [
        "analiseFotoWaveRise",
        "analiseVideoWaveRise",
        "ultimaAnaliseFoto",
        "ultimaAnaliseVideo"
    ];

    chaves.forEach((chave) => {

        try {

            const dados = JSON.parse(
                localStorage.getItem(chave)
            );

            if (dados) {
                analises.push(dados);
            }

        } catch (erro) {

            console.warn(
                `Não foi possível ler ${chave}`
            );

        }

    });

    // Histórico de análises

    try {

        const historicoAnalises = JSON.parse(
            localStorage.getItem(
                "historicoAnalisesWaveRise"
            )
        );

        if (Array.isArray(historicoAnalises)) {

            historicoAnalises.forEach((analise) => {

                if (analise) {
                    analises.push(analise);
                }

            });

        }

    } catch (erro) {

        console.warn(
            "Histórico de análises não encontrado."
        );

    }

    return analises;
}

const analises = carregarAnalises();


// =====================================================
// DADOS DAS SESSÕES
// =====================================================

let totalSessoes = historico.length;

let totalOndas = 0;

let somaNotas = 0;

let totalXP = 0;

historico.forEach((sessao) => {

    totalOndas += Number(
        sessao.ondas || 0
    );

    somaNotas += Number(
        sessao.nota || 0
    );

    if (
        sessao.xp !== undefined &&
        sessao.xp !== null
    ) {

        totalXP += Number(
            sessao.xp || 0
        );

    } else {

        totalXP += 100;

    }

});


// =====================================================
// MÉDIA
// =====================================================

const mediaNota =
    totalSessoes > 0
        ? somaNotas / totalSessoes
        : 0;


// =====================================================
// SCORE
// =====================================================
//
// O Score considera:
//
// 35% — desempenho das sessões
// 25% — quantidade de ondas
// 20% — consistência
// 20% — análise técnica
//
// =====================================================

const desempenhoSessoes =
    Math.min(
        100,
        (mediaNota / 10) * 100
    );

const desempenhoOndas =
    Math.min(
        100,
        (totalOndas / 50) * 100
    );

const consistencia =
    Math.min(
        100,
        (totalSessoes / 12) * 100
    );


// =====================================================
// SCORE TÉCNICO
// =====================================================

let scoreTecnico = 0;

let quantidadeTecnica = 0;

analises.forEach((analise) => {

    const nota = Number(
        analise.nota
    );

    if (
        !Number.isNaN(nota) &&
        nota > 0
    ) {

        scoreTecnico +=
            Math.min(10, nota) * 10;

        quantidadeTecnica++;

    }

});

if (quantidadeTecnica > 0) {

    scoreTecnico =
        scoreTecnico /
        quantidadeTecnica;

} else {

    scoreTecnico = 0;

}


// =====================================================
// SCORE FINAL
// =====================================================

let score;

if (totalSessoes === 0) {

    score = 0;

} else {

    score =
        desempenhoSessoes * 0.35 +
        desempenhoOndas * 0.25 +
        consistencia * 0.20 +
        scoreTecnico * 0.20;

}

score = Math.round(
    Math.min(
        100,
        Math.max(0, score)
    )
);


// =====================================================
// CLASSIFICAÇÃO
// =====================================================

let tituloScore = "";
let descricao = "";

if (score >= 90) {

    tituloScore = "Elite";

    descricao =
        "Seu desempenho está em um nível excepcional. Continue buscando consistência e evolução técnica.";

} else if (score >= 80) {

    tituloScore = "Avançado";

    descricao =
        "Você já apresenta um desempenho muito consistente. O próximo passo é aperfeiçoar sua técnica.";

} else if (score >= 65) {

    tituloScore = "Intermediário";

    descricao =
        "Você está construindo uma boa base. Foque em consistência e evolução técnica.";

} else if (score >= 40) {

    tituloScore = "Em evolução";

    descricao =
        "Seu surf está evoluindo. Registre mais sessões para aumentar sua consistência.";

} else {

    tituloScore = "Começando";

    descricao =
        "Continue registrando suas sessões para construir seu WaveRise Score.";

}


// =====================================================
// ATUALIZAR SCORE
// =====================================================

if (scoreNumero) {
    scoreNumero.textContent = score;
}

if (classificacao) {
    classificacao.textContent =
        tituloScore;
}

if (descricaoScore) {
    descricaoScore.textContent =
        descricao;
}


// =====================================================
// INDICADORES
// =====================================================

if (valorSessoes) {
    valorSessoes.textContent =
        totalSessoes;
}

if (valorOndas) {
    valorOndas.textContent =
        totalOndas;
}

if (valorMedia) {
    valorMedia.textContent =
        mediaNota > 0
            ? mediaNota.toFixed(1)
            : "0";
}

if (valorXP) {
    valorXP.textContent =
        totalXP;
}


// =====================================================
// BARRAS
// =====================================================

function atualizarBarra(elemento, valor) {

    if (!elemento) return;

    elemento.style.width =
        `${Math.min(100, Math.max(0, valor))}%`;
}

atualizarBarra(
    barraSessoes,
    consistencia
);

atualizarBarra(
    barraOndas,
    desempenhoOndas
);

atualizarBarra(
    barraMedia,
    desempenhoSessoes
);

atualizarBarra(
    barraXP,
    Math.min(
        100,
        (totalXP / 5000) * 100
    )
);


// =====================================================
// NÍVEL
// =====================================================

let nivel = 1;

let xpInicio = 0;

let xpFim = 200;

if (totalXP >= 5000) {

    nivel = 6;
    xpInicio = 5000;
    xpFim = 5000;

} else if (totalXP >= 3000) {

    nivel = 5;
    xpInicio = 3000;
    xpFim = 5000;

} else if (totalXP >= 1500) {

    nivel = 4;
    xpInicio = 1500;
    xpFim = 3000;

} else if (totalXP >= 500) {

    nivel = 3;
    xpInicio = 500;
    xpFim = 1500;

} else if (totalXP >= 200) {

    nivel = 2;
    xpInicio = 200;
    xpFim = 500;

}

if (nivelAtual) {

    nivelAtual.textContent =
        `Nível ${nivel}`;

}

if (xpNivel) {

    xpNivel.textContent =
        `${totalXP} XP`;

}

if (xpAtual) {

    xpAtual.textContent =
        `${totalXP} XP`;

}

if (proximaMeta) {

    if (nivel >= 6) {

        proximaMeta.textContent =
            "Nível máximo";

    } else {

        proximaMeta.textContent =
            `${xpFim} XP`;

    }

}


// =====================================================
// PROGRESSO DO NÍVEL
// =====================================================

let progressoNivel = 0;

if (nivel >= 6) {

    progressoNivel = 100;

} else {

    progressoNivel =
        (
            (totalXP - xpInicio) /
            (xpFim - xpInicio)
        ) * 100;

}

progressoNivel =
    Math.min(
        100,
        Math.max(0, progressoNivel)
    );

if (barraNivel) {

    barraNivel.style.width =
        `${progressoNivel}%`;

}


// =====================================================
// EXTRAIR INFORMAÇÕES TÉCNICAS
// =====================================================

function encontrarTecnica(nome) {

    for (const analise of analises) {

        if (
            analise.tecnica &&
            analise.tecnica[nome]
        ) {

            return analise.tecnica[nome];

        }

    }

    return null;
}


function mostrarTecnica(
    elemento,
    valor
) {

    if (!elemento) return;

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        elemento.textContent = "--";

        return;

    }

    elemento.textContent =
        String(valor);

}


mostrarTecnica(
    tecnicaEquilibrio,
    encontrarTecnica("equilibrio")
);

mostrarTecnica(
    tecnicaPostura,
    encontrarTecnica("postura")
);

mostrarTecnica(
    tecnicaPernas,
    encontrarTecnica("pernas")
);

mostrarTecnica(
    tecnicaBracos,
    encontrarTecnica("bracos")
);

mostrarTecnica(
    tecnicaPrancha,
    encontrarTecnica("posicaoNaPrancha")
);


// =====================================================
// MANOBRA
// =====================================================

let ultimaManobra = null;

for (
    let i = analises.length - 1;
    i >= 0;
    i--
) {

    if (analises[i].manobra) {

        ultimaManobra =
            analises[i].manobra;

        break;

    }

}

mostrarTecnica(
    tecnicaManobra,
    ultimaManobra
);


// =====================================================
// PONTOS FORTES
// =====================================================

function coletarLista(
    propriedade
) {

    const lista = [];

    analises.forEach((analise) => {

        if (
            Array.isArray(
                analise[propriedade]
            )
        ) {

            analise[propriedade]
                .forEach((item) => {

                    if (
                        item &&
                        !lista.includes(item)
                    ) {

                        lista.push(item);

                    }

                });

        }

    });

    return lista;

}


const fortes =
    coletarLista("pontosFortes");

const melhorias =
    coletarLista("melhorias");


function renderizarLista(
    elemento,
    lista,
    mensagemVazia
) {

    if (!elemento) return;

    elemento.innerHTML = "";

    if (!lista.length) {

        elemento.innerHTML = `
            <div class="estadoVazio">
                ${mensagemVazia}
            </div>
        `;

        return;

    }

    lista
        .slice(0, 5)
        .forEach((item) => {

            const div =
                document.createElement("div");

            div.className =
                "listaItem";

            div.textContent =
                item;

            elemento.appendChild(div);

        });

}


renderizarLista(
    pontosFortes,
    fortes,
    "Faça uma análise com o Coach IA para descobrir seus pontos fortes."
);

renderizarLista(
    pontosMelhoria,
    melhorias,
    "Faça uma análise com o Coach IA para descobrir seus próximos focos."
);


// =====================================================
// MENSAGEM DO COACH
// =====================================================

if (coachMensagem) {

    if (totalSessoes === 0) {

        coachMensagem.textContent =
            "Registre sua primeira sessão para começar a construir seu Score.";

    } else if (score >= 80) {

        coachMensagem.textContent =
            "Seu desempenho está muito forte. Agora o foco é transformar qualidade em consistência.";

    } else if (score >= 60) {

        coachMensagem.textContent =
            "Você está no caminho certo. Continue registrando suas sessões e trabalhando sua técnica.";

    } else if (score >= 40) {

        coachMensagem.textContent =
            "Sua evolução já começou. A consistência será a chave para aumentar seu Score.";

    } else {

        coachMensagem.textContent =
            "Cada sessão conta. Continue surfando e registrando sua evolução.";

    }

}


// =====================================================
// DEBUG
// =====================================================

console.log("=================================");
console.log("🌊 WAVERISE SCORE");
console.log("=================================");
console.log("Sessões:", totalSessoes);
console.log("Ondas:", totalOndas);
console.log("Média:", mediaNota.toFixed(1));
console.log("XP:", totalXP);
console.log("Análises IA:", analises.length);
console.log("Score técnico:", scoreTecnico.toFixed(1));
console.log("WAVERISE SCORE:", score);
console.log("Nível:", nivel);
console.log("=================================");