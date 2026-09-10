/* =========================================
   WAVERISE — ALERTAS PERSONALIZADOS
========================================= */

console.log("🔔 WaveRise — Alertas personalizados iniciado");


/* =========================================
   ELEMENTOS
========================================= */

const ativarAlertas =
    document.getElementById("ativarAlertas");

const nomePraia =
    document.getElementById("nomePraia");

const alturaMinima =
    document.getElementById("alturaMinima");

const periodoMinimo =
    document.getElementById("periodoMinimo");

const scoreMinimo =
    document.getElementById("scoreMinimo");

const scoreValor =
    document.getElementById("scoreValor");

const horaInicio =
    document.getElementById("horaInicio");

const horaFim =
    document.getElementById("horaFim");

const resumoAlerta =
    document.getElementById("resumoAlerta");

const salvarAlerta =
    document.getElementById("salvarAlerta");

const testarAlerta =
    document.getElementById("testarAlerta");

const statusTitulo =
    document.getElementById("statusTitulo");

const statusTexto =
    document.getElementById("statusTexto");


/* =========================================
   CONFIGURAÇÃO
========================================= */

const CHAVE =
    "alertaWaveRise";

const CHAVE_ULTIMO_ALERTA =
    "ultimoAlertaWaveRise";


const configuracaoPadrao = {

    ativo: false,

    praia: "",

    alturaMinima: 1.0,

    periodoMinimo: 10,

    scoreMinimo: 75,

    horaInicio: "05:00",

    horaFim: "18:00"

};


/* =========================================
   UTILIDADES
========================================= */

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


