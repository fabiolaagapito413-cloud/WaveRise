// ======================================================
// WaveRise 5.0
// Mar PRO
// ======================================================

import {
    buscarCondicoes,
    buscarMare,
    atualizarTela
} from "./stormglass.js";

import {
    buscarPrevisao,
    buscarSol
} from "./previsao.js";

import {
    calcularLua
} from "./lua.js";

import {
    atualizarCoach,
    atualizarNota
} from "./coach.js";

import {
    atualizarTimeline
} from "./timeline.js";


// ======================================================
// VARIÁVEIS
// ======================================================

let latitudeAtual = 0;
let longitudeAtual = 0;

let praiaAtual = "";


// ======================================================
// INICIAR
// ======================================================

window.addEventListener(
    "DOMContentLoaded",
    iniciar
);


async function iniciar() {

    restaurarDadosMar();

    configurarEventos();

    console.log(
        "⭐ WaveRise Mar PRO iniciado."
    );

    // --------------------------------------------------
    // Se já temos coordenadas, carrega imediatamente
    // --------------------------------------------------

    if (
        coordenadasValidas()
    ) {

        await carregarDadosPRO();

        return;

    }


    // --------------------------------------------------
    // Se não temos coordenadas, tenta localizar a praia
    // pelo nome salvo
    // --------------------------------------------------

    if (praiaAtual) {

        try {

            await localizarPraiaPorNome();

            await carregarDadosPRO();

        }

        catch (erro) {

            console.warn(
                "⚠️ Não foi possível localizar a praia automaticamente:",
                erro
            );

        }

    }

}


// ======================================================
// EVENTOS
// ======================================================

function configurarEventos() {

    const botaoCoach =
        document.getElementById(
            "analisarCoach"
        );

    if (botaoCoach) {

        botaoCoach.addEventListener(
            "click",
            analisarCoach
        );

    }

}


// ======================================================
// RESTAURAR DADOS DO MAR
// ======================================================

function restaurarDadosMar() {

    const salvo =
        localStorage.getItem(
            "marHojeWaveRise"
        );

    if (!salvo) {

        console.log(
            "ℹ️ Nenhum dado anterior do mar encontrado."
        );

        // Mesmo sem dados do Mar, tenta usar
        // a última praia salva.

        praiaAtual =
            localStorage.getItem(
                "ultimaPraia"
            ) || "";

        return;

    }


    try {

        const dados =
            JSON.parse(
                salvo
            );


        // --------------------------------------------------
        // PRAIA
        // --------------------------------------------------

        if (dados.praia) {

            praiaAtual =
                dados.praia;

        }


        // --------------------------------------------------
        // COORDENADAS
        // --------------------------------------------------

        if (
            Number.isFinite(
                Number(dados.latitude)
            )
        ) {

            latitudeAtual =
                Number(dados.latitude);

        }

        if (
            Number.isFinite(
                Number(dados.longitude)
            )
        ) {

            longitudeAtual =
                Number(dados.longitude);

        }


        // --------------------------------------------------
        // PREENCHER DADOS SALVOS
        // --------------------------------------------------

        preencherDadosSalvos(
            dados
        );


        console.log(
            "📦 Dados anteriores do mar restaurados."
        );

    }

    catch (erro) {

        console.error(
            "❌ Erro ao restaurar dados do mar:",
            erro
        );

    }

}


// ======================================================
// PREENCHER DADOS SALVOS
// ======================================================

