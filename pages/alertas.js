/* =========================================
   WAVERISE — ALERTAS PERSONALIZADOS
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


const CHAVE =
    "alertaWaveRise";


/* =========================================
   CONFIGURAÇÃO PADRÃO
========================================= */

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
   CARREGAR CONFIGURAÇÃO
========================================= */

function carregarConfiguracao() {

    try {

        const salva =
            JSON.parse(
                localStorage.getItem(CHAVE)
            );


        if (!salva) {

            aplicarConfiguracao(
                configuracaoPadrao
            );

            return;
        }


        const configuracao = {

            ...configuracaoPadrao,

            ...salva

        };


        aplicarConfiguracao(
            configuracao
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar alerta:",
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
        Number(
            configuracao.alturaMinima
        ).toFixed(1);


    periodoMinimo.textContent =
        Number(
            configuracao.periodoMinimo
        );


    scoreMinimo.value =
        Number(
            configuracao.scoreMinimo
        );


    scoreValor.textContent =
        Number(
            configuracao.scoreMinimo
        );


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
   PEGAR CONFIGURAÇÃO ATUAL
========================================= */

function obterConfiguracao() {

    return {

        ativo:
            ativarAlertas.checked,

        praia:
            nomePraia.value.trim(),

        alturaMinima:
            Number(
                alturaMinima.textContent
            ),

        periodoMinimo:
            Number(
                periodoMinimo.textContent
            ),

        scoreMinimo:
            Number(
                scoreMinimo.value
            ),

        horaInicio:
            horaInicio.value,

        horaFim:
            horaFim.value

    };
}


/* =========================================
   SALVAR
========================================= */

function salvarConfiguracao() {

    const configuracao =
        obterConfiguracao();


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
            "O WaveRise está pronto para usar suas preferências.";

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

    const praia =
        nomePraia.value.trim();


    const altura =
        Number(
            alturaMinima.textContent
        );


    const periodo =
        Number(
            periodoMinimo.textContent
        );


    const score =
        Number(
            scoreMinimo.value
        );


    const inicio =
        horaInicio.value ||
        "05:00";


    const fim =
        horaFim.value ||
        "18:00";


    const nomeExibicao =
        praia ||
        "praia escolhida";


    resumoAlerta.innerHTML = `

        Quero surfar em
        <strong>${escaparHTML(nomeExibicao)}</strong>.

        <br>

        O WaveRise deve considerar:

        <br>

        🌊 ondas a partir de
        <strong>${altura.toFixed(1)} m</strong>

        <br>

        ⏱️ período mínimo de
        <strong>${periodo} s</strong>

        <br>

        ⭐ Score mínimo de
        <strong>${score}/100</strong>

        <br>

        🕐 entre
        <strong>${inicio}</strong>
        e
        <strong>${fim}</strong>.

    `;
}


/* =========================================
   ESCAPAR HTML
========================================= */

function escaparHTML(texto) {

    return String(texto)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
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
                    Number(
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
                    Number(
                        elemento.textContent
                    );


                valor += alteracao;


                if (
                    alvo ===
                    "alturaMinima"
                ) {

                    valor =
                        Math.max(
                            0.3,
                            Math.min(
                                3.0,
                                valor
                            )
                        );


                    elemento.textContent =
                        valor.toFixed(1);
                }


                if (
                    alvo ===
                    "periodoMinimo"
                ) {

                    valor =
                        Math.max(
                            4,
                            Math.min(
                                20,
                                valor
                            )
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

        atualizarStatus();

        atualizarResumo();


        if (
            ativarAlertas.checked
        ) {

            await solicitarPermissaoNotificacao();

        }

    }
);


/* =========================================
   PERMISSÃO DE NOTIFICAÇÃO
========================================= */

async function solicitarPermissaoNotificacao() {

    if (
        !("Notification" in window)
    ) {

        console.warn(
            "Notificações não suportadas."
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
            "As notificações estão bloqueadas. Ative-as nas configurações do navegador ou do aplicativo."
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
            "Erro ao solicitar notificação:",
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
                "Não foi possível enviar a notificação. Verifique a permissão de notificações."
            );

            return;
        }


        enviarNotificacao(
            "🌊 WaveRise",
            "Teste realizado! Seus alertas estão configurados."
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
        return;
    }


    if (
        Notification.permission !==
        "granted"
    ) {
        return;
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

    } catch (erro) {

        console.error(
            "Erro ao criar notificação:",
            erro
        );
    }
}


/* =========================================
   VERIFICAR HORÁRIO
========================================= */

function horarioPermitido() {

    const configuracao =
        obterConfiguracao();


    const agora =
        new Date();


    const atual =
        agora.getHours() * 60 +
        agora.getMinutes();


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
            atual >= inicio &&
            atual <= fim
        );
    }


    /*
     * Permite intervalos que passam
     * pela meia-noite.
     */

    return (
        atual >= inicio ||
        atual <= fim
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
        Number(partes[0]) || 0;


    const minutos =
        Number(partes[1]) || 0;


    return (
        horas * 60 +
        minutos
    );
}


/* =========================================
   VERIFICAR CONFIGURAÇÃO
========================================= */

function verificarAlerta() {

    const configuracao =
        obterConfiguracao();


    if (!configuracao.ativo) {
        return;
    }


    if (!configuracao.praia) {
        return;
    }


    if (!horarioPermitido()) {
        return;
    }


    /*
     * Esta função fica preparada para
     * receber futuramente a previsão
     * real do Mar Premium.
     *
     * Não criamos condições falsas.
     */

}


/* =========================================
   INICIALIZAÇÃO
========================================= */

carregarConfiguracao();


/*
 * Verificação periódica local.
 *
 * A checagem real das condições marítimas
 * será conectada ao sistema de previsão
 * posteriormente.
 */

setInterval(
    verificarAlerta,
    15 * 60 * 1000
);