function escaparHTML(texto) {

    return String(texto)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


/* =========================================
   CARREGAR CONFIGURAÇÃO
========================================= */

function carregarConfiguracao() {

    try {

        const salva =
            JSON.parse(
                localStorage.getItem(CHAVE)
            );


        const configuracao = {

            ...configuracaoPadrao,

            ...(salva || {})

        };


        aplicarConfiguracao(
            configuracao
        );


    } catch (erro) {

        console.error(
            "❌ Erro ao carregar alerta:",
            erro
        );


        aplicarConfiguracao(
            configuracaoPadrao
        );
    }
}


/* =========================================
   APLICAR CONFIGURAÇÃO
========================================= */

function aplicarConfiguracao(
    configuracao
) {

    ativarAlertas.checked =
        Boolean(
            configuracao.ativo
        );


    nomePraia.value =
        configuracao.praia || "";


    alturaMinima.textContent =
        numero(
            configuracao.alturaMinima,
            1
        ).toFixed(1);


    periodoMinimo.textContent =
        Math.round(
            numero(
                configuracao.periodoMinimo,
                10
            )
        );


    scoreMinimo.value =
        limitar(
            numero(
                configuracao.scoreMinimo,
                75
            ),
            40,
            95
        );


    scoreValor.textContent =
        scoreMinimo.value;


    horaInicio.value =
        configuracao.horaInicio ||
        "05:00";


    horaFim.value =
        configuracao.horaFim ||
        "18:00";


    atualizarStatus();

    atualizarResumo();
}


/* =========================================
   OBTER CONFIGURAÇÃO
========================================= */

function obterConfiguracao() {

    return {

        ativo:
            ativarAlertas.checked,

        praia:
            nomePraia.value.trim(),

        alturaMinima:
            numero(
                alturaMinima.textContent,
                1
            ),

        periodoMinimo:
            numero(
                periodoMinimo.textContent,
                10
            ),

        scoreMinimo:
            numero(
                scoreMinimo.value,
                75
            ),

        horaInicio:
            horaInicio.value || "05:00",

        horaFim:
            horaFim.value || "18:00"

    };
}


/* =========================================
   SALVAR CONFIGURAÇÃO
========================================= */

function salvarConfiguracao() {

    const configuracao =
        obterConfiguracao();


    if (
        configuracao.ativo &&
        !configuracao.praia
    ) {

        alert(
            "Digite o nome da praia antes de ativar o alerta."
        );

        ativarAlertas.checked =
            false;

        atualizarStatus();

        atualizarResumo();

        return;
    }


    if (
        configuracao.horaInicio ===
        configuracao.horaFim
    ) {

        alert(
            "Escolha um intervalo de horário válido."
        );

        return;
    }


    localStorage.setItem(
        CHAVE,
        JSON.stringify(
            configuracao
        )
    );


    atualizarStatus();

    atualizarResumo();


    salvarAlerta.textContent =
        "✅ Alerta salvo";


    setTimeout(() => {

        salvarAlerta.textContent =
            "🔔 Salvar alerta";

    }, 1800);


    if (configuracao.ativo) {

        verificarAlerta();

    }
}


/* =========================================
   STATUS
========================================= */

function atualizarStatus() {

    if (
        ativarAlertas.checked
    ) {

        statusTitulo.textContent =
            "Alertas ativados";

        statusTexto.textContent =
            "O WaveRise está acompanhando as condições configuradas.";

    } else {

        statusTitulo.textContent =
            "Alertas desativados";

        statusTexto.textContent =
            "Ative para receber avisos quando as condições forem atingidas.";

    }
}


/* =========================================
   RESUMO
========================================= */

function atualizarResumo() {

    const configuracao =
        obterConfiguracao();


    const praia =
        configuracao.praia ||
        "praia escolhida";


    resumoAlerta.innerHTML = `

        Quero surfar em
        <strong>${escaparHTML(praia)}</strong>.

        <br>

        O WaveRise deve considerar:

        <br>

        🌊 ondas a partir de
        <strong>${configuracao.alturaMinima.toFixed(1)} m</strong>

        <br>

        ⏱️ período mínimo de
        <strong>${configuracao.periodoMinimo} s</strong>

        <br>

        ⭐ Score mínimo de
        <strong>${configuracao.scoreMinimo}/100</strong>

        <br>

        🕐 entre
        <strong>${escaparHTML(configuracao.horaInicio)}</strong>
        e
        <strong>${escaparHTML(configuracao.horaFim)}</strong>.

        <br><br>

        ${
            configuracao.ativo
                ? "🔔 <strong>Alerta ativo.</strong>"
                : "🔕 <strong>Alerta desativado.</strong>"
        }

    `;
}


/* =========================================
   CONTROLES + / -
========================================= */

document
    .querySelectorAll(
        "[data-target]"
    )
    .forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                const alvo =
                    botao.dataset.target;

                const alteracao =
                    numero(
                        botao.dataset.change
                    );


                const elemento =
                    document.getElementById(
                        alvo
                    );


                if (!elemento) {
                    return;
                }


                let valor =
                    numero(
                        elemento.textContent
                    );


                valor += alteracao;


                if (
                    alvo ===
                    "alturaMinima"
                ) {

                    valor =
                        limitar(
                            valor,
                            0.3,
                            3.0
                        );


                    elemento.textContent =
                        valor.toFixed(1);
                }


                if (
                    alvo ===
                    "periodoMinimo"
                ) {

                    valor =
                        limitar(
                            valor,
                            4,
                            20
                        );


                    elemento.textContent =
                        Math.round(valor);
                }


                atualizarResumo();

            }
        );

    });


/* =========================================
   SLIDER SCORE
========================================= */

scoreMinimo.addEventListener(
    "input",
    () => {

        scoreValor.textContent =
            scoreMinimo.value;

        atualizarResumo();

    }
);


/* =========================================
   CAMPOS
========================================= */

nomePraia.addEventListener(
    "input",
    atualizarResumo
);


horaInicio.addEventListener(
    "change",
    atualizarResumo
);


horaFim.addEventListener(
    "change",
    atualizarResumo
);


/* =========================================
   ATIVAR / DESATIVAR
========================================= */

