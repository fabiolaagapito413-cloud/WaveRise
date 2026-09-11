// ======================================================
// WaveRise 5.0
// MAR — VERSÃO GRATUITA
// ======================================================

import {
    iniciarMapa,
    moverMapa
} from "./mapa.js";

import {
    buscarCondicoes,
    atualizarTela
} from "./stormglass.js";

import {
    atualizarCoach,
    atualizarNota
} from "./coach.js";

import {
    salvarFavorito,
    mostrarFavoritos,
    limparFavoritos
} from "./favoritos.js";


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

    mapa = iniciarMapa("mapa");

    configurarEventos();

    mostrarFavoritos(
        abrirFavorito
    );

    restaurarUltimaPraia();

    console.log(
        "🌊 WaveRise Mar iniciado."
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

        input.value = ultima;

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
        document.getElementById(id);


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

        console.log(
            "🔎 Procurando praia:",
            praia
        );


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
            "❌ Erro ao pesquisar praia:",
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


    console.log(
        "📍 Solicitando localização..."
    );


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
                "❌ GPS:",
                erro
            );


            alert(
                "Não foi possível obter sua localização. Verifique a permissão de localização."
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000
        }

    );

}


// ======================================================
// FAVORITAR PRAIA
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


    console.log(
        "❤️ Praia favorita salva:",
        praiaAtual
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
// CARREGAR DADOS DO MAR
// ======================================================

async function carregarDados() {

    try {

        if (
            !Number.isFinite(latitudeAtual) ||
            !Number.isFinite(longitudeAtual)
        ) {

            throw new Error(
                "Coordenadas inválidas."
            );

        }


        console.log(
            "🌊 Carregando condições atuais do mar..."
        );


        // ==================================================
        // STORMGLASS
        // ==================================================

        const dados =
            await buscarCondicoes(
                latitudeAtual,
                longitudeAtual
            );


        if (!dados) {

            throw new Error(
                "Não foi possível obter os dados do mar."
            );

        }


        console.log(
            "🌊 Dados recebidos:",
            dados
        );


        // ==================================================
        // HERO
        // ==================================================

        atualizarHero(
            praiaAtual,
            dados
        );


        // ==================================================
        // CONDIÇÕES
        // ==================================================

        atualizarTela(
            dados
        );


        // ==================================================
        // COACH BÁSICO
        // ==================================================

        atualizarCoach(
            dados
        );


        // ==================================================
        // SURF SCORE
        // ==================================================

        atualizarNota(
            dados
        );


        // ==================================================
        // SALVAR DADOS PARA A HOME
        // ==================================================

        salvarMarHoje(
            dados
        );


        console.log(
            "✅ Dados do Mar carregados."
        );

    }

    catch (erro) {

        console.error(
            "❌ Erro ao carregar dados:",
            erro
        );


        alert(
            `Não foi possível carregar as condições do mar.\n\n${erro.message}`
        );

    }

}


// ======================================================
// SALVAR MAR DE HOJE
// ======================================================

function salvarMarHoje(
    dados
) {

    const dadosSalvos = {

        praia:
            praiaAtual,

        latitude:
            latitudeAtual,

        longitude:
            longitudeAtual,

        onda:
            dados.onda ?? null,

        swell:
            dados.swell ?? null,

        periodo:
            dados.periodo ?? null,

        vento:
            dados.vento ?? null,

        agua:
            dados.agua ?? null,

        direcao:
            dados.direcao ?? null,

        tipoVento:
            dados.tipoVento ?? null,

        temperaturaAr:
            dados.temperaturaAr ?? null,

        score:
            dados.surfScore ?? null,

        condicao:
            dados.condicao ?? "--",

        data:
            Date.now()

    };


    localStorage.setItem(
        "marHojeWaveRise",
        JSON.stringify(dadosSalvos)
    );


    // Também salvamos as coordenadas
    // separadamente para o Mar PRO.

    localStorage.setItem(
        "ultimaLocalizacaoMarWaveRise",
        JSON.stringify({

            latitude:
                latitudeAtual,

            longitude:
                longitudeAtual,

            praia:
                praiaAtual

        })
    );


    console.log(
        "💾 Mar de hoje salvo."
    );

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
        dados.condicao ?? "--"
    );


    atualizarTexto(
        "heroNota",
        dados.surfScore ?? "--"
    );


    // ==================================================
    // ONDA
    // ==================================================

    atualizarTexto(
        "heroOnda",
        formatarNumero(
            dados.onda,
            " m"
        )
    );


    // ==================================================
    // VENTO
    // ==================================================

    let ventoKm = "--";


    if (
        typeof dados.vento === "number"
    ) {

        ventoKm =
            `${(
                dados.vento * 3.6
            ).toFixed(0)} km/h`;

    }


    atualizarTexto(
        "heroVento",
        ventoKm
    );


    // ==================================================
    // ÁGUA
    // ==================================================

    atualizarTexto(
        "heroAgua",
        formatarNumero(
            dados.agua,
            " °C"
        )
    );


    // ==================================================
    // DIREÇÃO
    // ==================================================

    atualizarTexto(
        "heroDirecao",
        dados.direcao ?? "--"
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
        typeof valor !== "number" ||
        !Number.isFinite(valor)
    ) {

        return "--";

    }


    return (
        valor.toFixed(1) +
        unidade
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
    "🌊 WaveRise Mar carregado com sucesso."
);