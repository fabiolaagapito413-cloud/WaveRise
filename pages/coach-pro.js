// ======================================================
// WAVERISE PRO
// COACH IA AVANÇADO
// ======================================================

console.log("🤖 WaveRise Coach IA Pro iniciado");

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

    diagnostico: document.getElementById("diagnostico"),

    // CORRIGIDO: HTML usa waveScore
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

    proximoObjetivo:
        document.getElementById("proximoObjetivo"),

    nivel: document.getElementById("nivel"),
    xp: document.getElementById("xp"),
    ondas: document.getElementById("ondas"),
    tempo: document.getElementById("tempo"),

    relatorio: document.getElementById("relatorio"),

    planoObjetivo:
        document.getElementById("planoObjetivo"),

    planoPrazo:
        document.getElementById("planoPrazo"),

    planoFrequencia:
        document.getElementById("planoFrequencia"),

    planoFase:
        document.getElementById("planoFase"),

    planoMeta:
        document.getElementById("planoMeta"),

    planoTreino:
        document.getElementById("planoTreino"),

    planoProgresso:
        document.getElementById("planoProgresso"),

    barraPlano:
        document.getElementById("barraPlano")
};


// ======================================================
// UTILIDADES
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


function limitar(valor) {

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(numero(valor))
        )
    );

}


function texto(elemento, valor) {

    if (!elemento) {
        return;
    }

    elemento.textContent = valor;

}


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


function carregarAnalisesVisuais() {

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
    let tempoMinutos = 0;
    let somaNotas = 0;
    let quantidadeNotas = 0;

    const praias = {};

    historico.forEach(sessao => {

        if (!sessao) {
            return;
        }

        ondas += numero(
            sessao.ondasPegadas ??
            sessao.ondas ??
            0
        );


        const tempo =
            sessao.tempoNoMar ??
            sessao.tempo ??
            sessao.duracao ??
            0;


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

                tempoMinutos +=
                    Number(tempo);

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

            const valor =
                numero(nota);

            if (
                Number.isFinite(valor)
            ) {

                somaNotas += valor;
                quantidadeNotas++;

            }
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

    });


    const mediaNota =
        quantidadeNotas > 0
            ? somaNotas / quantidadeNotas
            : 0;


    return {

        sessoes: historico.length,
        ondas,
        tempoMinutos,
        mediaNota,
        praias

    };
}


// ======================================================
// XP
// ======================================================