ativarAlertas.addEventListener(
    "change",
    async () => {

        if (
            ativarAlertas.checked &&
            !nomePraia.value.trim()
        ) {

            alert(
                "Digite primeiro a praia que deseja acompanhar."
            );

            ativarAlertas.checked =
                false;

            atualizarStatus();

            atualizarResumo();

            return;
        }


        atualizarStatus();

        atualizarResumo();


        const configuracao =
            obterConfiguracao();


        localStorage.setItem(
            CHAVE,
            JSON.stringify(
                configuracao
            )
        );


        if (
            ativarAlertas.checked
        ) {

            const permitida =
                await solicitarPermissaoNotificacao();


            if (!permitida) {

                ativarAlertas.checked =
                    false;


                const desativada =
                    obterConfiguracao();


                localStorage.setItem(
                    CHAVE,
                    JSON.stringify(
                        desativada
                    )
                );


                atualizarStatus();

                atualizarResumo();

                return;
            }


            verificarAlerta();

        }

    }
);


/* =========================================
   PERMISSÃO
========================================= */

async function solicitarPermissaoNotificacao() {

    if (
        !("Notification" in window)
    ) {

        alert(
            "Este dispositivo não oferece suporte a notificações do navegador."
        );

        return false;
    }


    if (
        Notification.permission ===
        "granted"
    ) {

        return true;
    }


    if (
        Notification.permission ===
        "denied"
    ) {

        alert(
            "As notificações estão bloqueadas. Ative-as nas configurações do navegador ou aplicativo."
        );

        return false;
    }


    try {

        const permissao =
            await Notification.requestPermission();


        return (
            permissao ===
            "granted"
        );

    } catch (erro) {

        console.error(
            "❌ Erro ao solicitar notificação:",
            erro
        );

        return false;
    }
}


/* =========================================
   TESTAR NOTIFICAÇÃO
========================================= */

testarAlerta.addEventListener(
    "click",
    async () => {

        const permitida =
            await solicitarPermissaoNotificacao();


        if (!permitida) {

            alert(
                "Não foi possível enviar a notificação."
            );

            return;
        }


        enviarNotificacao(

            "🌊 WaveRise",

            "Teste realizado! As notificações estão funcionando."

        );

    }
);


/* =========================================
   ENVIAR NOTIFICAÇÃO
========================================= */

function enviarNotificacao(
    titulo,
    mensagem
) {

    if (
        !("Notification" in window)
    ) {

        return false;
    }


    if (
        Notification.permission !==
        "granted"
    ) {

        return false;
    }


    try {

        new Notification(

            titulo,

            {

                body: mensagem,

                icon:
                    "../assets/icon.png"

            }

        );


        return true;

    } catch (erro) {

        console.error(
            "❌ Erro ao criar notificação:",
            erro
        );

        return false;
    }
}


/* =========================================
   HORÁRIO PERMITIDO
========================================= */

function horarioPermitido() {

    const configuracao =
        obterConfiguracao();


    const atual =
        new Date();


    const minutosAtuais =
        atual.getHours() * 60 +
        atual.getMinutes();


    const inicio =
        converterHora(
            configuracao.horaInicio
        );


    const fim =
        converterHora(
            configuracao.horaFim
        );


    if (
        inicio <= fim
    ) {

        return (
            minutosAtuais >= inicio &&
            minutosAtuais <= fim
        );

    }


    return (
        minutosAtuais >= inicio ||
        minutosAtuais <= fim
    );
}


function converterHora(
    valor
) {

    if (!valor) {
        return 0;
    }


    const partes =
        valor.split(":");


    const horas =
        numero(
            partes[0]
        );


    const minutos =
        numero(
            partes[1]
        );


    return (
        horas * 60 +
        minutos
    );
}


/* =========================================
   GEOCODIFICAÇÃO
========================================= */

