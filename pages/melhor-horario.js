/* =========================================
   WAVERISE — MELHOR HORÁRIO
========================================= */

console.log("⏰ WaveRise — Melhor Horário iniciado");

const STORAGE_LOCAL = "localizacaoWaveRise";

let ultimaLocalizacao = null;


/* =========================================
   PRAIAS
========================================= */

const PRAIAS = {

    santos: {
        nome: "Santos — SP",
        latitude: -23.9675,
        longitude: -46.3289
    },

    "sao-vicente": {
        nome: "São Vicente — SP",
        latitude: -23.9631,
        longitude: -46.3919
    },

    guaruja: {
        nome: "Guarujá — SP",
        latitude: -23.9931,
        longitude: -46.2564
    },

    "praia-grande": {
        nome: "Praia Grande — SP",
        latitude: -24.0084,
        longitude: -46.4125
    },

    maresias: {
        nome: "Maresias — SP",
        latitude: -23.7953,
        longitude: -45.5545
    },

    juquehy: {
        nome: "Juquehy — SP",
        latitude: -23.7667,
        longitude: -45.7167
    },

    ubatuba: {
        nome: "Ubatuba — SP",
        latitude: -23.4339,
        longitude: -45.0711
    },

    itamanbuca: {
        nome: "Itamambuca — Ubatuba, SP",
        latitude: -23.4000,
        longitude: -45.0130
    },

    saquarema: {
        nome: "Saquarema — RJ",
        latitude: -22.9306,
        longitude: -42.5042
    },

    itauna: {
        nome: "Itaúna — Saquarema, RJ",
        latitude: -22.9357,
        longitude: -42.4867
    }

};


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


    const btnPraia =
        document.getElementById(
            "btnPraia"
        );


    const praiaSelecionada =
        document.getElementById(
            "praiaSelecionada"
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

    if (
        !btnLocalizacao ||
        !btnAtualizar ||
        !btnPraia ||
        !praiaSelecionada
    ) {

        console.error(
            "❌ Elementos principais não encontrados."
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
       STATUS
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
       APLICAR LOCALIZAÇÃO
    ====================================== */

    function aplicarLocalizacao(
        latitude,
        longitude,
        nomeLocal,
        origem = "praia"
    ) {

        ultimaLocalizacao = {

            latitude:
                Number(latitude),

            longitude:
                Number(longitude),

            nome:
                nomeLocal,

            origem

        };


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


        atualizarStatus(
            `📍 ${nomeLocal}`
        );


        atualizarCoordenadas(

            `${Number(latitude).toFixed(5)}, ${Number(longitude).toFixed(5)}`

        );


        btnAtualizar.disabled =
            false;


        btnLocalizacao.disabled =
            false;


        btnLocalizacao.textContent =
            "📍 Atualizar localização";


        carregarPrevisao(
            Number(latitude),
            Number(longitude)
        );

    }


    /* =====================================
       LOCALIZAÇÃO GPS
    ====================================== */

    function obterLocalizacao() {

        console.log(
            "📍 Solicitando localização..."
        );


        if (
            !navigator.geolocation
        ) {

            atualizarStatus(
                "Localização indisponível neste dispositivo."
            );


            atualizarCoordenadas(
                "Escolha uma praia abaixo para continuar."
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

            (posicao) => {

                const latitude =
                    posicao.coords.latitude;


                const longitude =
                    posicao.coords.longitude;


                aplicarLocalizacao(

                    latitude,

                    longitude,

                    "Localização atual",

                    "gps"

                );

            },


            (erro) => {

                console.warn(
                    "📍 Localização não disponível:",
                    erro
                );


                btnLocalizacao.disabled =
                    false;


                btnAtualizar.disabled =
                    false;


                btnLocalizacao.textContent =
                    "📍 Tentar novamente";


                atualizarStatus(
                    "📍 Não foi possível usar sua localização."
                );


                atualizarCoordenadas(
                    "Escolha uma praia abaixo para analisar as condições."
                );


                if (
                    erro.code === 1
                ) {

                    atualizarStatus(
                        "📍 Permissão de localização negada."
                    );

                }

                else if (
                    erro.code === 2
                ) {

                    atualizarStatus(
                        "📍 Não foi possível encontrar sua localização."
                    );

                }

                else if (
                    erro.code === 3
                ) {

                    atualizarStatus(
                        "📍 A localização demorou demais."
                    );

                }

            },


            {

                enableHighAccuracy:
                    true,

                timeout:
                    15000,

                maximumAge:
                    300000

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

                return false;

            }


            const salva =
                JSON.parse(valor);


            if (
                !salva ||
                !Number.isFinite(
                    Number(
                        salva.latitude
                    )
                ) ||
                !Number.isFinite(
                    Number(
                        salva.longitude
                    )
                )
            ) {

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
                    ),

                nome:
                    salva.nome ||
                    "Localização salva",

                origem:
                    salva.origem ||
                    "salva"

            };


            atualizarStatus(

                `📍 ${ultimaLocalizacao.nome}`

            );


            atualizarCoordenadas(

                `${ultimaLocalizacao.latitude.toFixed(5)}, ${ultimaLocalizacao.longitude.toFixed(5)}`

            );


            carregarPrevisao(

                ultimaLocalizacao.latitude,

                ultimaLocalizacao.longitude

            );


            return true;

        }

        catch (erro) {

            console.error(
                "❌ Erro ao carregar localização salva:",
                erro
            );


            return false;

        }

    }


    /* =====================================
       CARREGAR PREVISÃO
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

                    <span>
                        🌊
                    </span>

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
               API MARÍTIMA
            ================================= */

            const urlMar =
                "https://marine-api.open-meteo.com/v1/marine" +

                `?latitude=${encodeURIComponent(latitude)}` +

                `&longitude=${encodeURIComponent(longitude)}` +

                "&hourly=wave_height,wave_direction,wave_period" +

                "&timezone=auto" +

                "&forecast_days=2";


            /* =================================
               API METEOROLÓGICA
            ================================= */

            const urlTempo =
                "https://api.open-meteo.com/v1/forecast" +

                `?latitude=${encodeURIComponent(latitude)}` +

                `&longitude=${encodeURIComponent(longitude)}` +

                "&hourly=temperature_2m,wind_speed_10m,wind_direction_10m" +

                "&timezone=auto" +

                "&forecast_days=2";


            console.log(
                "🌐 Buscando mar e tempo..."
            );


            const [
                respostaMar,
                respostaTempo
            ] = await Promise.all([

                fetch(
                    urlMar
                ),

                fetch(
                    urlTempo
                )

            ]);


            if (
                !respostaMar.ok
            ) {

                throw new Error(
                    `Erro no serviço marítimo: HTTP ${respostaMar.status}`
                );

            }


            if (
                !respostaTempo.ok
            ) {

                throw new Error(
                    `Erro no serviço meteorológico: HTTP ${respostaTempo.status}`
                );

            }


            const [
                dados,
                tempoDados
            ] = await Promise.all([

                respostaMar.json(),

                respostaTempo.json()

            ]);


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


            if (
                !tempoDados.hourly ||
                !Array.isArray(
                    tempoDados.hourly.time
                )
            ) {

                throw new Error(
                    "Previsão meteorológica não disponível."
                );

            }


            const horarios =
                analisarHorarios(

                    dados,

                    tempoDados

                );


            renderizarResultado(
                horarios
            );


        }

        catch (erro) {

            console.error(
                "❌ Erro previsão:",
                erro
            );


            if (listaHorarios) {

                listaHorarios.innerHTML = `

                    <div class="estadoInicial">

                        <span>
                            ⚠️
                        </span>

                        <p>
                            Não conseguimos carregar
                            a previsão agora.
                            Tente atualizar novamente.
                        </p>

                    </div>

                `;

            }


            if (coachMensagem) {

                coachMensagem.textContent =
                    "Não consegui carregar os dados agora. Tente atualizar a previsão novamente.";

            }

        }

    }


    /* =====================================
       ANALISAR HORÁRIOS
    ====================================== */

    function analisarHorarios(
        dados,
        tempoDados
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


        const temposTempo =
            tempoDados.hourly.time || [];


        const temperaturas =
            tempoDados.hourly.temperature_2m || [];


        const ventos =
            tempoDados.hourly.wind_speed_10m || [];


        const direcoesVento =
            tempoDados.hourly.wind_direction_10m || [];


        const indiceTempo =
            new Map(

                temposTempo.map(

                    (
                        hora,
                        indice
                    ) => [

                        hora,
                        indice

                    ]

                )

            );


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


            /* SOMENTE HORÁRIO DE DIA */

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


            const indiceMeteorologia =
                indiceTempo.get(
                    tempos[i]
                );


            const temperatura =
                indiceMeteorologia !== undefined

                    ? Number(
                        temperaturas[
                            indiceMeteorologia
                        ]
                    )

                    : null;


            const velocidadeVento =
                indiceMeteorologia !== undefined

                    ? Number(
                        ventos[
                            indiceMeteorologia
                        ]
                    )

                    : null;


            const direcaoVento =
                indiceMeteorologia !== undefined

                    ? Number(
                        direcoesVento[
                            indiceMeteorologia
                        ]
                    )

                    : null;


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

            }

            else if (
                altura >= 0.5 &&
                altura < 0.7
            ) {

                scoreAltura =
                    25;

            }

            else if (
                altura > 1.8 &&
                altura <= 2.5
            ) {

                scoreAltura =
                    27;

            }

            else if (
                altura > 2.5
            ) {

                scoreAltura =
                    18;

            }

            else {

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

            }

            else if (
                periodo >= 10
            ) {

                scorePeriodo =
                    25;

            }

            else if (
                periodo >= 8
            ) {

                scorePeriodo =
                    20;

            }

            else if (
                periodo >= 6
            ) {

                scorePeriodo =
                    14;

            }

            else {

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

            }

            else if (
                hora >= 15 &&
                hora <= 17
            ) {

                scoreHorario =
                    22;

            }

            else {

                scoreHorario =
                    16;

            }


            /* =============================
               SCORE DO VENTO
            ============================== */

            let scoreVento =
                10;


            if (
                Number.isFinite(
                    velocidadeVento
                )
            ) {

                if (
                    velocidadeVento <= 10
                ) {

                    scoreVento =
                        10;

                }

                else if (
                    velocidadeVento <= 18
                ) {

                    scoreVento =
                        7;

                }

                else if (
                    velocidadeVento <= 25
                ) {

                    scoreVento =
                        4;

                }

                else {

                    scoreVento =
                        1;

                }

            }


            /* =============================
               SCORE FINAL
            ============================== */

            const score =
                limitar(

                    Math.round(

                        scoreAltura +
                        scorePeriodo +
                        scoreHorario +
                        scoreVento

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

                temperatura:
                    Number.isFinite(
                        temperatura
                    )
                        ? temperatura
                        : null,

                vento:
                    Number.isFinite(
                        velocidadeVento
                    )
                        ? velocidadeVento
                        : null,

                direcaoVento:
                    Number.isFinite(
                        direcaoVento
                    )
                        ? direcaoVento
                        : null,

                score

            });

        }


        resultado.sort(

            (a, b) => {

                if (
                    b.score !== a.score
                ) {

                    return (
                        b.score -
                        a.score
                    );

                }


                return (
                    a.data.getTime() -
                    b.data.getTime()
                );

            }

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

                        <span>
                            🌙
                        </span>

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
        ================================= */

        if (
            melhorHorario
        ) {

            melhorHorario.textContent =
                formatarHora(
                    melhor.data
                );

        }


        if (
            melhorData
        ) {

            melhorData.textContent =
                formatarData(
                    melhor.data
                );

        }


        if (
            notaMelhorHorario
        ) {

            notaMelhorHorario.textContent =
                melhor.score;

        }


        if (
            descricaoMelhorHorario
        ) {

            descricaoMelhorHorario.textContent =
                gerarDescricao(
                    melhor
                );

        }


        /* =================================
           CONDIÇÕES
        ================================= */

        if (
            ondas
        ) {

            ondas.textContent =
                `${melhor.altura.toFixed(1)} m`;

        }


        if (
            vento
        ) {

            vento.textContent =

                Number.isFinite(
                    melhor.vento
                )

                    ? `${Math.round(melhor.vento)} km/h`

                    : "--";

        }


        if (
            temperatura
        ) {

            temperatura.textContent =

                Number.isFinite(
                    melhor.temperatura
                )

                    ? `${Math.round(melhor.temperatura)}°C`

                    : "--";

        }


        if (
            tempo
        ) {

            tempo.textContent =
                `${melhor.periodo.toFixed(0)} s`;

        }


        /* =================================
           LISTA DE HORÁRIOS
        ================================= */

        if (
            listaHorarios
        ) {

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
                                        ·
                                        ${
                                            Number.isFinite(
                                                item.vento
                                            )

                                                ? Math.round(
                                                    item.vento
                                                ) + " km/h"

                                                : "--"
                                        }

                                    </strong>


                                    <small>

                                        Onda · período · vento

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
        ================================= */

        if (
            coachMensagem
        ) {

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

            return (
                "Excelente janela segundo os dados disponíveis."
            );

        }


        if (
            item.score >= 70
        ) {

            return (
                "Boa janela para considerar uma sessão."
            );

        }


        if (
            item.score >= 55
        ) {

            return (
                "Condição intermediária. Vale acompanhar."
            );

        }


        return (
            "Condição mais fraca entre os horários analisados."
        );

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
                A previsão combina uma boa janela
                de ondas e período, com vento favorável.
                Confirme as condições reais da praia
                antes de entrar no mar.

            `;

        }


        if (
            item.score >= 70
        ) {

            return `

                Eu priorizaria ${hora}.
                A janela parece interessante pelos
                dados disponíveis, mas vale conferir
                vento, maré e condições reais da praia
                antes da sessão.

            `;

        }


        return `

            Entre os horários analisados,
            ${hora} apresenta a melhor pontuação.
            A qualidade não está muito alta,
            então acompanhe a previsão e as condições
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
       BOTÃO PRAIA
    ====================================== */

    btnPraia.addEventListener(

        "click",

        () => {

            const chave =
                praiaSelecionada.value;


            const praia =
                PRAIAS[chave];


            if (!praia) {

                alert(
                    "Escolha uma praia para continuar."
                );

                return;

            }


            aplicarLocalizacao(

                praia.latitude,

                praia.longitude,

                praia.nome,

                "praia"

            );

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

            }

            else {

                const chave =
                    praiaSelecionada.value;


                const praia =
                    PRAIAS[chave];


                if (praia) {

                    aplicarLocalizacao(

                        praia.latitude,

                        praia.longitude,

                        praia.nome,

                        "praia"

                    );

                }

                else {

                    obterLocalizacao();

                }

            }

        }

    );


    /* =====================================
       LOCALIZAÇÃO SALVA
    ====================================== */

    const possuiLocalizacao =
        carregarLocalizacaoSalva();


    if (
        !possuiLocalizacao
    ) {

        atualizarStatus(
            "Escolha uma praia ou use sua localização."
        );


        atualizarCoordenadas(
            "Você pode continuar sem liberar o GPS."
        );

    }


    console.log(
        "✅ Melhor Horário pronto."
    );

}