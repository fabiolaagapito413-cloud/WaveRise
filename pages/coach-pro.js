// ======================================================
// WAVERISE PRO
// COACH IA AVANÇADO
// ======================================================

console.log("🤖 WaveRise Coach IA Pro iniciado");

const BACKEND_URL = "https://waverise.onrender.com";

const HISTORICO_KEY = "historicoSurfWaveRise";
const PERFIL_KEY = "perfilWaveRise";

const CHAVES_ANALISE = [
    "analiseFotoWaveRise",
    "analiseVideoWaveRise",
    "ultimaAnaliseFoto",
    "ultimaAnaliseVideo",
    "historicoAnalisesWaveRise"
];

const el = {
    diagnostico: document.getElementById("diagnostico"),
    score: document.getElementById("waveScore"),
    scoreDescricao: document.getElementById("scoreDescricao"),
    pontosFortes: document.getElementById("pontosFortes"),
    melhorias: document.getElementById("melhorias"),

    valorEquilibrio: document.getElementById("valorEquilibrio"),
    barraEquilibrio: document.getElementById("barraEquilibrio"),

    valorPostura: document.getElementById("valorPostura"),
    barraPostura: document.getElementById("barraPostura"),

    valorPernas: document.getElementById("valorPernas"),
    barraPernas: document.getElementById("barraPernas"),

    valorBracos: document.getElementById("valorBracos"),
    barraBracos: document.getElementById("barraBracos"),

    valorPrancha: document.getElementById("valorPrancha"),
    barraPrancha: document.getElementById("barraPrancha"),

    bottomTurn: document.getElementById("bottomTurn"),
    barraBottomTurn: document.getElementById("barraBottomTurn"),

    cutback: document.getElementById("cutback"),
    barraCutback: document.getElementById("barraCutback"),

    aereo: document.getElementById("aereo"),
    barraAereo: document.getElementById("barraAereo"),

    carve: document.getElementById("carve"),
    barraCarve: document.getElementById("barraCarve"),

    missao: document.getElementById("missao"),
    descricaoMissao: document.getElementById("descricaoMissao"),
    barraMissao: document.getElementById("barraMissao"),
    progressoMissao: document.getElementById("progressoMissao"),

    treino: document.getElementById("treino"),
    proximoObjetivo: document.getElementById("proximoObjetivo"),

    nivel: document.getElementById("nivel"),
    xp: document.getElementById("xp"),
    ondas: document.getElementById("ondas"),
    tempo: document.getElementById("tempo"),

    relatorio: document.getElementById("relatorio"),

    planoObjetivo: document.getElementById("planoObjetivo"),
    planoPrazo: document.getElementById("planoPrazo"),
    planoFrequencia: document.getElementById("planoFrequencia"),
    planoFase: document.getElementById("planoFase"),
    planoMeta: document.getElementById("planoMeta"),
    planoTreino: document.getElementById("planoTreino"),
    planoProgresso: document.getElementById("planoProgresso"),
    barraPlano: document.getElementById("barraPlano")
};


// ======================================================
// LOCAL STORAGE
// ======================================================

function lerStorage(chave, padrao = null) {

    try {

        const valor = localStorage.getItem(chave);

        return valor
            ? JSON.parse(valor)
            : padrao;

    } catch {

        return padrao;

    }

}


// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

function texto(elemento, valor) {

    if (elemento) {
        elemento.textContent = valor ?? "--";
    }

}


function limitar(valor, padrao = 0) {

    const n = Number(valor);

    if (!Number.isFinite(n)) {
        return padrao;
    }

    return Math.max(
        0,
        Math.min(100, Math.round(n))
    );

}


function numero(valor, padrao = 0) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {
        return padrao;
    }

    const n = Number(
        String(valor)
            .replace(",", ".")
            .replace(/[^\d.-]/g, "")
    );

    return Number.isFinite(n)
        ? n
        : padrao;

}


// ======================================================
// CARREGAR DADOS
// ======================================================