async function encontrarCoordenadas(
    nome
) {

    const url =
        "https://nominatim.openstreetmap.org/search" +

        `?q=${encodeURIComponent(nome + ", Brasil")}` +

        "&format=json" +

        "&limit=1";


    const resposta =
        await fetch(
            url
        );


    if (!resposta.ok) {

        throw new Error(
            "Não foi possível localizar a praia."
        );

    }


    const dados =
        await resposta.json();


    if (
        !Array.isArray(dados) ||
        !dados.length
    ) {

        throw new Error(
            `Não encontramos "${nome}". Verifique o nome da praia.`
        );

    }


    const latitude =
        Number(
            dados[0].lat
        );


    const longitude =
        Number(
            dados[0].lon
        );


    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {

        throw new Error(
            "A localização encontrada é inválida."
        );

    }


    return {

        latitude,

        longitude

    };
}


/* =========================================
   BUSCAR PREVISÃO
========================================= */

async function buscarPrevisao(
    latitude,
    longitude
) {

    const hoje =
        new Date();


    const amanha =
        new Date(
            hoje
        );


    amanha.setDate(
        amanha.getDate() + 1
    );


    const inicio =
        formatarDataAPI(
            hoje
        );


    const fim =
        formatarDataAPI(
            amanha
        );


    const url =
        "https://marine-api.open-meteo.com/v1/marine" +

        `?latitude=${encodeURIComponent(latitude)}` +

        `&longitude=${encodeURIComponent(longitude)}` +

        "&hourly=wave_height,wave_period,wave_direction" +

        "&timezone=auto" +

        `&start_date=${inicio}` +

        `&end_date=${fim}`;


    const resposta =
        await fetch(
            url
        );


    if (!resposta.ok) {

        throw new Error(
            `Erro ao consultar previsão marítima (${resposta.status}).`
        );

    }


    const dados =
        await resposta.json();


    if (
        !dados.hourly ||
        !Array.isArray(
            dados.hourly.time
        )
    ) {

        throw new Error(
            "A previsão marítima não está disponível."
        );

    }


    return dados;
}


/* =========================================
   FORMATAR DATA
========================================= */

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


/* =========================================
   CALCULAR SCORE
========================================= */

function calcularScore(
    altura,
    periodo
) {

    let scoreAltura;


    if (
        altura >= 0.7 &&
        altura <= 1.8
    ) {

        scoreAltura =
            55;

    } else if (
        altura >= 0.5 &&
        altura < 0.7
    ) {

        scoreAltura =
            42;

    } else if (
        altura > 1.8 &&
        altura <= 2.5
    ) {

        scoreAltura =
            45;

    } else if (
        altura > 2.5
    ) {

        scoreAltura =
            32;

    } else {

        scoreAltura =
            20;

    }


    let scorePeriodo;


    if (
        periodo >= 12
    ) {

        scorePeriodo =
            45;

    } else if (
        periodo >= 10
    ) {

        scorePeriodo =
            38;

    } else if (
        periodo >= 8
    ) {

        scorePeriodo =
            30;

    } else if (
        periodo >= 6
    ) {

        scorePeriodo =
            22;

    } else {

        scorePeriodo =
            12;

    }


    return limitar(

        Math.round(
            (scoreAltura + scorePeriodo) / 2
        ),

        0,
        100

    );
}


/* =========================================
   ANALISAR PREVISÃO
========================================= */

function analisarPrevisao(
    dados
) {

    if (
        !dados.hourly ||
        !Array.isArray(
            dados.hourly.time
        )
    ) {

        throw new Error(
            "Dados marítimos indisponíveis."
        );

    }


    const horarios = [];


    const tempos =
        dados.hourly.time || [];

    const alturas =
        dados.hourly.wave_height || [];

    const periodos =
        dados.hourly.wave_period || [];

    const direcoes =
        dados.hourly.wave_direction || [];


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


        if (
            hora < 5 ||
            hora > 18
        ) {

            continue;
        }


        const altura =
            numero(
                alturas[i]
            );


        const periodo =
            numero(
                periodos[i]
            );


        const direcao =
            numero(
                direcoes[i]
            );


        const score =
            calcularScore(
                altura,
                periodo
            );


        horarios.push({

            data,

            altura,

            periodo,

            direcao,

            score

        });

    }


    horarios.sort(

        (a, b) =>
            b.score - a.score

    );


    return horarios;
}


