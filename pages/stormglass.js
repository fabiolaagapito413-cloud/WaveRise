// ======================================================
// WaveRise 4.0
// Stormglass API
// ======================================================

import {
    classificarVento,
    recomendarPrancha,
    analisarHorario
} from "./utils.js";

import {
    calcularSurfScore
} from "./score.js";

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const API_KEY = import.meta.env.VITE_STORMGLASS_API_KEY;

const PARAMS = [

    "waveHeight",
    "wavePeriod",
    "waveDirection",

    "windSpeed",
    "windDirection",

    "waterTemperature",
    "airTemperature",

    "swellHeight",
    "swellDirection",
    "swellPeriod"

].join(",");

console.log("🌊 Stormglass iniciado.");
// ======================================================
// BUSCAR CONDIÇÕES
// ======================================================

export async function buscarCondicoes(latitude, longitude){

    if(!API_KEY){

        throw new Error(
            "API da Stormglass não configurada."
        );

    }

    const url =
`https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=${PARAMS}`;

    console.log("🌍 Consultando Stormglass...");
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    const resposta = await fetch(

        url,

        {

            headers:{

                Authorization: API_KEY

            }

        }

    );

    console.log("Status:", resposta.status);

    if(!resposta.ok){

        const erro = await resposta.text();

        console.error("Stormglass:", erro);

        throw new Error(

            `Stormglass ${resposta.status}`

        );

    }

    const json = await resposta.json();

    console.log("Resposta:", json);

    if(!json.hours || json.hours.length === 0){

        throw new Error(

            "A Stormglass não retornou previsão."

        );

    }

    return interpretar(

        json.hours[0],

        json.hours

    );

}
// ======================================================
// INTERPRETA DADOS
// ======================================================

function interpretar(atual, hours){

    const onda = valor(atual.waveHeight);

    const swell = valor(atual.swellHeight);

    const periodo = valor(atual.wavePeriod);

    const periodoSwell = valor(atual.swellPeriod);

    const direcao = valor(atual.waveDirection);

    const direcaoSwell = valor(atual.swellDirection);

    const vento = valor(atual.windSpeed);

    const direcaoVento = valor(atual.windDirection);

    const agua = valor(atual.waterTemperature);

    const ar = valor(atual.airTemperature);

    const tipoVento = classificarVento(direcaoVento);

    const surf = calcularSurfScore({

        onda,

        swell,

        periodo,

        vento,

        tipoVento,

        agua

    });

    return {

        // ==========================
        // MAR
        // ==========================

        onda,
        swell,
        periodo,
        periodoSwell,

        direcao,
        direcaoSwell,

        vento,
        direcaoVento,

        agua,
        ar,

        tipoVento,

        // ==========================
        // SCORE
        // ==========================

        nota: surf.score / 10,

        surfScore: surf.score,

        estrelas: surf.estrelas,

        nivel: surf.nivel,

        corScore: surf.cor,

        condicao: surf.nivel,

        // ==========================
        // COACH
        // ==========================

        prancha: recomendarPrancha(onda),

        horario: analisarHorario(

            surf.score / 10,

            vento,

            tipoVento

        ),

        // ==========================
        // TIMELINE
        // ==========================

        hours,

        // ==========================
        // CAMPOS COMPLEMENTARES
        // ==========================

        mare: "--",

        proximaMare: "--",

        alturaMare: "--",

        nascer: "--:--",

        por: "--:--",

        lua: "--"

    };

}
// ======================================================
// FORMATAÇÃO
// ======================================================

export function formatarDados(dados){

    return{

        heroOnda: `${dados.onda.toFixed(1)} m`,

        heroVento: `${(dados.vento * 3.6).toFixed(0)} km/h`,

        heroNota: dados.surfScore,

        onda: `${dados.onda.toFixed(1)} m`,

        swell: `${dados.swell.toFixed(1)} m`,

        periodo: `${dados.periodo.toFixed(0)} s`,

        vento: `${(dados.vento * 3.6).toFixed(1)} km/h`,

        agua: `${dados.agua.toFixed(1)} °C`,

        ar: `${dados.ar.toFixed(1)} °C`,

        direcao: `${setaDirecao(dados.direcaoVento)} ${dados.direcaoVento.toFixed(0)}°`,

        tipoVento: dados.tipoVento,

        nota: dados.surfScore,

        condicao: dados.condicao,

        prancha: dados.prancha,

        horario: dados.horario,

        mare: dados.mare,

        proximaMare: dados.proximaMare,

        alturaMare: dados.alturaMare,

        nascer: dados.nascer,

        por: dados.por,

        lua: dados.lua

    };

}