function carregarHistorico() {

    const dados = lerStorage(
        HISTORICO_KEY,
        []
    );

    return Array.isArray(dados)
        ? dados
        : [];

}


function carregarPerfil() {

    const dados = lerStorage(
        PERFIL_KEY,
        {}
    );

    return dados &&
        typeof dados === "object"
        ? dados
        : {};

}


function carregarAnalises() {

    const resultado = [];

    for (const chave of CHAVES_ANALISE) {

        const dados = lerStorage(chave);

        if (!dados) {
            continue;
        }

        if (Array.isArray(dados)) {

            dados.forEach(item => {

                if (item) {
                    resultado.push(item);
                }

            });

        } else {

            resultado.push(dados);

        }

    }

    return resultado;

}


// ======================================================
// ESTATÍSTICAS
// ======================================================

function calcularEstatisticas(historico) {

    let ondas = 0;

    let tempoMinutos = 0;

    let somaNotas = 0;

    let quantidadeNotas = 0;

    const praias = {};


    for (const sessao of historico) {

        if (!sessao) {
            continue;
        }


        ondas += numero(
            sessao.ondasPegadas ??
            sessao.ondas,
            0
        );


        const tempo =
            sessao.tempoNoMar ??
            sessao.tempo ??
            sessao.duracao;


        if (typeof tempo === "number") {

            tempoMinutos += tempo;

        } else if (
            typeof tempo === "string"
        ) {

            const horas =
                tempo.match(
                    /(\d+(?:\.\d+)?)\s*h/i
                );

            const minutos =
                tempo.match(
                    /(\d+(?:\.\d+)?)\s*m/i
                );


            if (horas) {

                tempoMinutos +=
                    Number(horas[1]) * 60;

            }


            if (minutos) {

                tempoMinutos +=
                    Number(minutos[1]);

            }


            if (
                !horas &&
                !minutos &&
                !Number.isNaN(Number(tempo))
            ) {

                tempoMinutos += Number(tempo);

            }

        }


        const nota =
            sessao.nota ??
            sessao.notaSessao ??
            sessao.avaliacao;


        if (
            nota !== undefined &&
            nota !== null &&
            nota !== ""
        ) {

            somaNotas += numero(nota);

            quantidadeNotas++;

        }


        const praia =
            sessao.praia ??
            sessao.local ??
            sessao.spot;


        if (praia) {

            const nome =
                String(praia).trim();

            if (nome) {

                praias[nome] =
                    (praias[nome] || 0) + 1;

            }

        }

    }


    return {

        sessoes: historico.length,

        ondas,

        tempoMinutos,

        mediaNota:
            quantidadeNotas
                ? somaNotas / quantidadeNotas
                : 0,

        praias

    };

}


// ======================================================
// XP
// ======================================================

function calcularXP(est) {

    return Math.round(

        est.sessoes * 50 +

        est.ondas * 2 +

        Math.floor(
            est.tempoMinutos / 10
        )

    );

}


// ======================================================
// NÍVEL
// ======================================================

function calcularNivel(xp) {

    if (xp >= 5000) return 10;

    if (xp >= 4000) return 9;

    if (xp >= 3200) return 8;

    if (xp >= 2500) return 7;

    if (xp >= 1900) return 6;

    if (xp >= 1400) return 5;

    if (xp >= 1000) return 4;

    if (xp >= 650) return 3;

    if (xp >= 300) return 2;

    return 1;

}


// ======================================================
// SCORE
// ======================================================

function calcularScore(est) {

    if (!est.sessoes) {
        return 0;
    }


    const frequencia =
        limitar(
            est.sessoes * 10
        );


    const experiencia =
        limitar(
            est.ondas / 2
        );


    const tempo =
        limitar(
            est.tempoMinutos / 3
        );


    const tecnica =
        est.mediaNota > 0
            ? limitar(
                est.mediaNota * 10
            )
            : 50;


    return Math.round(

        frequencia * 0.20 +

        experiencia * 0.20 +

        tempo * 0.20 +

        tecnica * 0.40

    );

}