function calcularXP(estatisticas) {

    const xpSessoes =
        estatisticas.sessoes * 50;

    const xpOndas =
        estatisticas.ondas * 2;

    const xpTempo =
        Math.floor(
            estatisticas.tempoMinutos / 10
        );

    return Math.round(
        xpSessoes +
        xpOndas +
        xpTempo
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


    const tempo =
        limitar(
            estatisticas.tempoMinutos / 3
        );


    const tecnica =
        estatisticas.mediaNota > 0
            ? limitar(
                estatisticas.mediaNota * 10
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
// SCORE NA TELA
// ======================================================

function atualizarScore(score) {

    texto(
        elementos.score,
        score > 0
            ? score
            : "--"
    );


    let descricao;


    if (score === 0) {

        descricao =
            "Registre sua primeira sessão para começar.";

    } else if (score < 40) {

        descricao =
            "Você está começando sua jornada. Continue surfando!";

    } else if (score < 60) {

        descricao =
            "Boa evolução. Agora vamos buscar mais consistência.";

    } else if (score < 75) {

        descricao =
            "Você está evoluindo bem. O próximo foco é técnica.";

    } else if (score < 90) {

        descricao =
            "Excelente desempenho. Seu surf está ficando consistente.";

    } else {

        descricao =
            "Nível avançado. Agora o foco é refinamento técnico.";
    }


    texto(
        elementos.scoreDescricao,
        descricao
    );
}


// ======================================================
// DIAGNÓSTICO
// ======================================================

function gerarDiagnostico(
    estatisticas,
    perfil,
    score,
    analises
) {

    if (
        estatisticas.sessoes === 0
    ) {

        texto(
            elementos.diagnostico,
            "Ainda preciso das suas primeiras sessões para conhecer seu surf."
        );

        return;
    }


    const objetivo =
        perfil.objetivo ||
        "evoluir no surf";


    let diagnostico;


    if (score >= 80) {

        diagnostico =
            `Seu histórico mostra uma evolução consistente. ` +
            `Você já possui uma boa base para ${objetivo}. ` +
            `O próximo passo é buscar mais precisão, velocidade e consistência técnica.`;

    } else if (score >= 60) {

        diagnostico =
            `Você está construindo uma boa evolução. ` +
            `Seu histórico indica que o próximo passo é transformar experiência em consistência técnica.`;

    } else {

        diagnostico =
            `Você está na fase de construção da sua evolução. ` +
            `O foco agora deve ser ganhar experiência, confiança e consistência nas sessões.`;
    }


    if (analises.length > 0) {

        diagnostico +=
            " Suas análises visuais também poderão complementar esse acompanhamento.";
    }


    texto(
        elementos.diagnostico,
        diagnostico
    );
}


// ======================================================
// PONTOS FORTES
// ======================================================

function gerarPontosFortes(
    estatisticas,
    score,
    analises
) {

    const pontos = [];


    if (estatisticas.sessoes >= 5) {

        pontos.push(
            "Boa frequência de sessões."
        );
    }


    if (estatisticas.ondas >= 30) {

        pontos.push(
            "Boa experiência acumulada em ondas."
        );
    }


    if (estatisticas.tempoMinutos >= 300) {

        pontos.push(
            "Boa quantidade de tempo no mar."
        );
    }


    if (estatisticas.mediaNota >= 8) {

        pontos.push(
            "Boas avaliações nas sessões."
        );
    }


    if (score >= 70) {

        pontos.push(
            "Boa consistência geral no histórico."
        );
    }


    analises.forEach(analise => {

        if (
            !analise ||
            !Array.isArray(
                analise.pontosFortes
            )
        ) {
            return;
        }


        analise.pontosFortes
            .slice(0, 3)
            .forEach(ponto => {

                if (
                    ponto &&
                    !pontos.includes(ponto)
                ) {

                    pontos.push(ponto);
                }

            });
    });


    if (
        pontos.length === 0
    ) {

        pontos.push(
            "Você já começou a construir seu histórico no WaveRise."
        );
    }


    if (elementos.pontosFortes) {

        elementos.pontosFortes.innerHTML =
            pontos
                .slice(0, 6)
                .map(
                    item =>
                        `<p>✅ ${item}</p>`
                )
                .join("");
    }
}


// ======================================================
// MELHORIAS
// ======================================================

function gerarMelhorias(
    estatisticas,
    score,
    analises
) {

    const melhorias = [];


    if (estatisticas.sessoes < 5) {

        melhorias.push(
            "Aumentar a frequência das sessões."
        );
    }


    if (estatisticas.ondas < 30) {

        melhorias.push(
            "Buscar mais tempo de prática e aumentar o número de ondas."
        );
    }


    if (
        estatisticas.mediaNota > 0 &&
        estatisticas.mediaNota < 7
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


    analises.forEach(analise => {

        if (
            !analise ||
            !Array.isArray(
                analise.melhorias
            )
        ) {
            return;
        }


        analise.melhorias
            .slice(0, 3)
            .forEach(melhoria => {

                if (
                    melhoria &&
                    !melhorias.includes(melhoria)
                ) {

                    melhorias.push(melhoria);
                }

            });
    });


    if (
        melhorias.length === 0
    ) {

        melhorias.push(
            "Continue registrando suas sessões para identificar novos pontos de evolução."
        );
    }


    if (elementos.melhorias) {

        elementos.melhorias.innerHTML =
            melhorias
                .slice(0, 6)
                .map(
                    item =>
                        `<p>🎯 ${item}</p>`
                )
                .join("");
    }
}


// ======================================================
// HABILIDADES
// ======================================================

function atualizarHabilidade(
    valorElemento,
    barraElemento,
    valor
) {

    const valorFinal =
        limitar(valor);


    texto(
        valorElemento,
        `${valorFinal}%`
    );


    if (barraElemento) {

        barraElemento.style.width =
            `${valorFinal}%`;
    }
}


// ======================================================
// MANOBRA
// ======================================================

function atualizarManobra(
    valorElemento,
    barraElemento,
    valor
) {

    if (
        valor === null ||
        valor === undefined
    ) {

        texto(
            valorElemento,
            "--"
        );

        if (barraElemento) {
            barraElemento.style.width = "0%";
        }

        return;
    }


    const valorFinal =
        limitar(valor);


    texto(
        valorElemento,
        `${valorFinal}%`
    );


    if (barraElemento) {

        barraElemento.style.width =
            `${valorFinal}%`;
    }
}


// ======================================================
// DESEMPENHO TÉCNICO
// ======================================================

function gerarDesempenho(
    estatisticas,
    score,
    analises
) {

    let equilibrio = null;
    let postura = null;
    let pernas = null;
    let bracos = null;
    let prancha = null;


    analises.forEach(analise => {

        if (
            !analise ||
            !analise.tecnica
        ) {
            return;
        }


        const tecnica =
            analise.tecnica;


        function extrairNumero(valor) {

            if (
                typeof valor === "number"
            ) {

                return valor;
            }


            if (
                typeof valor === "string"
            ) {

                const encontrado =
                    valor.match(
                        /(\d+(?:\.\d+)?)/
                    );


                if (encontrado) {

                    return Number(
                        encontrado[1]
                    );
                }
            }


            return null;
        }


        equilibrio =
            equilibrio ??
            extrairNumero(
                tecnica.equilibrio
            );


        postura =
            postura ??
            extrairNumero(
                tecnica.postura
            );


        pernas =
            pernas ??
            extrairNumero(
                tecnica.pernas
            );


        bracos =
            bracos ??
            extrairNumero(
                tecnica.bracos
            );


        prancha =
            prancha ??
            extrairNumero(
                tecnica.posicaoNaPrancha
            );

    });


    atualizarHabilidade(
        elementos.valorEquilibrio,
        elementos.barraEquilibrio,
        equilibrio
    );


    atualizarHabilidade(
        elementos.valorPostura,
        elementos.barraPostura,
        postura
    );


    atualizarHabilidade(
        elementos.valorPernas,
        elementos.barraPernas,
        pernas
    );


    atualizarHabilidade(
        elementos.valorBracos,
        elementos.barraBracos,
        bracos
    );


    atualizarHabilidade(
        elementos.valorPrancha,
        elementos.barraPrancha,
        prancha
    );


    // ==================================================
    // MANOBRAS
    // ==================================================

    let bottomTurn = null;
    let cutback = null;
    let aereo = null;
    let carve = null;


    analises.forEach(analise => {

        if (!analise) {
            return;
        }


        const manobra =
            String(
                analise.manobra || ""
            ).toLowerCase();


        const nota =
            numero(
                analise.nota,
                0
            );


        if (!nota) {
            return;
        }


        if (
            manobra.includes("bottom")
        ) {

            bottomTurn =
                Math.max(
                    bottomTurn || 0,
                    nota
                );
        }


        if (
            manobra.includes("cutback")
        ) {

            cutback =
                Math.max(
                    cutback || 0,
                    nota
                );
        }


        if (
            manobra.includes("aéreo") ||
            manobra.includes("aereo")
        ) {

            aereo =
                Math.max(
                    aereo || 0,
                    nota
                );
        }


        if (
            manobra.includes("carve")
        ) {

            carve =
                Math.max(
                    carve || 0,
                    nota
                );
        }

    });


    atualizarManobra(
        elementos.bottomTurn,
        elementos.barraBottomTurn,
        bottomTurn
    );


    atualizarManobra(
        elementos.cutback,
        elementos.barraCutback,
        cutback
    );


    atualizarManobra(
        elementos.aereo,
        elementos.barraAereo,
        aereo
    );


    atualizarManobra(
        elementos.carve,
        elementos.barraCarve,
        carve
    );
}


// ======================================================
// PLANO DE EVOLUÇÃO
// ======================================================

function gerarPlanoEvolucao(
    estatisticas,
    perfil,
    score,
    nivel
) {

    const objetivo =
        perfil.objetivo ||
        "Evoluir no surf";


    let prazo;
    let frequencia;
    let fase;
    let meta;
    let treino;


    if (
        estatisticas.sessoes === 0
    ) {

        prazo =
            "Próximos 30 dias";

        frequencia =
            "Registrar pelo menos 2 sessões";

        fase =
            "Fase 1 — Construção da base";

        meta =
            "Começar seu histórico e identificar seu nível atual.";

        treino =
            "Foco em equilíbrio, mobilidade, remada e pop-up.";

    } else if (
        score < 40
    ) {

        prazo =
            "Próximas 4 semanas";

        frequencia =
            "2 sessões por semana";

        fase =
            "Fase 1 — Fundamentos";

        meta =
            "Ganhar confiança, equilíbrio e consistência.";

        treino =
            "Pop-up, postura, flexão dos joelhos, equilíbrio e remada.";

    } else if (
        score < 60
    ) {

        prazo =
            "Próximas 6 semanas";

        frequencia =
            "2 a 3 sessões por semana";

        fase =
            "Fase 2 — Consistência";

        meta =
            "Aumentar o número de ondas bem executadas.";

        treino =
            "Transferência de peso, linha da onda, velocidade e Bottom Turn.";

    } else if (
        score < 80
    ) {

        prazo =
            "Próximas 8 semanas";

        frequencia =
            "3 sessões por semana";

        fase =
            "Fase 3 — Técnica";

        meta =
            "Aumentar a qualidade das manobras e a consistência.";

        treino =
            "Bottom Turn, Cutback, geração de velocidade e transições.";

    } else {

        prazo =
            "Próximas 8 semanas";

        frequencia =
            "3 a 4 sessões por semana";

        fase =
            "Fase 4 — Performance";

        meta =
            "Refinar técnica, velocidade e combinação de manobras.";

        treino =
            "Velocidade, linhas críticas, rotação e conexão entre manobras.";
    }


    texto(
        elementos.planoObjetivo,
        objetivo
    );


    texto(
        elementos.planoPrazo,
        prazo
    );


    texto(
        elementos.planoFrequencia,
        frequencia
    );


    texto(
        elementos.planoFase,
        fase
    );


    texto(
        elementos.planoMeta,
        meta
    );


    texto(
        elementos.planoTreino,
        treino
    );


    const progresso =
        estatisticas.sessoes === 0
            ? 0
            : limitar(
                estatisticas.sessoes /
                12 *
                100
            );


    texto(
        elementos.planoProgresso,
        `${progresso}% concluído`
    );


    if (elementos.barraPlano) {

        elementos.barraPlano.style.width =
            `${progresso}%`;
    }
}


// ======================================================
// MISSÃO
// ======================================================

function gerarMissao(
    estatisticas,
    score
) {

    let missao;
    let descricao;
    let progresso = 0;


    if (
        estatisticas.sessoes === 0
    ) {

        missao =
            "Registrar sua primeira sessão";

        descricao =
            "Entre no mar e registre sua sessão no Diário.";

    } else if (
        estatisticas.ondas < 15
    ) {

        missao =
            "Surfar 15 ondas";

        descricao =
            "Concentre-se em pegar ondas com boa posição e equilíbrio.";

        progresso =
            limitar(
                estatisticas.ondas /
                15 *
                100
            );

    } else if (
        score < 60
    ) {

        missao =
            "Treinar fundamentos";

        descricao =
            "Faça uma sessão focando postura, joelhos e distribuição de peso.";

        progresso = 40;

    } else if (
        score < 80
    ) {

        missao =
            "Aprimorar o Bottom Turn";

        descricao =
            "Trabalhe compressão, transferência de peso e rotação do tronco.";

        progresso = 60;

    } else {

        missao =
            "Buscar mais velocidade";

        descricao =
            "Trabalhe linha, compressão e extensão para gerar velocidade.";

        progresso = 75;
    }


    texto(
        elementos.missao,
        missao
    );


    texto(
        elementos.descricaoMissao,
        descricao
    );


    if (elementos.barraMissao) {

        elementos.barraMissao.style.width =
            `${progresso}%`;
    }


    texto(
        elementos.progressoMissao,
        `${Math.round(progresso)}% concluído`
    );
}


// ======================================================
// TREINO
// ======================================================

function gerarTreino(
    estatisticas,
    score
) {

    let treino;


    if (
        estatisticas.sessoes === 0
    ) {

        treino =
            "Comece com equilíbrio, mobilidade, remada e pop-up.";

    } else if (
        score < 50
    ) {

        treino =
            "15 min de mobilidade + 20 pop-ups + exercícios de equilíbrio.";

    } else if (
        score < 70
    ) {

        treino =
            "Treine pop-up explosivo, equilíbrio e transferência de peso.";

    } else if (
        score < 85
    ) {

        treino =
            "Trabalhe Bottom Turn, geração de velocidade e transição entre compressão e extensão.";

    } else {

        treino =
            "Trabalhe velocidade, rotação do tronco e conexão entre manobras.";
    }


    texto(
        elementos.treino,
        treino
    );
}


// ======================================================
// PRÓXIMO OBJETIVO
// ======================================================

function gerarProximoObjetivo(
    estatisticas,
    score
) {

    let objetivo;


    if (
        estatisticas.sessoes < 3
    ) {

        objetivo =
            "Registrar 3 sessões de surf.";

    } else if (
        estatisticas.ondas < 50
    ) {

        objetivo =
            "Chegar a 50 ondas registradas.";

    } else if (
        score < 70
    ) {

        objetivo =
            "Aumentar sua consistência técnica.";

    } else if (
        score < 85
    ) {

        objetivo =
            "Aprimorar Bottom Turn e Cutback.";

    } else {

        objetivo =
            "Desenvolver manobras avançadas.";
    }


    texto(
        elementos.proximoObjetivo,
        `🎯 ${objetivo}`
    );
}


// ======================================================
// ESTATÍSTICAS
// ======================================================

function atualizarEstatisticas(
    estatisticas,
    xp,
    nivel
) {

    texto(
        elementos.nivel,
        nivel
    );


    texto(
        elementos.xp,
        xp
    );


    texto(
        elementos.ondas,
        estatisticas.ondas
    );


    const horas =
        estatisticas.tempoMinutos / 60;


    texto(
        elementos.tempo,
        `${horas.toFixed(1)}h`
    );
}


// ======================================================
// RELATÓRIO
// ======================================================

function gerarRelatorio(
    estatisticas,
    score,
    nivel,
    analises
) {

    if (
        estatisticas.sessoes === 0
    ) {

        if (elementos.relatorio) {

            elementos.relatorio.innerHTML = `

                <div class="relatorioResumo">

                    <p>
                        🏄 Registre sua primeira sessão
                        para desbloquear seu relatório.
                    </p>

                    <p>
                        📊 O WaveRise vai analisar seu
                        histórico conforme você evoluir.
                    </p>

                </div>

            `;
        }

        return;
    }


    const media =
        estatisticas.mediaNota > 0
            ? estatisticas.mediaNota.toFixed(1)
            : "--";


    let praiaPrincipal =
        "Nenhuma registrada";


    const praias =
        Object.entries(
            estatisticas.praias
        );


    if (
        praias.length > 0
    ) {

        praias.sort(
            (a, b) => b[1] - a[1]
        );

        praiaPrincipal =
            praias[0][0];
    }


    if (elementos.relatorio) {

        elementos.relatorio.innerHTML = `

            <div class="relatorioResumo">

                <p>
                    🏄 <strong>
                        ${estatisticas.sessoes}
                    </strong>
                    sessões registradas
                </p>

                <p>
                    🌊 <strong>
                        ${estatisticas.ondas}
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
    }
}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

function iniciarCoachPro() {

    console.log(
        "🚀 Carregando Coach IA Pro..."
    );


    try {

        const historico =
            carregarHistorico();


        const perfil =
            carregarPerfil();


        const analises =
            carregarAnalisesVisuais();


        const estatisticas =
            calcularEstatisticas(
                historico
            );


        const xp =
            calcularXP(
                estatisticas
            );


        const nivel =
            calcularNivel(
                xp
            );


        const score =
            calcularScore(
                estatisticas
            );


        console.log(
            "📊 Estatísticas:",
            estatisticas
        );


        console.log(
            "👤 Perfil:",
            perfil
        );


        console.log(
            "🤖 Análises:",
            analises
        );


        console.log(
            "🔥 Score:",
            score
        );


        atualizarScore(score);

        gerarDiagnostico(
            estatisticas,
            perfil,
            score,
            analises
        );

        gerarPontosFortes(
            estatisticas,
            score,
            analises
        );

        gerarMelhorias(
            estatisticas,
            score,
            analises
        );

        gerarDesempenho(
            estatisticas,
            score,
            analises
        );

        gerarPlanoEvolucao(
            estatisticas,
            perfil,
            score,
            nivel
        );

        gerarMissao(
            estatisticas,
            score
        );

        gerarTreino(
            estatisticas,
            score
        );

        gerarProximoObjetivo(
            estatisticas,
            score
        );

        atualizarEstatisticas(
            estatisticas,
            xp,
            nivel
        );

        gerarRelatorio(
            estatisticas,
            score,
            nivel,
            analises
        );


        console.log(
            "✅ Coach IA Pro carregado."
        );


    } catch (erro) {

        console.error(
            "❌ Erro no Coach IA Pro:",
            erro
        );


        if (elementos.diagnostico) {

            elementos.diagnostico.textContent =
                "Não foi possível carregar o diagnóstico. Verifique o console do navegador.";
        }

    }
}


// ======================================================
// INICIAR
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