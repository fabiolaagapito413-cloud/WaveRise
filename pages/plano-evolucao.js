// ======================================================
// WAVERISE
// PLANO DE EVOLUÇÃO
// ======================================================

console.log("🧠 WaveRise — Plano de Evolução iniciado");


// ======================================================
// CONFIGURAÇÃO
// ======================================================

const HISTORICO_KEY = "historicoSurfWaveRise";
const PERFIL_KEY = "perfilWaveRise";

const CHAVES_ANALISE = [
    "analiseFotoWaveRise",
    "analiseVideoWaveRise",
    "ultimaAnaliseFoto",
    "ultimaAnaliseVideo",
    "historicoAnalisesWaveRise"
];


// ======================================================
// ELEMENTOS
// ======================================================

const elementos = {

    objetivo:
        document.getElementById("objetivoPrincipal"),

    statusFase:
        document.getElementById("statusFase"),

    statusDescricao:
        document.getElementById("statusDescricao"),

    progressoValor:
        document.getElementById("progressoValor"),

    barraProgresso:
        document.getElementById("barraProgresso"),

    resumoSessoes:
        document.getElementById("resumoSessoes"),

    resumoOndas:
        document.getElementById("resumoOndas"),

    resumoNota:
        document.getElementById("resumoNota"),

    resumoScore:
        document.getElementById("resumoScore"),

    metaSessoes:
        document.getElementById("metaSessoes"),

    metaOndas:
        document.getElementById("metaOndas"),

    metaNota:
        document.getElementById("metaNota"),

    metaAnalise:
        document.getElementById("metaAnalise"),

    treino1Titulo:
        document.getElementById("treino1Titulo"),

    treino1Texto:
        document.getElementById("treino1Texto"),

    treino2Titulo:
        document.getElementById("treino2Titulo"),

    treino2Texto:
        document.getElementById("treino2Texto"),

    treino3Titulo:
        document.getElementById("treino3Titulo"),

    treino3Texto:
        document.getElementById("treino3Texto"),

    treino4Titulo:
        document.getElementById("treino4Titulo"),

    treino4Texto:
        document.getElementById("treino4Texto")
};


// ======================================================
// STORAGE
// ======================================================

function lerStorage(chave) {

    try {

        const valor =
            localStorage.getItem(chave);

        if (!valor) {
            return null;
        }

        return JSON.parse(valor);

    } catch (erro) {

        console.warn(
            `⚠️ Erro ao ler ${chave}:`,
            erro
        );

        return null;
    }
}


// ======================================================
// NÚMERO
// ======================================================

function numero(valor, padrao = 0) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return padrao;
    }

    const convertido =
        Number(
            String(valor)
                .replace(",", ".")
                .replace(/[^\d.-]/g, "")
        );

    return Number.isFinite(convertido)
        ? convertido
        : padrao;
}


// ======================================================
// LIMITAR
// ======================================================

function limitar(valor) {

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(numero(valor))
        )
    );
}


// ======================================================
// CARREGAR DADOS
// ======================================================

function carregarHistorico() {

    const dados =
        lerStorage(HISTORICO_KEY);

    return Array.isArray(dados)
        ? dados
        : [];
}


function carregarPerfil() {

    const dados =
        lerStorage(PERFIL_KEY);

    return dados &&
        typeof dados === "object"
        ? dados
        : {};
}


// ======================================================
// ANÁLISES VISUAIS
// ======================================================

function carregarAnalises() {

    const analises = [];

    CHAVES_ANALISE.forEach(chave => {

        const dados =
            lerStorage(chave);

        if (!dados) {
            return;
        }

        if (Array.isArray(dados)) {

            dados.forEach(item => {

                if (item) {
                    analises.push(item);
                }

            });

        } else {

            analises.push(dados);

        }

    });

    return analises;
}


// ======================================================
// ESTATÍSTICAS
// ======================================================