// ======================================================
// BARRAS
// ======================================================

function atualizarBarra(
    valorEl,
    barraEl,
    valor
) {

    const v =
        valor === null ||
        valor === undefined
            ? 0
            : limitar(valor);


    texto(
        valorEl,
        valor === null ||
        valor === undefined
            ? "--"
            : `${v}%`
    );


    if (barraEl) {

        barraEl.style.width =
            `${v}%`;

    }

}


function atualizarManobra(
    valorEl,
    barraEl,
    valor
) {

    atualizarBarra(
        valorEl,
        barraEl,
        valor
    );

}


// ======================================================
// PEGAR PRIMEIRO NÚMERO VÁLIDO
// ======================================================

function primeiroNumero(...valores) {

    for (const valor of valores) {

        const n = Number(valor);

        if (Number.isFinite(n)) {

            return n;

        }

    }

    return null;

}


// ======================================================
// LISTA HTML
// ======================================================

function listaHtml(
    itens,
    emoji
) {

    if (
        !Array.isArray(itens) ||
        !itens.length
    ) {

        return `
            <p>
                ${emoji}
                Continue registrando suas
                sessões para o Coach conhecer
                melhor seu surf.
            </p>
        `;

    }


    return itens
        .filter(Boolean)
        .slice(0, 6)
        .map(item => `
            <p>
                ${emoji} ${item}
            </p>
        `)
        .join("");

}


// ======================================================
// NORMALIZAR RESPOSTA DA IA
// ======================================================

function obterRespostaNormalizada(data) {

    if (
        !data ||
        typeof data !== "object"
    ) {

        return {};

    }


    if (
        data.analise &&
        typeof data.analise === "object"
    ) {

        return {
            ...data,
            ...data.analise
        };

    }


    if (
        data.resultado &&
        typeof data.resultado === "object"
    ) {

        return {
            ...data,
            ...data.resultado
        };

    }


    return data;

}


// ======================================================
// CHAMAR BACKEND
// ======================================================

async function pedirAnaliseIA(
    payload
) {

    const resposta = await fetch(
        `${BACKEND_URL}/coach/analisar`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(
                payload
            )

        }
    );


    if (!resposta.ok) {

        throw new Error(
            `Coach IA HTTP ${resposta.status}`
        );

    }


    const dados =
        await resposta.json();


    return obterRespostaNormalizada(
        dados
    );

}
// ======================================================
// APLICAR RESPOSTA DA IA
// ======================================================