// ======================================================
// ATUALIZA TELA
// ======================================================

export function atualizarTela(dados){

    const info = formatarDados(dados);

    atualizar("heroOnda", info.heroOnda);
    atualizar("heroVento", info.heroVento);
    atualizar("heroNota", info.heroNota);
    atualizar("heroAgua", info.agua);
    atualizar("heroCondicao", info.condicao);
    atualizar("heroPrancha", info.prancha);
    atualizar("heroHorario", info.horario);

    atualizar("ondasMar", info.onda);
    atualizar("swellMar", info.swell);
    atualizar("periodoMar", info.periodo);
    atualizar("direcaoMar", info.direcao);
    atualizar("ventoMar", info.vento);
    atualizar("tipoVento", info.tipoVento);
    atualizar("aguaMar", info.agua);
    atualizar("temperaturaAr", info.ar);

    atualizar("notaSurf", info.nota);
    atualizar("melhorHorario", info.horario);

    atualizar("mareMar", info.mare);
    atualizar("proximaMare", info.proximaMare);
    atualizar("alturaMare", info.alturaMare);

    atualizar("nascerSol", info.nascer);
    atualizar("porSol", info.por);

    atualizar("faseLua", info.lua);

}
// ======================================================
// RESUMO PARA O COACH IA
// ======================================================

export function gerarResumo(dados){

    return `
🌊 Onda: ${dados.onda.toFixed(1)} m
🌊 Swell: ${dados.swell.toFixed(1)} m

⏱ Período: ${dados.periodo.toFixed(0)} s

💨 Vento: ${(dados.vento * 3.6).toFixed(1)} km/h
🧭 Direção: ${dados.direcaoVento.toFixed(0)}°

🌡 Água: ${dados.agua.toFixed(1)} °C
🌡 Ar: ${dados.ar.toFixed(1)} °C

⭐ Surf Score: ${dados.surfScore}

${dados.condicao}

🏄 Prancha recomendada:
${dados.prancha}

🕒 Melhor horário:
${dados.horario}
`;

}

// ======================================================
// MELHOR FONTE DOS DADOS
// ======================================================

function valor(objeto){

    if(!objeto) return 0;

    const fontes = [

        "sg",
        "noaa",
        "icon",
        "dwd",
        "meteo",
        "smhi"

    ];

    for(const fonte of fontes){

        if(objeto[fonte] != null){

            return objeto[fonte];

        }

    }

    return Object.values(objeto)[0] ?? 0;

}

// ======================================================
// ATUALIZAR ELEMENTO
// ======================================================

function atualizar(id, valor){

    const elemento = document.getElementById(id);

    if(elemento){

        elemento.textContent = valor;

    }

}
// ======================================================
// DIREÇÃO
// ======================================================

function setaDirecao(graus){

    if(graus == null){

        return "--";

    }

    if(graus >= 337.5 || graus < 22.5)
        return "⬆ Norte";

    if(graus < 67.5)
        return "↗ Nordeste";

    if(graus < 112.5)
        return "➡ Leste";

    if(graus < 157.5)
        return "↘ Sudeste";

    if(graus < 202.5)
        return "⬇ Sul";

    if(graus < 247.5)
        return "↙ Sudoeste";

    if(graus < 292.5)
        return "⬅ Oeste";

    return "↖ Noroeste";

}

// ======================================================
// DIAGNÓSTICO
// ======================================================

export function diagnosticoStormglass(){

    return{

        apiConfigurada: !!API_KEY,

        chave: API_KEY ? "OK" : "NÃO",

        parametros: PARAMS

    };

}

// ======================================================

console.log("🌊 Stormglass 4.0 carregado.");