function calcularEstatisticas(historico) {

    let ondas = 0;

    let somaNotas = 0;

    let quantidadeNotas = 0;


    historico.forEach(sessao => {

        if (!sessao) {
            return;
        }


        // ONDAS

        ondas += numero(
            sessao.ondasPegadas ??
            sessao.ondas ??
            0
        );


        // NOTA

        const nota =
            sessao.nota ??
            sessao.notaSessao ??
            sessao.avaliacao;


        if (
            nota !== undefined &&
            nota !== null &&
            nota !== ""
        ) {

            const valor =
                numero(nota);

            if (valor > 0) {

                somaNotas += valor;

                quantidadeNotas++;

            }

        }

    });


    const mediaNota =
        quantidadeNotas > 0
            ? somaNotas / quantidadeNotas
            : 0;


    return {

        sessoes:
            historico.length,

        ondas,

        mediaNota

    };

}


// ======================================================
// WAVERISE SCORE
// ======================================================

function calcularScore(estatisticas) {

    if (
        estatisticas.sessoes === 0
    ) {

        return 0;

    }


    const frequencia =
        limitar(
            estatisticas.sessoes * 10
        );


    const experiencia =
        limitar(
            estatisticas.ondas / 2
        );


    const tecnica =
        estatisticas.mediaNota > 0

            ? limitar(
                estatisticas.mediaNota * 10
            )

            : 50;


    const score =
        Math.round(

            frequencia * 0.30 +

            experiencia * 0.20 +

            tecnica * 0.50

        );


    return score;

}


// ======================================================
// DEFINIR FASE
// ======================================================

function determinarFase(score) {

    if (score >= 80) {
        return 4;
    }

    if (score >= 60) {
        return 3;
    }

    if (score >= 40) {
        return 2;
    }

    return 1;

}


// ======================================================
// DADOS DAS FASES
// ======================================================

const fases = {

    1: {

        titulo:
            "Fase 1 — Construção da base",

        descricao:
            "Construindo fundamentos, confiança e consistência no mar."

    },

    2: {

        titulo:
            "Fase 2 — Consistência",

        descricao:
            "Transformando experiência em controle e repetição."

    },

    3: {

        titulo:
            "Fase 3 — Técnica",

        descricao:
            "Aprimorando manobras, velocidade e leitura da onda."

    },

    4: {

        titulo:
            "Fase 4 — Performance",

        descricao:
            "Refinando velocidade, precisão e combinação de manobras."

    }

};


// ======================================================
// ATUALIZAR FASE
// ======================================================

function atualizarFase(faseAtual) {

    const dados =
        fases[faseAtual];


    if (!dados) {
        return;
    }


    if (elementos.statusFase) {

        elementos.statusFase.textContent =
            dados.titulo;

    }


    if (elementos.statusDescricao) {

        elementos.statusDescricao.textContent =
            dados.descricao;

    }


    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const fase =
            document.getElementById(
                `fase${i}`
            );

        const status =
            document.getElementById(
                `statusFase${i}`
            );


        if (!fase || !status) {
            continue;
        }


        fase.classList.remove(
            "faseAtual",
            "faseConcluida"
        );


        if (i < faseAtual) {

            fase.classList.add(
                "faseConcluida"
            );

            status.textContent =
                "✓ CONCLUÍDA";

        }


        if (i === faseAtual) {

            fase.classList.add(
                "faseAtual"
            );

            status.textContent =
                "FASE ATUAL";

        }


        if (i > faseAtual) {

            status.textContent =
                "PRÓXIMA FASE";

        }

    }

}


// ======================================================
// PROGRESSO
// ======================================================

function calcularProgresso(estatisticas) {

    const progressoSessoes =
        Math.min(
            100,
            estatisticas.sessoes / 12 * 100
        );


    const progressoOndas =
        Math.min(
            100,
            estatisticas.ondas / 50 * 100
        );


    const progressoNota =
        estatisticas.mediaNota > 0

            ? Math.min(
                100,
                estatisticas.mediaNota / 10 * 100
            )

            : 0;


    return Math.round(

        (
            progressoSessoes +
            progressoOndas +
            progressoNota

        ) / 3

    );

}