function aplicarRespostaIA(ai, contexto) {

    const score = primeiroNumero(
        ai.score,
        ai.waveScore,
        ai.wave_rise_score
    );


    const diagnostico =
        ai.diagnostico ||
        ai.diagnosis;


    const descricaoScore =
        ai.scoreDescricao ||
        ai.score_descricao;


    if (diagnostico) {

        texto(
            el.diagnostico,
            diagnostico
        );

    }


    if (score !== null) {

        texto(
            el.score,
            limitar(score)
        );

    }


    if (descricaoScore) {

        texto(
            el.scoreDescricao,
            descricaoScore
        );

    }


    // ==================================================
    // PONTOS FORTES
    // ==================================================

    if (
        Array.isArray(
            ai.pontosFortes
        )
    ) {

        el.pontosFortes.innerHTML =
            listaHtml(
                ai.pontosFortes,
                "✅"
            );

    }


    // ==================================================
    // MELHORIAS
    // ==================================================

    if (
        Array.isArray(
            ai.melhorias
        )
    ) {

        el.melhorias.innerHTML =
            listaHtml(
                ai.melhorias,
                "🎯"
            );

    }


    // ==================================================
    // TÉCNICA
    // ==================================================

    const tecnica =
        ai.tecnica ||
        ai.habilidades ||
        {};


    atualizarBarra(

        el.valorEquilibrio,

        el.barraEquilibrio,

        primeiroNumero(
            tecnica.equilibrio,
            ai.equilibrio
        )

    );


    atualizarBarra(

        el.valorPostura,

        el.barraPostura,

        primeiroNumero(
            tecnica.postura,
            ai.postura
        )

    );


    atualizarBarra(

        el.valorPernas,

        el.barraPernas,

        primeiroNumero(
            tecnica.pernas,
            ai.pernas
        )

    );


    atualizarBarra(

        el.valorBracos,

        el.barraBracos,

        primeiroNumero(
            tecnica.bracos,
            ai.bracos
        )

    );


    atualizarBarra(

        el.valorPrancha,

        el.barraPrancha,

        primeiroNumero(
            tecnica.posicaoNaPrancha,
            tecnica.prancha,
            ai.prancha
        )

    );


    // ==================================================
    // MANOBRAS
    // ==================================================

    const manobras =
        ai.manobras ||
        {};


    atualizarManobra(

        el.bottomTurn,

        el.barraBottomTurn,

        primeiroNumero(
            manobras.bottomTurn,
            ai.bottomTurn
        )

    );


    atualizarManobra(

        el.cutback,

        el.barraCutback,

        primeiroNumero(
            manobras.cutback,
            ai.cutback
        )

    );


    atualizarManobra(

        el.aereo,

        el.barraAereo,

        primeiroNumero(
            manobras.aereo,
            ai.aereo
        )

    );


    atualizarManobra(

        el.carve,

        el.barraCarve,

        primeiroNumero(
            manobras.carve,
            ai.carve
        )

    );


    // ==================================================
    // PLANO DE EVOLUÇÃO
    // ==================================================

    const plano =
        ai.plano ||
        ai.planoEvolucao ||
        {};


    texto(
        el.planoObjetivo,

        plano.objetivo ||
        contexto.perfil.objetivo ||
        "Evoluir no surf"

    );


    texto(

        el.planoPrazo,

        plano.prazo ||
        "Próximas 4 semanas"

    );


    texto(

        el.planoFrequencia,

        plano.frequencia ||
        "2 a 3 sessões por semana"

    );


    texto(

        el.planoFase,

        plano.fase ||
        "Construção da consistência"

    );


    texto(

        el.planoMeta,

        plano.meta ||
        "Aumentar a qualidade das sessões."

    );


    texto(

        el.planoTreino,

        plano.treino ||
        "Trabalhar técnica e consistência."

    );


    const progresso =
        limitar(

            primeiroNumero(
                plano.progresso,
                ai.progressoPlano
            ) ?? 0

        );


    texto(

        el.planoProgresso,

        `${progresso}% concluído`

    );


    if (el.barraPlano) {

        el.barraPlano.style.width =
            `${progresso}%`;

    }


    // ==================================================
    // MISSÃO
    // ==================================================

    const missao =
        ai.missao ||
        {};


    texto(

        el.missao,

        typeof missao === "string"
            ? missao
            : missao.titulo ||
              "Próxima missão"

    );


    texto(

        el.descricaoMissao,

        typeof missao === "string"

            ? "Siga essa missão na próxima sessão."

            : missao.descricao ||
              "Trabalhe esse objetivo na próxima sessão."

    );


    const progressoMissao =
        limitar(

            primeiroNumero(

                typeof missao === "object"
                    ? missao.progresso
                    : null,

                ai.progressoMissao

            ) ?? 0

        );


    if (el.barraMissao) {

        el.barraMissao.style.width =
            `${progressoMissao}%`;

    }


    texto(

        el.progressoMissao,

        `${progressoMissao}% concluído`

    );


    // ==================================================
    // TREINO
    // ==================================================

    texto(

        el.treino,

        ai.treino ||
        ai.treinoRecomendado ||
        "Treino personalizado em construção."

    );


    // ==================================================
    // PRÓXIMO OBJETIVO
    // ==================================================

    texto(

        el.proximoObjetivo,

        ai.proximoObjetivo
            ? `🎯 ${ai.proximoObjetivo}`
            : "🎯 Continue registrando suas sessões."

    );


    // ==================================================
    // RELATÓRIO
    // ==================================================

    if (ai.relatorio) {

        el.relatorio.innerHTML = `

            <div class="relatorioResumo">

                <p>
                    ${ai.relatorio}
                </p>

            </div>

        `;

    }


    // Se a IA não retornou score,
    // usamos o score calculado localmente.

    if (
        score === null &&
        contexto.score > 0
    ) {

        texto(
            el.score,
            contexto.score
        );

    }


    console.log(
        "🤖 Resposta do Coach IA:",
        ai
    );

}