function preencherDadosSalvos(
    dados
) {

    atualizarTexto(
        "heroPraia",
        dados.praia || "--"
    );


    atualizarTexto(
        "heroCondicao",
        dados.condicao || "--"
    );


    atualizarTexto(
        "heroNota",
        dados.score ?? "--"
    );


    atualizarTexto(
        "heroOnda",
        formatarNumero(
            dados.onda,
            " m"
        )
    );


    atualizarTexto(
        "heroVento",
        formatarVento(
            dados.vento
        )
    );


    atualizarTexto(
        "heroAgua",
        formatarNumero(
            dados.agua,
            " °C"
        )
    );


    atualizarTexto(
        "heroPrancha",
        dados.prancha || "--"
    );


    atualizarTexto(
        "heroHorario",
        dados.horario || "--"
    );


    atualizarTexto(
        "notaGrande",
        dados.score ?? "--"
    );


    atualizarTexto(
        "condicaoMar",
        dados.condicao || "--"
    );


    atualizarTexto(
        "ondasMar",
        formatarNumero(
            dados.onda,
            " m"
        )
    );


    atualizarTexto(
        "swellMar",
        formatarNumero(
            dados.swell
        )
    );


    atualizarTexto(
        "ventoMar",
        formatarVento(
            dados.vento
        )
    );


    atualizarTexto(
        "aguaMar",
        formatarNumero(
            dados.agua,
            " °C"
        )
    );


    atualizarTexto(
        "periodoMar",
        formatarNumero(
            dados.periodo,
            " s"
        )
    );


    atualizarTexto(
        "direcaoMar",
        dados.direcao || "--"
    );


    atualizarTexto(
        "tipoVento",
        dados.tipoVento || "--"
    );


    atualizarTexto(
        "temperaturaAr",
        formatarNumero(
            dados.temperaturaAr,
            " °C"
        )
    );


    // --------------------------------------------------
    // MARÉ
    // --------------------------------------------------

    atualizarTexto(
        "mareMar",
        dados.mare || "--"
    );


    atualizarTexto(
        "proximaMare",
        dados.proximaMare || "--"
    );


    atualizarTexto(
        "alturaMare",
        dados.alturaMare || "--"
    );


    atualizarTexto(
        "proximaMareSeguinte",
        dados.proximaMareSeguinte || "--"
    );


    atualizarTexto(
        "horarioMareSeguinte",
        dados.horarioMareSeguinte || "--"
    );


    atualizarTexto(
        "alturaMareSeguinte",
        dados.alturaMareSeguinte || "--"
    );


    // --------------------------------------------------
    // SOL
    // --------------------------------------------------

    atualizarTexto(
        "nascerSol",
        dados.nascer || "--"
    );


    atualizarTexto(
        "porSol",
        dados.por || "--"
    );


    // --------------------------------------------------
    // LUA
    // --------------------------------------------------

    atualizarTexto(
        "faseLua",
        dados.lua || "--"
    );

}


// ======================================================
// ATUALIZAR TEXTO
// ======================================================

function atualizarTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );

    if (elemento) {

        elemento.textContent =
            valor;

    }

}


// ======================================================
// COORDENADAS VÁLIDAS
// ======================================================

function coordenadasValidas() {

    return (
        Number.isFinite(
            latitudeAtual
        ) &&
        Number.isFinite(
            longitudeAtual
        ) &&
        !(
            latitudeAtual === 0 &&
            longitudeAtual === 0
        )
    );

}


// ======================================================
// FORMATAR NÚMERO
// ======================================================

function formatarNumero(
    valor,
    unidade = ""
) {

    if (
        valor === undefined ||
        valor === null ||
        valor === "" ||
        !Number.isFinite(
            Number(valor)
        )
    ) {

        return "--";

    }

    return (
        Number(valor).toFixed(1) +
        unidade
    );

}


// ======================================================
// FORMATAR VENTO
// ======================================================

function formatarVento(
    valor
) {

    if (
        valor === undefined ||
        valor === null ||
        valor === "" ||
        !Number.isFinite(
            Number(valor)
        )
    ) {

        return "--";

    }

    return (
        (
            Number(valor) * 3.6
        ).toFixed(0) +
        " km/h"
    );

}


// ======================================================
// LOCALIZAR PRAIA PELO NOME
// ======================================================

async function localizarPraiaPorNome() {

    if (!praiaAtual) {

        throw new Error(
            "Praia não definida."
        );

    }


    console.log(
        "🔎 Localizando:",
        praiaAtual
    );


    const url =
        "https://nominatim.openstreetmap.org/search" +
        "?format=json" +
        "&limit=1" +
        `&q=${encodeURIComponent(
            praiaAtual + ", Brasil"
        )}`;


    const resposta =
        await fetch(
            url
        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao localizar a praia."
        );

    }


    const locais =
        await resposta.json();


    if (
        !Array.isArray(locais) ||
        !locais.length
    ) {

        throw new Error(
            "Praia não encontrada."
        );

    }


    latitudeAtual =
        Number(
            locais[0].lat
        );


    longitudeAtual =
        Number(
            locais[0].lon
        );


    if (!coordenadasValidas()) {

        throw new Error(
            "Coordenadas inválidas."
        );

    }


    salvarCoordenadas();


    console.log(
        "📍 Coordenadas encontradas:",
        latitudeAtual,
        longitudeAtual
    );

}


// ======================================================
// SALVAR COORDENADAS
// ======================================================

function salvarCoordenadas() {

    const salvo =
        localStorage.getItem(
            "marHojeWaveRise"
        );


    let dados = {};

    try {

        if (salvo) {

            dados =
                JSON.parse(
                    salvo
                );

        }

    }

    catch {

        dados = {};

    }


    dados.praia =
        praiaAtual;


    dados.latitude =
        latitudeAtual;


    dados.longitude =
        longitudeAtual;


    dados.data =
        Date.now();


    localStorage.setItem(
        "marHojeWaveRise",
        JSON.stringify(
            dados
        )
    );

}


