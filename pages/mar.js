// ======================================================
// WaveRise 5.0
// Mar Premium
// ======================================================

import {
    iniciarMapa,
    moverMapa
} from "./mapa.js";

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
    salvarFavorito,
    mostrarFavoritos,
    limparFavoritos
} from "./favoritos.js";

import {
    atualizarTimeline
} from "./timeline.js";


// ======================================================
// VARIÁVEIS
// ======================================================

let mapa;

let praiaAtual = "";

let latitudeAtual = 0;

let longitudeAtual = 0;


// ======================================================
// INICIAR
// ======================================================

window.addEventListener(
    "DOMContentLoaded",
    iniciar
);


async function iniciar() {

    mapa =
        iniciarMapa("mapa");

    configurarEventos();

    mostrarFavoritos(
        abrirFavorito
    );

    restaurarUltimaPraia();

    console.log(
        "🌊 WaveRise iniciado."
    );

}


// ======================================================
// EVENTOS
// ======================================================

function configurarEventos() {

    document
        .getElementById("buscarMar")
        ?.addEventListener(
            "click",
            pesquisarPraia
        );


    document
        .getElementById("gps")
        ?.addEventListener(
            "click",
            usarGPS
        );


    document
        .getElementById("favoritar")
        ?.addEventListener(
            "click",
            favoritarPraia
        );


    document
        .getElementById("limparFavoritos")
        ?.addEventListener(
            "click",
            () => {

                limparFavoritos();

                mostrarFavoritos(
                    abrirFavorito
                );

            }
        );


    document
        .getElementById("analisarCoach")
        ?.addEventListener(
            "click",
            () => {

                alert(
                    "🤖 Coach IA analisando as condições..."
                );

            }
        );

}


// ======================================================
// RESTAURAR ÚLTIMA PRAIA
// ======================================================