// ======================================================
// MODO LOCAL DE SEGURANÇA
// ======================================================

function aplicarModoLocal(contexto) {

    const {
        est,
        perfil,
        score,
        analises,
        xp,
        nivel
    } = contexto;


    // -----------------------------------------------
    // SEM SESSÕES
    // -----------------------------------------------

    if (!est.sessoes) {

        texto(

            el.diagnostico,

            "Ainda preciso das suas primeiras sessões para conhecer seu surf."

        );


        texto(
            el.score,
            "--"
        );


        texto(

            el.scoreDescricao,

            "Registre sua primeira sessão para começar."

        );


        return;

    }


    const objetivo =
        perfil.objetivo ||
        "evoluir no surf";


    // -----------------------------------------------
    // DIAGNÓSTICO
    // -----------------------------------------------

    let diagnostico;


    if (score >= 80) {

        diagnostico =

            `Seu histórico mostra uma evolução consistente. ` +
            `Você já possui uma boa base para ${objetivo}. ` +
            `O próximo passo é buscar mais precisão, velocidade e consistência técnica.`;

    }

    else if (score >= 60) {

        diagnostico =

            "Você está construindo uma boa evolução. " +
            "Seu histórico indica que o próximo passo é transformar experiência em consistência técnica.";

    }

    else {

        diagnostico =

            "Você está na fase de construção da sua evolução. " +
            "O foco agora deve ser ganhar experiência, confiança e consistência nas sessões.";

    }


    texto(
        el.diagnostico,
        diagnostico
    );


    // -----------------------------------------------
    // SCORE
    // -----------------------------------------------

    texto(
        el.score,
        score
    );


    texto(

        el.scoreDescricao,

        score < 40

            ? "Você está começando sua jornada. Continue surfando!"

            : score < 60

                ? "Boa evolução. Agora vamos buscar mais consistência."

                : score < 75

                    ? "Você está evoluindo bem. O próximo foco é técnica."

                    : score < 90

                        ? "Excelente desempenho. Seu surf está ficando consistente."

                        : "Nível avançado. Agora o foco é refinamento técnico."

    );


    // -----------------------------------------------
    // PONTOS FORTES
    // -----------------------------------------------

    const fortes = [];


    if (est.sessoes >= 5) {

        fortes.push(
            "Boa frequência de sessões."
        );

    }


    if (est.ondas >= 30) {

        fortes.push(
            "Boa experiência acumulada em ondas."
        );

    }


    if (est.tempoMinutos >= 300) {

        fortes.push(
            "Boa quantidade de tempo no mar."
        );

    }


    if (est.mediaNota >= 8) {

        fortes.push(
            "Boas avaliações nas sessões."
        );

    }


    if (score >= 70) {

        fortes.push(
            "Boa consistência geral no histórico."
        );

    }


    el.pontosFortes.innerHTML =
        listaHtml(

            fortes.length
                ? fortes
                : [
                    "Você já começou a construir seu histórico no WaveRise."
                ],

            "✅"

        );


    // -----------------------------------------------
    // MELHORIAS
    // -----------------------------------------------

    const melhorias = [];


    if (est.sessoes < 5) {

        melhorias.push(
            "Aumentar a frequência das sessões."
        );

    }


    if (est.ondas < 30) {

        melhorias.push(
            "Buscar mais tempo de prática e aumentar o número de ondas."
        );

    }


    if (
        est.mediaNota > 0 &&
        est.mediaNota < 7
    ) {

        melhorias.push(
            "Trabalhar os fundamentos antes de buscar manobras mais complexas."
        );

    }


    if (score < 70) {

        melhorias.push(
            "Buscar mais consistência na execução."
        );

    }


    el.melhorias.innerHTML =
        listaHtml(

            melhorias.length
                ? melhorias
                : [
                    "Continue registrando suas sessões para identificar novos pontos de evolução."
                ],

            "🎯"

        );


    // -----------------------------------------------
    // PLANO
    // -----------------------------------------------

    const prazo =

        score < 40
            ? "Próximas 4 semanas"
            : score < 70
                ? "Próximas 6 semanas"
                : "Próximas 8 semanas";


    const frequencia =

        score < 40
            ? "2 sessões por semana"
            : score < 70
                ? "2 a 3 sessões por semana"
                : "3 sessões por semana";


    const fase =

        score < 40
            ? "Fase 1 — Fundamentos"
            : score < 70
                ? "Fase 2 — Consistência"
                : "Fase 3 — Técnica";


    const meta =

        score < 40

            ? "Ganhar confiança, equilíbrio e consistência."

            : score < 70

                ? "Aumentar o número de ondas bem executadas."

                : "Aumentar a qualidade das manobras e a consistência.";


    const treino =

        score < 50

            ? "15 min de mobilidade + 20 pop-ups + exercícios de equilíbrio."

            : score < 70

                ? "Treine pop-up explosivo, equilíbrio e transferência de peso."

                : "Trabalhe Bottom Turn, geração de velocidade e transição entre compressão e extensão.";


    texto(
        el.planoObjetivo,
        objetivo
    );


    texto(
        el.planoPrazo,
        prazo
    );


    texto(
        el.planoFrequencia,
        frequencia
    );


    texto(
        el.planoFase,
        fase
    );


    texto(
        el.planoMeta,
        meta
    );


    texto(
        el.planoTreino,
        treino
    );


    const progressoPlano =
        limitar(
            est.sessoes / 12 * 100
        );


    texto(

        el.planoProgresso,

        `${progressoPlano}% concluído`

    );


    if (el.barraPlano) {

        el.barraPlano.style.width =
            `${progressoPlano}%`;

    }


    // -----------------------------------------------
    // MISSÃO
    // -----------------------------------------------

    let missao;

    let descricao;

    let progressoMissao = 0;


    if (est.ondas < 15) {

        missao =
            "Surfar 15 ondas";


        descricao =
            "Concentre-se em pegar ondas com boa posição e equilíbrio.";


        progressoMissao =
            limitar(
                est.ondas / 15 * 100
            );

    }

    else if (score < 60) {

        missao =
            "Treinar fundamentos";


        descricao =
            "Faça uma sessão focando postura, joelhos e distribuição de peso.";


        progressoMissao = 40;

    }

    else if (score < 80) {

        missao =
            "Aprimorar o Bottom Turn";


        descricao =
            "Trabalhe compressão, transferência de peso e rotação do tronco.";


        progressoMissao = 60;

    }

    else {

        missao =
            "Buscar mais velocidade";


        descricao =
            "Trabalhe linha, compressão e extensão para gerar velocidade.";


        progressoMissao = 75;

    }


    texto(
        el.missao,
        missao
    );


    texto(
        el.descricaoMissao,
        descricao
    );


    if (el.barraMissao) {

        el.barraMissao.style.width =
            `${progressoMissao}%`;

    }


    texto(

        el.progressoMissao,

        `${Math.round(progressoMissao)}% concluído`

    );


    // -----------------------------------------------
    // TREINO
    // -----------------------------------------------

    texto(
        el.treino,
        treino
    );


    // -----------------------------------------------
    // PRÓXIMO OBJETIVO
    // -----------------------------------------------

    const proximo =

        est.sessoes < 3

            ? "Registrar 3 sessões de surf."

            : est.ondas < 50

                ? "Chegar a 50 ondas registradas."

                : score < 70

                    ? "Aumentar sua consistência técnica."

                    : score < 85

                        ? "Aprimorar Bottom Turn e Cutback."

                        : "Desenvolver manobras avançadas.";


    texto(

        el.proximoObjetivo,

        `🎯 ${proximo}`

    );


    // -----------------------------------------------
    // ESTATÍSTICAS
    // -----------------------------------------------

    texto(
        el.nivel,
        nivel
    );


    texto(
        el.xp,
        xp
    );


    texto(
        el.ondas,
        est.ondas
    );


    texto(

        el.tempo,

        `${(
            est.tempoMinutos / 60
        ).toFixed(1)}h`

    );


    // -----------------------------------------------
    // RELATÓRIO
    // -----------------------------------------------

    const praias =

        Object.entries(
            est.praias
        )
        .sort(
            (a, b) => b[1] - a[1]
        );


    const praiaPrincipal =

        praias.length
            ? praias[0][0]
            : "Nenhuma registrada";


    const media =

        est.mediaNota > 0
            ? est.mediaNota.toFixed(1)
            : "--";


    el.relatorio.innerHTML = `

        <div class="relatorioResumo">

            <p>
                🏄
                <strong>
                    ${est.sessoes}
                </strong>
                sessões registradas
            </p>

            <p>
                🌊
                <strong>
                    ${est.ondas}
                </strong>
                ondas surfadas
            </p>

            <p>
                ⭐ Média das sessões:
                <strong>
                    ${media}
                </strong>
            </p>

            <p>
                🔥 WaveRise Score:
                <strong>
                    ${score}/100
                </strong>
            </p>

            <p>
                📈 Nível:
                <strong>
                    ${nivel}
                </strong>
            </p>

            <p>
                📍 Praia mais registrada:
                <strong>
                    ${praiaPrincipal}
                </strong>
            </p>

            <p>
                🤖 Análises visuais:
                <strong>
                    ${analises.length}
                </strong>
            </p>

        </div>

    `;


    console.warn(
        "⚠️ Coach IA indisponível. Modo local ativado."
    );

}