// ======================================================
// CARREGAR DADOS PRO
// ======================================================

async function carregarDadosPRO() {

    if (
        !coordenadasValidas()
    ) {

        console.warn(
            "⚠️ Coordenadas não disponíveis para o Mar PRO."
        );

        return;

    }


    try {

        console.log(
            "⭐ Carregando dados avançados do Mar PRO..."
        );


        // ==================================================
        // STORMGLASS
        // ==================================================

        const dados =
            await buscarCondicoes(
                latitudeAtual,
                longitudeAtual
            );


        // ==================================================
        // MARÉ
        // ==================================================

        try {

            const mare =
                await buscarMare(
                    latitudeAtual,
                    longitudeAtual
                );


            dados.mare =
                mare.proximaMare || "--";


            dados.proximaMare =
                mare.horarioMare || "--";


            dados.alturaMare =
                mare.alturaMare || "--";


            dados.proximaMareSeguinte =
                mare.proximaMareSeguinte || "--";


            dados.horarioMareSeguinte =
                mare.horarioMareSeguinte || "--";


            dados.alturaMareSeguinte =
                mare.alturaMareSeguinte || "--";


            dados.estacaoMare =
                mare.estacao || "--";


            console.log(
                "🌊 Maré carregada:",
                mare
            );

        }

        catch (erro) {

            console.warn(
                "⚠️ Maré não disponível:",
                erro
            );

        }


        // ==================================================
        // SOL
        // ==================================================

        try {

            const sol =
                await buscarSol(
                    latitudeAtual,
                    longitudeAtual
                );


            dados.nascer =
                sol.nascer || "--";


            dados.por =
                sol.por || "--";


            console.log(
                "☀️ Sol carregado:",
                sol
            );

        }

        catch (erro) {

            console.warn(
                "⚠️ Dados do sol não disponíveis:",
                erro
            );

        }


        // ==================================================
        // LUA
        // ==================================================

        try {

            dados.lua =
                calcularLua();

        }

        catch (erro) {

            console.warn(
                "⚠️ Lua não disponível:",
                erro
            );

            dados.lua =
                "--";

        }


        // ==================================================
        // ATUALIZAR CONDIÇÕES
        // ==================================================

        atualizarTela(
            dados
        );


        // ==================================================
        // COACH
        // ==================================================

        atualizarCoach(
            dados
        );


        // ==================================================
        // SCORE
        // ==================================================

        atualizarNota(
            dados
        );


        // ==================================================
        // TIMELINE
        // ==================================================

        if (
            Array.isArray(
                dados.hours
            )
        ) {

            atualizarTimeline(
                dados.hours
            );

        }


        // ==================================================
        // PREVISÃO
        // ==================================================

        try {

            await buscarPrevisao(
                latitudeAtual,
                longitudeAtual
            );

        }

        catch (erro) {

            console.warn(
                "⚠️ Previsão não disponível:",
                erro
            );

        }


        // ==================================================
        // HERO
        // ==================================================

        atualizarHero(
            dados
        );


        // ==================================================
        // DADOS ATUAIS DA PÁGINA
        // ==================================================

        preencherDadosAtuais(
            dados
        );


        // ==================================================
        // SALVAR COORDENADAS + DADOS
        // ==================================================

        salvarDadosPRO(
            dados
        );


        console.log(
            "✅ Mar PRO carregado com sucesso."
        );

    }

    catch (erro) {

        console.error(
            "❌ Erro no Mar PRO:",
            erro
        );


        const coach =
            document.getElementById(
                "coachTexto"
            );


        if (coach) {

            coach.textContent =
                "Não foi possível atualizar os dados agora. Tente novamente em alguns instantes.";

        }

    }

}


// ======================================================
// ATUALIZAR HERO
// ======================================================

function atualizarHero(
    dados
) {

    atualizarTexto(
        "heroPraia",
        praiaAtual || "--"
    );


    atualizarTexto(
        "heroCondicao",
        dados.condicao || "--"
    );


    atualizarTexto(
        "heroNota",
        dados.surfScore ?? "--"
    );


    atualizarTexto(
        "heroOnda",
        formatarNumero(
            dados.onda,
            " m"
        )
    );


    atualizarTexto(
        "heroVento",
        formatarVento(
            dados.vento
        )
    );


    atualizarTexto(
        "heroAgua",
        formatarNumero(
            dados.agua,
            " °C"
        )
    );


    atualizarTexto(
        "heroPrancha",
        dados.prancha || "--"
    );


    atualizarTexto(
        "heroHorario",
        dados.horario || "--"
    );

}