// ======================================================
// ATUALIZAR PROGRESSO
// ======================================================

function atualizarProgresso(valor) {

    if (elementos.progressoValor) {

        elementos.progressoValor.textContent =
            `${valor}%`;

    }


    if (elementos.barraProgresso) {

        elementos.barraProgresso.style.width =
            `${valor}%`;

    }

}


// ======================================================
// RESUMO
// ======================================================

function atualizarResumo(
    estatisticas,
    score
) {

    if (elementos.resumoSessoes) {

        elementos.resumoSessoes.textContent =
            estatisticas.sessoes;

    }


    if (elementos.resumoOndas) {

        elementos.resumoOndas.textContent =
            estatisticas.ondas;

    }


    if (elementos.resumoNota) {

        elementos.resumoNota.textContent =
            estatisticas.mediaNota > 0

                ? estatisticas.mediaNota.toFixed(1)

                : "--";

    }


    if (elementos.resumoScore) {

        elementos.resumoScore.textContent =
            score > 0

                ? `${score}/100`

                : "--";

    }

}


// ======================================================
// METAS
// ======================================================

function atualizarMetas(
    estatisticas,
    possuiAnalise
) {


    // SESSÕES

    if (elementos.metaSessoes) {

        if (
            estatisticas.sessoes >= 3
        ) {

            elementos.metaSessoes.textContent =
                "✓";

        } else {

            elementos.metaSessoes.textContent =
                `${estatisticas.sessoes}/3`;

        }

    }


    // ONDAS

    if (elementos.metaOndas) {

        if (
            estatisticas.ondas >= 50
        ) {

            elementos.metaOndas.textContent =
                "✓";

        } else {

            elementos.metaOndas.textContent =
                `${estatisticas.ondas}/50`;

        }

    }


    // NOTA

    if (elementos.metaNota) {

        if (
            estatisticas.mediaNota >= 8
        ) {

            elementos.metaNota.textContent =
                "✓";

        } else if (
            estatisticas.mediaNota > 0
        ) {

            elementos.metaNota.textContent =
                `${estatisticas.mediaNota.toFixed(1)}/8`;

        } else {

            elementos.metaNota.textContent =
                "○";

        }

    }


    // ANÁLISE VISUAL

    if (elementos.metaAnalise) {

        elementos.metaAnalise.textContent =
            possuiAnalise
                ? "✓"
                : "○";

    }

}


// ======================================================
// TREINO FASE 1
// ======================================================

function treinoFase1() {

    elementos.treino1Titulo.textContent =
        "Mobilidade";

    elementos.treino1Texto.textContent =
        "Trabalhe quadril, tornozelos e coluna para melhorar sua base.";


    elementos.treino2Titulo.textContent =
        "Pop-up";

    elementos.treino2Texto.textContent =
        "Faça repetições rápidas buscando movimento limpo e consistente.";


    elementos.treino3Titulo.textContent =
        "Equilíbrio";

    elementos.treino3Texto.textContent =
        "Desenvolva estabilidade e controle sobre a prancha.";


    elementos.treino4Titulo.textContent =
        "Sessão consciente";

    elementos.treino4Texto.textContent =
        "Escolha algumas ondas para focar exclusivamente na técnica.";

}


// ======================================================
// TREINO FASE 2
// ======================================================

function treinoFase2() {

    elementos.treino1Titulo.textContent =
        "Linha da onda";

    elementos.treino1Texto.textContent =
        "Treine leitura da parede e escolha uma linha mais eficiente.";


    elementos.treino2Titulo.textContent =
        "Transferência de peso";

    elementos.treino2Texto.textContent =
        "Trabalhe pressão entre pé dianteiro e traseiro.";


    elementos.treino3Titulo.textContent =
        "Velocidade";

    elementos.treino3Texto.textContent =
        "Use compressão e extensão para gerar velocidade.";


    elementos.treino4Titulo.textContent =
        "Repetição";

    elementos.treino4Texto.textContent =
        "Busque repetir o mesmo movimento com qualidade em várias ondas.";

}