function restaurarUltimaPraia() {

    const ultima =
        localStorage.getItem(
            "ultimaPraia"
        );


    if (!ultima) {

        return;

    }


    const input =
        document.getElementById(
            "praiaInput"
        );


    if (input) {

        input.value =
            ultima;

    }

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
// PESQUISAR PRAIA
// ======================================================

async function pesquisarPraia() {

    const input =
        document.getElementById(
            "praiaInput"
        );


    if (!input) {

        return;

    }


    const praia =
        input.value.trim();


    if (!praia) {

        alert(
            "Digite uma praia."
        );

        return;

    }


    try {

        const resposta =
            await fetch(

                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(praia)}`

            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao localizar a praia."
            );

        }


        const locais =
            await resposta.json();


        if (!locais.length) {

            alert(
                "Praia não encontrada."
            );

            return;

        }


        praiaAtual =
            praia;


        latitudeAtual =
            Number(
                locais[0].lat
            );


        longitudeAtual =
            Number(
                locais[0].lon
            );


        localStorage.setItem(
            "ultimaPraia",
            praiaAtual
        );


        moverMapa(
            mapa,
            latitudeAtual,
            longitudeAtual,
            praiaAtual
        );


        atualizarTexto(
            "localMar",
            praiaAtual
        );


        await carregarDados();

    }

    catch (erro) {

        console.error(
            erro
        );


        alert(
            "Erro ao localizar a praia."
        );

    }

}


// ======================================================
// GPS
// ======================================================

function usarGPS() {

    if (
        !navigator.geolocation
    ) {

        alert(
            "Seu navegador não suporta GPS."
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        async (posicao) => {

            latitudeAtual =
                posicao.coords.latitude;


            longitudeAtual =
                posicao.coords.longitude;


            praiaAtual =
                "Minha localização";


            moverMapa(
                mapa,
                latitudeAtual,
                longitudeAtual,
                praiaAtual
            );


            atualizarTexto(
                "localMar",
                praiaAtual
            );


            await carregarDados();

        },

        (erro) => {

            console.error(
                "GPS:",
                erro
            );


            alert(
                "Não foi possível obter sua localização."
            );

        }

    );

}


// ======================================================
// FAVORITOS
// ======================================================

function favoritarPraia() {

    if (!praiaAtual) {

        alert(
            "Pesquise uma praia primeiro."
        );

        return;

    }


    salvarFavorito(
        praiaAtual,
        latitudeAtual,
        longitudeAtual
    );


    mostrarFavoritos(
        abrirFavorito
    );

}


// ======================================================
// ABRIR FAVORITO
// ======================================================

async function abrirFavorito(
    favorito
) {

    praiaAtual =
        favorito.nome;


    latitudeAtual =
        Number(
            favorito.latitude
        );


    longitudeAtual =
        Number(
            favorito.longitude
        );


    moverMapa(
        mapa,
        latitudeAtual,
        longitudeAtual,
        praiaAtual
    );


    atualizarTexto(
        "localMar",
        praiaAtual
    );


    await carregarDados();

}


// ======================================================
// CARREGAR DADOS
// ======================================================

async function carregarDados() {

    try {

        if (
            !Number.isFinite(
                latitudeAtual
            ) ||
            !Number.isFinite(
                longitudeAtual
            )
        ) {

            throw new Error(
                "Coordenadas inválidas."
            );

        }


        console.log(
            "🌊 Carregando dados do Mar..."
        );


        // =====================================
        // STORMGLASS
        // =====================================

        const dados =
            await buscarCondicoes(

                latitudeAtual,
                longitudeAtual

            );


        // =====================================
        // MARÉ REAL - STORMGLASS
        // =====================================

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
                mare.proximaMareSeguinte ||
                "--";


            dados.horarioMareSeguinte =
                mare.horarioMareSeguinte ||
                "--";


            dados.alturaMareSeguinte =
                mare.alturaMareSeguinte ||
                "--";


            dados.estacaoMare =
                mare.estacao ||
                "--";


            console.log(
                "🌊 Maré real carregada:",
                mare
            );

        }

        catch (erroMare) {

            console.warn(
                "⚠️ Não foi possível carregar a maré:",
                erroMare
            );


            // Não derruba o restante
            // do Mar se a maré falhar.

            dados.mare =
                "--";


            dados.proximaMare =
                "--";


            dados.alturaMare =
                "--";


            dados.proximaMareSeguinte =
                "--";


            dados.horarioMareSeguinte =
                "--";


            dados.alturaMareSeguinte =
                "--";


            dados.estacaoMare =
                "--";

        }


        // =====================================
        // SOL
        // =====================================

        const sol =
            await buscarSol(

                latitudeAtual,
                longitudeAtual

            );


        dados.nascer =
            sol.nascer;


        dados.por =
            sol.por;


        // =====================================
        // LUA
        // =====================================

        dados.lua =
            calcularLua();


        // =====================================
        // HERO
        // =====================================

        atualizarHero(
            praiaAtual,
            dados
        );


        // =====================================
        // CONDIÇÕES
        // =====================================

        atualizarTela(
            dados
        );


        // =====================================
        // COACH
        // =====================================

        atualizarCoach(
            dados
        );


        atualizarNota(
            dados
        );


        // =====================================
        // TIMELINE
        // =====================================

        if (
            dados.hours
        ) {

            atualizarTimeline(
                dados.hours
            );

        }


        // =====================================
        // PREVISÃO
        // =====================================

        await buscarPrevisao(

            latitudeAtual,
            longitudeAtual

        );


        // =====================================
        // HOME
        // =====================================

        localStorage.setItem(

            "marHojeWaveRise",

            JSON.stringify({

                praia:
                    praiaAtual,

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

            })

        );


        console.log(
            "✅ Dados carregados com sucesso."
        );

    }

    catch (erro) {

        console.error(
            "❌ Erro ao carregar dados:",
            erro
        );


        alert(`
ERRO WAVERISE

Mensagem:
${erro.message}

Stack:
${erro.stack}
        `);

    }

}


// ======================================================
// HERO
// ======================================================

function atualizarHero(
    praia,
    dados
) {

    atualizarTexto(
        "heroPraia",
        praia
    );


    atualizarTexto(
        "heroCondicao",
        dados.condicao
    );


    atualizarTexto(
        "heroNota",
        dados.surfScore
    );


    atualizarTexto(
        "heroOnda",
        `${dados.onda.toFixed(1)} m`
    );


    atualizarTexto(
        "heroVento",
        `${(
            dados.vento * 3.6
        ).toFixed(0)} km/h`
    );


    atualizarTexto(
        "heroAgua",
        `${dados.agua.toFixed(1)} °C`
    );


    atualizarTexto(
        "heroPrancha",
        dados.prancha
    );


    atualizarTexto(
        "heroHorario",
        dados.horario
    );

}


// ======================================================
// STORAGE
// ======================================================

window.addEventListener(
    "storage",
    () => {

        mostrarFavoritos(
            abrirFavorito
        );

    }
);


// ======================================================
// EXPORTA
// ======================================================

window.pesquisarPraia =
    pesquisarPraia;


window.usarGPS =
    usarGPS;


// ======================================================
// FINAL
// ======================================================

console.log(
    "🌊 Mar Premium carregado com sucesso."
);