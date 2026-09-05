/* =========================================
   WAVERISE — MELHOR HORÁRIO
========================================= */

console.log("⏰ WaveRise — Melhor Horário iniciado");


/* =========================================
   CONFIGURAÇÃO
========================================= */

const STORAGE_LOCAL =
    "localizacaoWaveRise";


let ultimaLocalizacao = null;


/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciarPagina
);


function iniciarPagina() {

    console.log(
        "🚀 Inicializando Melhor Horário..."
    );


    /* =====================================
       ELEMENTOS
    ====================================== */

    const btnLocalizacao =
        document.getElementById(
            "btnLocalizacao"
        );


    const btnAtualizar =
        document.getElementById(
            "btnAtualizar"
        );


    const localStatus =
        document.getElementById(
            "localStatus"
        );


    const coordenadas =
        document.getElementById(
            "coordenadas"
        );


    const melhorHorario =
        document.getElementById(
            "melhorHorario"
        );


    const melhorData =
        document.getElementById(
            "melhorData"
        );


    const notaMelhorHorario =
        document.getElementById(
            "notaMelhorHorario"
        );


    const descricaoMelhorHorario =
        document.getElementById(
            "descricaoMelhorHorario"
        );


    const ondas =
        document.getElementById(
            "ondas"
        );


    const vento =
        document.getElementById(
            "vento"
        );


    const temperatura =
        document.getElementById(
            "temperatura"
        );


    const tempo =
        document.getElementById(
            "tempo"
        );


    const listaHorarios =
        document.getElementById(
            "listaHorarios"
        );


    const coachMensagem =
        document.getElementById(
            "coachMensagem"
        );


    /* =====================================
       VERIFICAR ELEMENTOS
    ====================================== */

    if (!btnLocalizacao) {

        console.error(
            "❌ Elemento #btnLocalizacao não encontrado."
        );

        return;
    }


    if (!btnAtualizar) {

        console.error(
            "❌ Elemento #btnAtualizar não encontrado."
        );

        return;
    }


    console.log(
        "✅ Elementos da página encontrados."
    );


    /* =====================================
       UTILIDADES
    ====================================== */

    function numero(
        valor,
        fallback = 0
    ) {

        const n =
            Number(valor);

        return Number.isFinite(n)
            ? n
            : fallback;
    }


    function limitar(
        valor,
        minimo,
        maximo
    ) {

        return Math.max(
            minimo,
            Math.min(
                maximo,
                valor
            )
        );
    }


    function formatarHora(data) {

        return data.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    function formatarData(data) {

        return data.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "2-digit"
            }
        );
    }


    /* =====================================
       ATUALIZAR STATUS
    ====================================== */

    function atualizarStatus(
        mensagem
    ) {

        if (localStatus) {

            localStatus.textContent =
                mensagem;

        }

    }


    function atualizarCoordenadas(
        mensagem
    ) {

        if (coordenadas) {

            coordenadas.textContent =
                mensagem;

        }

    }


    /* =====================================
       GEOLOCALIZAÇÃO
    ====================================== */

    function obterLocalizacao() {

        console.log(
            "📍 Solicitando localização..."
        );


        if (
            !navigator.geolocation
        ) {

            atualizarStatus(
                "Seu dispositivo não suporta localização."
            );

            atualizarCoordenadas(
                "A geolocalização não está disponível."
            );

            return;
        }


        atualizarStatus(
            "Obtendo sua localização..."
        );


        atualizarCoordenadas(
            "Aguarde enquanto encontramos sua posição."
        );


        btnLocalizacao.disabled =
            true;


        btnAtualizar.disabled =
            true;


        btnLocalizacao.textContent =
            "📍 Localizando...";


        navigator.geolocation.getCurrentPosition(

            async (posicao) => {

                console.log(
                    "✅ Localização obtida:",
                    posicao
                );


                const latitude =
                    posicao.coords.latitude;


                const longitude =
                    posicao.coords.longitude;


                ultimaLocalizacao = {

                    latitude,

                    longitude

                };


                /* =========================
                   SALVAR LOCALIZAÇÃO
                ========================== */

                try {

                    localStorage.setItem(

                        STORAGE_LOCAL,

                        JSON.stringify(
                            ultimaLocalizacao
                        )

                    );

                } catch (erro) {

                    console.warn(
                        "⚠️ Não foi possível salvar localização.",
                        erro
                    );

                }


                /* =========================
                   MOSTRAR LOCALIZAÇÃO
                ========================== */

                atualizarStatus(
                    "📍 Localização encontrada"
                );


                atualizarCoordenadas(

                    `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`

                );


                btnLocalizacao.disabled =
                    false;


                btnAtualizar.disabled =
                    false;


                btnLocalizacao.textContent =
                    "📍 Atualizar localização";


                /* =========================
                   CARREGAR PREVISÃO
                ========================== */

                await carregarPrevisao(
                    latitude,
                    longitude
                );

            },


            (erro) => {

                console.error(
                    "❌ Erro de localização:",
                    erro
                );


                btnLocalizacao.disabled =
                    false;


                btnAtualizar.disabled =
                    false;


                btnLocalizacao.textContent =
                    "📍 Tentar novamente";


                /* =========================
                   ERROS ESPECÍFICOS
                ========================== */

                if (
                    erro.code ===
                    1
                ) {

                    atualizarStatus(
                        "📍 Permissão de localização negada."
                    );


                    atualizarCoordenadas(
                        "Ative a localização do WaveRise nas permissões do celular."
                    );


                    return;
                }


                if (
                    erro.code ===
                    2
                ) {

                    atualizarStatus(
                        "📍 Não foi possível encontrar sua localização."
                    );


                    atualizarCoordenadas(
                        "Verifique se o GPS/localização do celular está ativado."
                    );


                    return;
                }


                if (
                    erro.code ===
                    3
                ) {

                    atualizarStatus(
                        "📍 A localização demorou demais."
                    );


                    atualizarCoordenadas(
                        "Tente novamente em um local com melhor sinal de GPS."
                    );


                    return;
                }


                atualizarStatus(
                    "Não foi possível obter sua localização."
                );


                atualizarCoordenadas(
                    "Verifique as permissões e tente novamente."
                );

            },


            {

                enableHighAccuracy:
                    true,

                timeout:
                    30000,

                maximumAge:
                    0

            }

        );

    }


    /* =====================================
       LOCALIZAÇÃO SALVA
    ====================================== */

    function carregarLocalizacaoSalva() {

        try {

            const valor =
                localStorage.getItem(
                    STORAGE_LOCAL
                );


            if (!valor) {

                console.log(
                    "ℹ️ Nenhuma localização salva."
                );

                return false;
            }


            const salva =
                JSON.parse(valor);


            if (
                !salva ||
                !Number.isFinite(
                    Number(salva.latitude)
                ) ||
                !Number.isFinite(
                    Number(salva.longitude)
                )
            ) {

                console.warn(
                    "⚠️ Localização salva inválida."
                );

                return false;
            }


            ultimaLocalizacao = {

                latitude:
                    Number(
                        salva.latitude
                    ),

                longitude:
                    Number(
                        salva.longitude
                    )

            };


            atualizarStatus(
                "📍 Usando localização salva"
            );


            atualizarCoordenadas(

                `${ultimaLocalizacao.latitude.toFixed(5)}, ${ultimaLocalizacao.longitude.toFixed(5)}`

            );


            console.log(
                "📍 Localização salva:",
                ultimaLocalizacao
            );


            carregarPrevisao(

                ultimaLocalizacao.latitude,

                ultimaLocalizacao.longitude

            );


            return true;

        } catch (erro) {

            console.error(
                "❌ Erro ao carregar localização salva:",
                erro
            );

            return false;
        }

    }


    /* =====================================
       PREVISÃO MARÍTIMA
    ====================================== */

    async function carregarPrevisao(
        latitude,
        longitude
    ) {

        console.log(
            "🌊 Buscando previsão:",
            latitude,
            longitude
        );


        if (listaHorarios) {

            listaHorarios.innerHTML = `

                <div class="estadoInicial">

                    <span>🌊</span>

                    <p>
                        Analisando as condições do mar...
                    </p>

                </div>

            `;

        }


        if (coachMensagem) {

            coachMensagem.textContent =
                "Estou analisando as condições previstas para encontrar a melhor janela para sua sessão.";

        }


        try {

            /* =================================
               DATA LOCAL
            ================================= */

            const hoje =
                new Date();


            const inicio =
                formatarDataAPI(
                    hoje
                );


            const amanha =
                new Date(
                    hoje
                );


            amanha.setDate(
                amanha.getDate() + 1
            );


            const fim =
                formatarDataAPI(
                    amanha
                );


            /* =================================
               URL OPEN-METEO
            ================================= */

            const url =
                "https://marine-api.open-meteo.com/v1/marine" +

                `?latitude=${encodeURIComponent(latitude)}` +

                `&longitude=${encodeURIComponent(longitude)}` +

                `&hourly=wave_height,wave_direction,wave_period` +

                `&timezone=auto` +

                `&forecast_days=2`;


            console.log(
                "🌐 URL previsão:",
                url
            );


            const resposta =
                await fetch(
                    url
                );


            if (!resposta.ok) {

                throw new Error(
                    `Erro HTTP ${resposta.status}`
                );

            }


            const dados =
                await resposta.json();


            console.log(
                "🌊 Dados recebidos:",
                dados
            );


            if (
                !dados.hourly ||
                !Array.isArray(
                    dados.hourly.time
                )
            ) {

                throw new Error(
                    "Previsão marítima não disponível."
                );

            }


            const horarios =
                analisarHorarios(
                    dados
                );


            renderizarResultado(
                horarios
            );


        } catch (erro) {

            console.error(
                "❌ Erro previsão:",
                erro
            );


            if (listaHorarios) {

                listaHorarios.innerHTML = `

                    <div class="estadoInicial">

                        <span>⚠️</span>

                        <p>
                            Não conseguimos carregar
                            a previsão marítima agora.
                        </p>

                    </div>

                `;

            }


            if (coachMensagem) {

                coachMensagem.textContent =
                    "A previsão não pôde ser carregada. Verifique sua conexão e tente atualizar novamente.";

            }

        }

    }


    /* =====================================
       DATA PARA API
    ====================================== */

    function formatarDataAPI(
        data
    ) {

        const ano =
            data.getFullYear();


        const mes =
            String(
                data.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const dia =
            String(
                data.getDate()
            ).padStart(
                2,
                "0"
            );


        return `${ano}-${mes}-${dia}`;

    }


    /* =====================================
       ANÁLISE DOS HORÁRIOS
    ====================================== */

    function analisarHorarios(
        dados
    ) {

        const resultado = [];


        const tempos =
            dados.hourly.time || [];


        const alturas =
            dados.hourly.wave_height || [];


        const direcoes =
            dados.hourly.wave_direction || [];


        const periodos =
            dados.hourly.wave_period || [];


        for (
            let i = 0;
            i < tempos.length;
            i++
        ) {

            const data =
                new Date(
                    tempos[i]
                );


            if (
                Number.isNaN(
                    data.getTime()
                )
            ) {

                continue;
            }


            const hora =
                data.getHours();


            /* =============================
               SOMENTE HORÁRIO DE DIA
            ============================== */

            if (
                hora < 6 ||
                hora > 18
            ) {

                continue;

            }


            const altura =
                numero(
                    alturas[i],
                    0
                );


            const periodo =
                numero(
                    periodos[i],
                    0
                );


            const direcao =
                numero(
                    direcoes[i],
                    0
                );


            /* =============================
               SCORE DA ALTURA
            ============================== */

            let scoreAltura;


            if (
                altura >= 0.7 &&
                altura <= 1.8
            ) {

                scoreAltura =
                    35;

            } else if (
                altura >= 0.5 &&
                altura < 0.7
            ) {

                scoreAltura =
                    25;

            } else if (
                altura > 1.8 &&
                altura <= 2.5
            ) {

                scoreAltura =
                    27;

            } else if (
                altura > 2.5
            ) {

                scoreAltura =
                    18;

            } else {

                scoreAltura =
                    10;

            }


            /* =============================
               SCORE DO PERÍODO
            ============================== */

            let scorePeriodo;


            if (
                periodo >= 12
            ) {

                scorePeriodo =
                    30;

            } else if (
                periodo >= 10
            ) {

                scorePeriodo =
                    25;

            } else if (
                periodo >= 8
            ) {

                scorePeriodo =
                    20;

            } else if (
                periodo >= 6
            ) {

                scorePeriodo =
                    14;

            } else {

                scorePeriodo =
                    8;

            }


            /* =============================
               SCORE DO HORÁRIO
            ============================== */

            let scoreHorario;


            if (
                hora >= 6 &&
                hora <= 9
            ) {

                scoreHorario =
                    25;

            } else if (
                hora >= 15 &&
                hora <= 17
            ) {

                scoreHorario =
                    22;

            } else {

                scoreHorario =
                    16;

            }


            const score =
                limitar(

                    Math.round(

                        scoreAltura +
                        scorePeriodo +
                        scoreHorario

                    ),

                    0,
                    100

                );


            resultado.push({

                data,

                hora,

                altura,

                periodo,

                direcao,

                score

            });

        }


        resultado.sort(

            (a, b) =>
                b.score - a.score

        );


        return resultado.slice(
            0,
            12
        );

    }


    /* =====================================
       RENDERIZAR RESULTADO
    ====================================== */

    function renderizarResultado(
        horarios
    ) {

        if (
            !horarios.length
        ) {

            if (listaHorarios) {

                listaHorarios.innerHTML = `

                    <div class="estadoInicial">

                        <span>🌙</span>

                        <p>
                            Não encontramos horários
                            de luz do dia na previsão.
                        </p>

                    </div>

                `;

            }

            return;
        }


        const melhor =
            horarios[0];


        /* =================================
           MELHOR HORÁRIO
        ================================== */

        if (melhorHorario) {

            melhorHorario.textContent =
                formatarHora(
                    melhor.data
                );

        }


        if (melhorData) {

            melhorData.textContent =
                formatarData(
                    melhor.data
                );

        }


        if (notaMelhorHorario) {

            notaMelhorHorario.textContent =
                melhor.score;

        }


        if (descricaoMelhorHorario) {

            descricaoMelhorHorario.textContent =
                gerarDescricao(
                    melhor
                );

        }


        /* =================================
           CONDIÇÕES
        ================================== */

        if (ondas) {

            ondas.textContent =
                `${melhor.altura.toFixed(1)} m`;

        }


        /*
         * O endpoint marítimo usado aqui
         * não fornece vento.
         */

        if (vento) {

            vento.textContent =
                "--";

        }


        /*
         * Temperatura também não está sendo
         * solicitada nesse endpoint.
         */

        if (temperatura) {

            temperatura.textContent =
                "--";

        }


        if (tempo) {

            tempo.textContent =
                `${melhor.periodo.toFixed(0)} s`;

        }


        /* =================================
           LISTA DE HORÁRIOS
        ================================== */

        if (listaHorarios) {

            listaHorarios.innerHTML =

                horarios.map(

                    (
                        item,
                        index
                    ) => {

                        const destaque =
                            index === 0
                                ? "melhor"
                                : "";


                        const tag =
                            index === 0

                                ? `
                                    <span class="melhorTag">
                                        MELHOR
                                    </span>
                                  `

                                : "";


                        return `

                            <div
                                class="horarioItem ${destaque}"
                            >

                                <div class="hora">

                                    ${formatarHora(
                                        item.data
                                    )}

                                </div>


                                <div class="horaInfo">

                                    <strong>

                                        ${item.altura.toFixed(1)}
                                        m
                                        ·
                                        ${item.periodo.toFixed(0)}
                                        s

                                    </strong>


                                    <small>

                                        Qualidade estimada
                                        da janela

                                    </small>

                                </div>


                                <div class="horaNota">

                                    ${item.score}

                                    ${tag}

                                </div>

                            </div>

                        `;

                    }

                ).join("");

        }


        /* =================================
           COACH
        ================================== */

        if (coachMensagem) {

            coachMensagem.textContent =
                gerarMensagemCoach(
                    melhor
                );

        }


        console.log(
            "🏄 Melhor horário:",
            melhor
        );

    }


    /* =====================================
       DESCRIÇÃO
    ====================================== */

    function gerarDescricao(
        item
    ) {

        if (
            item.score >= 85
        ) {

            return "Excelente janela segundo os dados disponíveis.";

        }


        if (
            item.score >= 70
        ) {

            return "Boa janela para considerar uma sessão.";

        }


        if (
            item.score >= 55
        ) {

            return "Condição intermediária. Vale acompanhar.";

        }


        return "Condição mais fraca entre os horários analisados.";

    }


    /* =====================================
       MENSAGEM DO COACH
    ====================================== */

    function gerarMensagemCoach(
        item
    ) {

        const hora =
            formatarHora(
                item.data
            );


        if (
            item.score >= 85
        ) {

            return `
                O melhor horário encontrado é ${hora}.
                A previsão indica uma janela com boas
                características de onda e período.
                Confirme vento, maré e condições reais
                antes de entrar no mar.
            `;

        }


        if (
            item.score >= 70
        ) {

            return `
                Eu priorizaria ${hora}.
                A janela parece interessante, mas vale
                conferir vento, maré e condições reais
                da praia antes da sessão.
            `;

        }


        return `
            Entre os horários analisados, ${hora}
            apresenta a melhor pontuação.
            Como a qualidade não está muito alta,
            vale acompanhar a previsão e as condições
            reais antes de decidir.
        `;

    }


    /* =====================================
       BOTÃO LOCALIZAÇÃO
    ====================================== */

    btnLocalizacao.addEventListener(
        "click",
        () => {

            obterLocalizacao();

        }
    );


    /* =====================================
       BOTÃO ATUALIZAR
    ====================================== */

    btnAtualizar.addEventListener(
        "click",
        () => {

            console.log(
                "🔄 Atualizando previsão..."
            );


            if (
                ultimaLocalizacao
            ) {

                carregarPrevisao(

                    ultimaLocalizacao.latitude,

                    ultimaLocalizacao.longitude

                );

            } else {

                obterLocalizacao();

            }

        }
    );


    /* =====================================
       CARREGAR LOCALIZAÇÃO SALVA
    ====================================== */

    const possuiLocalizacao =
        carregarLocalizacaoSalva();


    if (!possuiLocalizacao) {

        atualizarStatus(
            "Localização ainda não definida."
        );


        atualizarCoordenadas(
            "Permita o acesso à localização para analisar o mar."
        );

    }


    console.log(
        "✅ Melhor Horário pronto."
    );

}