// ======================================================
// PREENCHER DADOS ATUAIS
// ======================================================

function preencherDadosAtuais(
    dados
) {

    // --------------------------------------------------
    // SCORE
    // --------------------------------------------------

    atualizarTexto(
        "notaGrande",
        dados.surfScore ?? "--"
    );


    atualizarTexto(
        "condicaoMar",
        dados.condicao || "--"
    );


    // --------------------------------------------------
    // CONDIÇÕES
    // --------------------------------------------------

    atualizarTexto(
        "ondasMar",
        formatarNumero(
            dados.onda,
            " m"
        )
    );


    atualizarTexto(
        "swellMar",
        formatarNumero(
            dados.swell
        )
    );


    atualizarTexto(
        "ventoMar",
        formatarVento(
            dados.vento
        )
    );


    atualizarTexto(
        "aguaMar",
        formatarNumero(
            dados.agua,
            " °C"
        )
    );


    atualizarTexto(
        "direcaoMar",
        dados.direcao || "--"
    );


    atualizarTexto(
        "periodoMar",
        formatarNumero(
            dados.periodo,
            " s"
        )
    );


    atualizarTexto(
        "tipoVento",
        dados.tipoVento || "--"
    );


    atualizarTexto(
        "temperaturaAr",
        formatarNumero(
            dados.temperaturaAr,
            " °C"
        )
    );


    // --------------------------------------------------
    // MARÉ
    // --------------------------------------------------

    atualizarTexto(
        "mareMar",
        dados.mare || "--"
    );


    atualizarTexto(
        "proximaMare",
        dados.proximaMare || "--"
    );


    atualizarTexto(
        "alturaMare",
        dados.alturaMare || "--"
    );


    atualizarTexto(
        "proximaMareSeguinte",
        dados.proximaMareSeguinte || "--"
    );


    atualizarTexto(
        "horarioMareSeguinte",
        dados.horarioMareSeguinte || "--"
    );


    atualizarTexto(
        "alturaMareSeguinte",
        dados.alturaMareSeguinte || "--"
    );


    // --------------------------------------------------
    // SOL
    // --------------------------------------------------

    atualizarTexto(
        "nascerSol",
        dados.nascer || "--"
    );


    atualizarTexto(
        "porSol",
        dados.por || "--"
    );


    // --------------------------------------------------
    // LUA
    // --------------------------------------------------

    atualizarTexto(
        "faseLua",
        dados.lua || "--"
    );

}


// ======================================================
// SALVAR DADOS PRO
// ======================================================

function salvarDadosPRO(
    dados
) {

    const dadosSalvar = {

        praia:
            praiaAtual,

        latitude:
            latitudeAtual,

        longitude:
            longitudeAtual,

        onda:
            dados.onda,

        swell:
            dados.swell,

        periodo:
            dados.periodo,

        vento:
            dados.vento,

        agua:
            dados.agua,

        direcao:
            dados.direcao,

        tipoVento:
            dados.tipoVento,

        temperaturaAr:
            dados.temperaturaAr,

        score:
            dados.surfScore,

        condicao:
            dados.condicao,

        prancha:
            dados.prancha,

        horario:
            dados.horario,

        mare:
            dados.mare,

        proximaMare:
            dados.proximaMare,

        alturaMare:
            dados.alturaMare,

        proximaMareSeguinte:
            dados.proximaMareSeguinte,

        horarioMareSeguinte:
            dados.horarioMareSeguinte,

        alturaMareSeguinte:
            dados.alturaMareSeguinte,

        estacaoMare:
            dados.estacaoMare,

        nascer:
            dados.nascer,

        por:
            dados.por,

        lua:
            dados.lua,

        data:
            Date.now()

    };


    localStorage.setItem(
        "marHojeWaveRise",
        JSON.stringify(
            dadosSalvar
        )
    );

}


// ======================================================
// COACH PRO
// ======================================================

async function analisarCoach() {

    const botao =
        document.getElementById(
            "analisarCoach"
        );


    if (botao) {

        botao.disabled =
            true;

        botao.textContent =
            "🤖 Analisando...";

    }


    try {

        await carregarDadosPRO();

    }

    catch (erro) {

        console.error(
            "❌ Erro na análise do Coach:",
            erro
        );

    }

    finally {

        if (botao) {

            botao.disabled =
                false;

            botao.textContent =
                "✨ Analisar sessão";

        }

    }

}


// ======================================================
// EXPORTAÇÕES
// ======================================================

window.analisarCoachPRO =
    analisarCoach;


window.carregarMarPRO =
    carregarDadosPRO;


// ======================================================
// FINAL
// ======================================================

console.log(
    "⭐ WaveRise Mar PRO carregado."
);