// ======================================================
// TREINO FASE 3
// ======================================================

function treinoFase3() {

    elementos.treino1Titulo.textContent =
        "Bottom Turn";

    elementos.treino1Texto.textContent =
        "Trabalhe compressão, pressão no pé traseiro e rotação.";


    elementos.treino2Titulo.textContent =
        "Cutback";

    elementos.treino2Texto.textContent =
        "Treine controle de velocidade e mudança de direção.";


    elementos.treino3Titulo.textContent =
        "Geração de velocidade";

    elementos.treino3Texto.textContent =
        "Conecte compressão e extensão para acelerar na parede.";


    elementos.treino4Titulo.textContent =
        "Transições";

    elementos.treino4Texto.textContent =
        "Busque conectar uma manobra à outra sem perder velocidade.";

}


// ======================================================
// TREINO FASE 4
// ======================================================

function treinoFase4() {

    elementos.treino1Titulo.textContent =
        "Velocidade";

    elementos.treino1Texto.textContent =
        "Trabalhe linhas mais rápidas e aproveite melhor a parede.";


    elementos.treino2Titulo.textContent =
        "Manobras críticas";

    elementos.treino2Texto.textContent =
        "Busque maior pressão, amplitude e precisão nas manobras.";


    elementos.treino3Titulo.textContent =
        "Rotação";

    elementos.treino3Texto.textContent =
        "Aprimore rotação do tronco e posicionamento dos braços.";


    elementos.treino4Titulo.textContent =
        "Combinação";

    elementos.treino4Texto.textContent =
        "Trabalhe sequências de manobras mantendo velocidade e fluidez.";

}


// ======================================================
// ATUALIZAR TREINO
// ======================================================

function atualizarTreino(faseAtual) {

    if (faseAtual === 1) {

        treinoFase1();

    } else if (faseAtual === 2) {

        treinoFase2();

    } else if (faseAtual === 3) {

        treinoFase3();

    } else {

        treinoFase4();

    }

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

function iniciarPlano() {

    console.log(
        "🚀 Carregando Plano de Evolução..."
    );


    try {

        const historico =
            carregarHistorico();


        const perfil =
            carregarPerfil();


        const analises =
            carregarAnalises();


        const estatisticas =
            calcularEstatisticas(
                historico
            );


        const score =
            calcularScore(
                estatisticas
            );


        const faseAtual =
            determinarFase(score);


        const progresso =
            calcularProgresso(
                estatisticas
            );


        const objetivo =
            perfil.objetivo ||
            "Evoluir no surf";


        const possuiAnalise =
            analises.length > 0;


        // OBJETIVO

        if (elementos.objetivo) {

            elementos.objetivo.textContent =
                objetivo;

        }


        // FASE

        atualizarFase(
            faseAtual
        );


        // PROGRESSO

        atualizarProgresso(
            progresso
        );


        // RESUMO

        atualizarResumo(
            estatisticas,
            score
        );


        // METAS

        atualizarMetas(
            estatisticas,
            possuiAnalise
        );


        // TREINO

        atualizarTreino(
            faseAtual
        );


        console.log(
            "✅ Plano de Evolução carregado.",
            {

                objetivo,

                sessoes:
                    estatisticas.sessoes,

                ondas:
                    estatisticas.ondas,

                mediaNota:
                    estatisticas.mediaNota,

                score,

                faseAtual,

                progresso,

                possuiAnalise

            }
        );


    } catch (erro) {

        console.error(
            "❌ Erro no Plano de Evolução:",
            erro
        );

    }

}


// ======================================================
// EXECUTAR
// ======================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarPlano
    );

} else {

    iniciarPlano();

}