/* =========================================
   VERIFICAR ALERTA
========================================= */

async function verificarAlerta() {

    const configuracao =
        obterConfiguracao();


    if (
        !configuracao.ativo
    ) {

        console.log(
            "🔕 Alertas desativados."
        );

        return;

    }


    if (
        !configuracao.praia
    ) {

        console.log(
            "📍 Nenhuma praia configurada."
        );

        return;

    }


    if (
        !horarioPermitido()
    ) {

        console.log(
            "🕐 Fora do horário configurado."
        );

        return;

    }


    try {

        console.log(
            `🌊 Verificando condições para ${configuracao.praia}...`
        );


        const coordenadas =
            await encontrarCoordenadas(
                configuracao.praia
            );


        const previsao =
            await buscarPrevisao(

                coordenadas.latitude,

                coordenadas.longitude

            );


        const horarios =
            analisarPrevisao(
                previsao
            );


        const horarioIdeal =
            horarios.find(

                item =>

                    item.altura >=
                    configuracao.alturaMinima &&

                    item.periodo >=
                    configuracao.periodoMinimo &&

                    item.score >=
                    configuracao.scoreMinimo

            );


        if (!horarioIdeal) {

            console.log(
                "🌊 Nenhum horário atende aos critérios."
            );

            return;

        }


        const identificador =
            criarIdentificadorAlerta(
                horarioIdeal,
                configuracao
            );


        const ultimoAlerta =
            localStorage.getItem(
                CHAVE_ULTIMO_ALERTA
            );


        if (
            ultimoAlerta ===
            identificador
        ) {

            console.log(
                "🔕 Esse alerta já foi enviado."
            );

            return;

        }


        const mensagem =

            `${configuracao.praia}: ` +

            `${horarioIdeal.altura.toFixed(1)} m de onda, ` +

            `${horarioIdeal.periodo.toFixed(0)} s de período ` +

            `e Score ${horarioIdeal.score}/100. ` +

            `Melhor janela por volta de ` +

            `${formatarHora(horarioIdeal.data)}.`;


        const enviada =
            enviarNotificacao(

                "🌊 Boa hora para surfar!",

                mensagem

            );


        if (enviada) {

            localStorage.setItem(

                CHAVE_ULTIMO_ALERTA,

                identificador

            );


            console.log(
                "🔔 Alerta enviado:",
                mensagem
            );

        }

    } catch (erro) {

        console.error(
            "❌ Erro ao verificar alerta:",
            erro
        );

    }

}


/* =========================================
   IDENTIFICADOR DO ALERTA
========================================= */

function criarIdentificadorAlerta(
    horario,
    configuracao
) {

    const data =
        horario.data
            .toISOString()
            .slice(
                0,
                13
            );


    return [

        configuracao.praia
            .toLowerCase(),

        data,

        horario.altura.toFixed(1),

        horario.periodo.toFixed(0),

        horario.score

    ].join("|");

}


/* =========================================
   FORMATAR HORA
========================================= */

function formatarHora(
    data
) {

    return data.toLocaleTimeString(

        "pt-BR",

        {

            hour: "2-digit",

            minute: "2-digit"

        }

    );

}


/* =========================================
   SALVAR BOTÃO
========================================= */

salvarAlerta.addEventListener(
    "click",
    salvarConfiguracao
);


/* =========================================
   INICIALIZAÇÃO
========================================= */

carregarConfiguracao();


/* =========================================
   VERIFICAÇÃO AUTOMÁTICA
========================================= */

/*
 * Faz uma verificação inicial.
 */

verificarAlerta();


/*
 * Depois verifica a cada 15 minutos.
 */

setInterval(

    verificarAlerta,

    15 * 60 * 1000

);


console.log(
    "✅ Alertas personalizados prontos."
);