// ======================================================
// INICIAR COACH
// ======================================================

async function iniciarCoachPro() {

    console.log(
        "🚀 Carregando Coach IA Pro..."
    );


    const historico =
        carregarHistorico();


    const perfil =
        carregarPerfil();


    const analises =
        carregarAnalises();


    const est =
        calcularEstatisticas(
            historico
        );


    const xp =
        calcularXP(est);


    const nivel =
        calcularNivel(xp);


    const score =
        calcularScore(est);


    const contexto = {

        historico,

        perfil,

        analises,

        est,

        xp,

        nivel,

        score

    };


    // Mostrar estatísticas imediatamente

    texto(
        el.nivel,
        nivel
    );


    texto(
        el.xp,
        xp
    );


    texto(
        el.ondas,
        est.ondas
    );


    texto(

        el.tempo,

        `${(
            est.tempoMinutos / 60
        ).toFixed(1)}h`

    );


    try {

        const ai =
            await pedirAnaliseIA({

                tipo: "coach-pro",

                usuario: perfil,

                historico,

                analises,

                estatisticas: est,

                scoreCalculado: score,

                nivel,

                xp

            });


        aplicarRespostaIA(
            ai,
            contexto
        );


        console.log(
            "✅ Coach IA Pro carregado pela IA."
        );


    } catch (erro) {

        console.error(
            "❌ Não foi possível consultar o Coach IA:",
            erro
        );


        aplicarModoLocal(
            contexto
        );

    }

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarCoachPro
    );

} else {

    iniciarCoachPro();

}