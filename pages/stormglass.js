// ======================================================
// WaveRise 5.0
// Stormglass API
// Mar + Maré Real
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

const API_KEY =
    import.meta.env.VITE_STORMGLASS_API_KEY;


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

console.log(
    "API configurada:",
    Boolean(API_KEY),
    "Tamanho:",
    API_KEY ? API_KEY.length : 0
);


// ======================================================
// BUSCAR CONDIÇÕES
// ======================================================

export async function buscarCondicoes(
    latitude,
    longitude
) {

    if (!API_KEY) {

        throw new Error(
            "API da Stormglass não configurada. " +
            "Verifique VITE_STORMGLASS_API_KEY no .env."
        );

    }


    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {

        throw new Error(
            "Latitude ou longitude inválida."
        );

    }


    const parametros =
        new URLSearchParams({

            lat:
                String(latitude),

            lng:
                String(longitude),

            params:
                PARAMS

        });


    const url =
        `https://api.stormglass.io/v2/weather/point?${parametros}`;


    console.log(
        "🌍 Consultando Stormglass..."
    );

    console.log(
        "Latitude:",
        latitude
    );

    console.log(
        "Longitude:",
        longitude
    );


    let resposta;


    try {

        resposta =
            await fetch(

                url,

                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            API_KEY,

                        "Accept":
                            "application/json"

                    }

                }

            );

    }

    catch (erro) {

        console.error(
            "❌ Falha de conexão com Stormglass:",
            erro
        );

        throw new Error(
            "Não foi possível conectar à Stormglass."
        );

    }


    console.log(
        "Stormglass status:",
        resposta.status
    );


    const texto =
        await resposta.text();


    let json =
        null;


    try {

        json =
            texto
                ? JSON.parse(texto)
                : null;

    }

    catch {

        json =
            null;

    }


    // ==================================================
    // ERRO
    // ==================================================

    if (!resposta.ok) {

        console.error(
            "❌ Resposta Stormglass:",
            texto
        );


        if (
            resposta.status === 401
        ) {

            throw new Error(
                "Stormglass 401: API Key inválida ou não autorizada."
            );

        }


        if (
            resposta.status === 403
        ) {

            throw new Error(
                "Stormglass 403: a Stormglass recusou a requisição. " +
                "Verifique o status da API Key e as permissões da conta."
            );

        }


        if (
            resposta.status === 429
        ) {

            throw new Error(
                "Stormglass 429: limite de requisições atingido."
            );

        }


        const mensagem =
            json?.errors?.join?.(", ") ||
            json?.message ||
            texto ||
            "Erro desconhecido na Stormglass.";


        throw new Error(
            `Stormglass ${resposta.status}: ${mensagem}`
        );

    }


    if (!json) {

        throw new Error(
            "A Stormglass respondeu sem dados."
        );

    }


    console.log(
        "✅ Resposta Stormglass recebida."
    );


    if (
        !json.hours ||
        !Array.isArray(json.hours) ||
        json.hours.length === 0
    ) {

        throw new Error(
            "A Stormglass não retornou previsão para esta localização."
        );

    }


    return interpretar(
        json.hours[0],
        json.hours
    );

}


// ======================================================
// BUSCAR MARÉ REAL
// ======================================================

export async function buscarMare(
    latitude,
    longitude
) {

    if (!API_KEY) {

        throw new Error(
            "API da Stormglass não configurada."
        );

    }


    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {

        throw new Error(
            "Latitude ou longitude inválida."
        );

    }


    const agora =
        new Date();


    const inicio =
        agora.toISOString();


    const fim =
        new Date(
            agora.getTime() +
            48 * 60 * 60 * 1000
        ).toISOString();


    const parametros =
        new URLSearchParams({

            lat:
                String(latitude),

            lng:
                String(longitude),

            start:
                inicio,

            end:
                fim

        });


    const url =
        `https://api.stormglass.io/v2/tide/extremes/point?${parametros}`;


    console.log(
        "🌊 Consultando maré real..."
    );


    let resposta;


    try {

        resposta =
            await fetch(

                url,

                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            API_KEY,

                        "Accept":
                            "application/json"

                    }

                }

            );

    }

    catch (erro) {

        console.error(
            "❌ Falha ao consultar maré:",
            erro
        );

        throw new Error(
            "Não foi possível conectar à API de maré."
        );

    }


    console.log(
        "Stormglass maré status:",
        resposta.status
    );


    const texto =
        await resposta.text();


    let json =
        null;


    try {

        json =
            texto
                ? JSON.parse(texto)
                : null;

    }

    catch {

        json =
            null;

    }


    if (!resposta.ok) {

        console.error(
            "❌ Resposta Stormglass maré:",
            texto
        );


        if (
            resposta.status === 401
        ) {

            throw new Error(
                "Stormglass maré 401: API Key inválida ou não autorizada."
            );

        }


        if (
            resposta.status === 403
        ) {

            throw new Error(
                "Stormglass maré 403: acesso à API de maré recusado."
            );

        }


        if (
            resposta.status === 429
        ) {

            throw new Error(
                "Stormglass maré 429: limite de requisições atingido."
            );

        }


        const mensagem =
            json?.errors?.join?.(", ") ||
            json?.message ||
            texto ||
            "Erro desconhecido na API de maré.";


        throw new Error(
            `Stormglass maré ${resposta.status}: ${mensagem}`
        );

    }


    if (!json) {

        throw new Error(
            "A Stormglass respondeu sem dados de maré."
        );

    }


    console.log(
        "✅ Dados de maré recebidos.",
        json
    );


    if (
        !Array.isArray(json.data)
    ) {

        throw new Error(
            "A Stormglass não retornou dados de maré."
        );

    }


    const agoraMs =
        Date.now();


    const extremos =
        json.data

            .filter(
                item =>
                    item &&
                    item.time &&
                    Number.isFinite(
                        Number(item.height)
                    ) &&
                    new Date(
                        item.time
                    ).getTime() >= agoraMs
            )

            .sort(
                (a, b) =>
                    new Date(a.time) -
                    new Date(b.time)
            );


    const proxima =
        extremos[0] || null;


    const seguinte =
        extremos[1] || null;


    return {

        proximaMare:
            proxima
                ? formatarTipoMare(
                    proxima.type
                )
                : "--",

        horarioMare:
            proxima
                ? formatarHora(
                    proxima.time
                )
                : "--",

        alturaMare:
            proxima
                ? formatarAltura(
                    proxima.height
                )
                : "--",


        proximaMareSeguinte:
            seguinte
                ? formatarTipoMare(
                    seguinte.type
                )
                : "--",

        horarioMareSeguinte:
            seguinte
                ? formatarHora(
                    seguinte.time
                )
                : "--",

        alturaMareSeguinte:
            seguinte
                ? formatarAltura(
                    seguinte.height
                )
                : "--",


        estacao:
            json.meta?.station?.name ||
            "--"

    };

}


// ======================================================
// INTERPRETAR DADOS
// ======================================================

function interpretar(
    atual,
    hours
) {

    const onda =
        valor(
            atual.waveHeight
        );


    const swell =
        valor(
            atual.swellHeight
        );


    const periodo =
        valor(
            atual.wavePeriod
        );


    const periodoSwell =
        valor(
            atual.swellPeriod
        );


    const direcao =
        valor(
            atual.waveDirection
        );


    const direcaoSwell =
        valor(
            atual.swellDirection
        );


    const vento =
        valor(
            atual.windSpeed
        );


    const direcaoVento =
        valor(
            atual.windDirection
        );


    const agua =
        valor(
            atual.waterTemperature
        );


    const ar =
        valor(
            atual.airTemperature
        );


    const tipoVento =
        classificarVento(
            direcaoVento
        );


    const surf =
        calcularSurfScore({

            onda,

            swell,

            periodo,

            vento,

            tipoVento,

            agua

        });


    return {

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


        nota:
            surf.score / 10,

        surfScore:
            surf.score,

        estrelas:
            surf.estrelas,

        nivel:
            surf.nivel,

        corScore:
            surf.cor,

        condicao:
            surf.nivel,


        prancha:
            recomendarPrancha(
                onda
            ),

        horario:
            analisarHorario(
                surf.score / 10,
                vento,
                tipoVento
            ),


        hours,


        mare:
            "--",

        proximaMare:
            "--",

        alturaMare:
            "--",

        horarioMare:
            "--",

        estacaoMare:
            "--",


        nascer:
            "--:--",

        por:
            "--:--",

        lua:
            "--"

    };

}


// ======================================================
// FORMATAÇÃO
// ======================================================

export function formatarDados(
    dados
) {

    return {

        heroOnda:
            `${dados.onda.toFixed(1)} m`,

        heroVento:
            `${(
                dados.vento * 3.6
            ).toFixed(0)} km/h`,

        heroNota:
            dados.surfScore,


        onda:
            `${dados.onda.toFixed(1)} m`,

        swell:
            `${dados.swell.toFixed(1)} m`,

        periodo:
            `${dados.periodo.toFixed(0)} s`,

        vento:
            `${(
                dados.vento * 3.6
            ).toFixed(1)} km/h`,

        agua:
            `${dados.agua.toFixed(1)} °C`,

        ar:
            `${dados.ar.toFixed(1)} °C`,


        direcao:
            `${setaDirecao(
                dados.direcaoVento
            )} ${
                dados.direcaoVento.toFixed(0)
            }°`,


        tipoVento:
            dados.tipoVento,

        nota:
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


        nascer:
            dados.nascer,

        por:
            dados.por,

        lua:
            dados.lua

    };

}


// ======================================================
// ATUALIZAR TELA
// ======================================================

export function atualizarTela(
    dados
) {

    const info =
        formatarDados(
            dados
        );


    atualizar(
        "heroOnda",
        info.heroOnda
    );

    atualizar(
        "heroVento",
        info.heroVento
    );

    atualizar(
        "heroNota",
        info.heroNota
    );

    atualizar(
        "heroAgua",
        info.agua
    );

    atualizar(
        "heroCondicao",
        info.condicao
    );

    atualizar(
        "heroPrancha",
        info.prancha
    );

    atualizar(
        "heroHorario",
        info.horario
    );


    atualizar(
        "ondasMar",
        info.onda
    );

    atualizar(
        "swellMar",
        info.swell
    );

    atualizar(
        "periodoMar",
        info.periodo
    );

    atualizar(
        "direcaoMar",
        info.direcao
    );

    atualizar(
        "ventoMar",
        info.vento
    );

    atualizar(
        "tipoVento",
        info.tipoVento
    );

    atualizar(
        "aguaMar",
        info.agua
    );

    atualizar(
        "temperaturaAr",
        info.ar
    );


    atualizar(
        "notaSurf",
        info.nota
    );

    atualizar(
        "melhorHorario",
        info.horario
    );


    atualizar(
        "mareMar",
        info.mare
    );

    atualizar(
        "proximaMare",
        info.proximaMare
    );

    atualizar(
        "alturaMare",
        info.alturaMare
    );


    atualizar(
        "nascerSol",
        info.nascer
    );

    atualizar(
        "porSol",
        info.por
    );

    atualizar(
        "faseLua",
        info.lua
    );

}


// ======================================================
// RESUMO PARA COACH
// ======================================================

export function gerarResumo(
    dados
) {

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

🌊 Próxima maré:
${dados.proximaMare || "--"}

🕐 Horário:
${dados.horarioMare || "--"}

📏 Altura:
${dados.alturaMare || "--"}
`;

}


// ======================================================
// ESCOLHER MELHOR FONTE
// ======================================================

function valor(
    objeto
) {

    if (
        objeto === null ||
        objeto === undefined
    ) {

        return 0;

    }


    if (
        typeof objeto === "number"
    ) {

        return objeto;

    }


    const fontes = [

        "sg",
        "noaa",
        "icon",
        "dwd",
        "meto",
        "meteo",
        "smhi",
        "yr",
        "fmi",
        "fcoo"

    ];


    for (
        const fonte of fontes
    ) {

        if (
            objeto[fonte] !== undefined &&
            objeto[fonte] !== null
        ) {

            return Number(
                objeto[fonte]
            ) || 0;

        }

    }


    const primeiro =
        Object.values(
            objeto
        )[0];


    return Number(
        primeiro
    ) || 0;

}


// ======================================================
// ATUALIZAR ELEMENTO
// ======================================================

function atualizar(
    id,
    valorAtual
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            valorAtual;

    }

}


// ======================================================
// DIREÇÃO DO VENTO
// ======================================================

function setaDirecao(
    graus
) {

    if (
        graus === null ||
        graus === undefined
    ) {

        return "--";

    }


    if (
        graus >= 337.5 ||
        graus < 22.5
    ) {

        return "⬆ Norte";

    }


    if (
        graus < 67.5
    ) {

        return "↗ Nordeste";

    }


    if (
        graus < 112.5
    ) {

        return "➡ Leste";

    }


    if (
        graus < 157.5
    ) {

        return "↘ Sudeste";

    }


    if (
        graus < 202.5
    ) {

        return "⬇ Sul";

    }


    if (
        graus < 247.5
    ) {

        return "↙ Sudoeste";

    }


    if (
        graus < 292.5
    ) {

        return "⬅ Oeste";

    }


    return "↖ Noroeste";

}


// ======================================================
// TIPO DE MARÉ
// ======================================================

function formatarTipoMare(
    tipo
) {

    if (!tipo) {

        return "--";

    }


    const texto =
        String(
            tipo
        ).toLowerCase();


    if (
        texto.includes("high")
    ) {

        return "⬆ Maré alta";

    }


    if (
        texto.includes("low")
    ) {

        return "⬇ Maré baixa";

    }


    return tipo;

}


// ======================================================
// ALTURA DA MARÉ
// ======================================================

function formatarAltura(
    altura
) {

    const numero =
        Number(
            altura
        );


    if (
        !Number.isFinite(
            numero
        )
    ) {

        return "--";

    }


    return (
        numero.toFixed(2) +
        " m"
    );

}


// ======================================================
// HORÁRIO
// ======================================================

function formatarHora(
    data
) {

    if (!data) {

        return "--:--";

    }


    const resultado =
        new Date(
            data
        );


    if (
        Number.isNaN(
            resultado.getTime()
        )
    ) {

        return "--:--";

    }


    return resultado.toLocaleTimeString(
        "pt-BR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ======================================================
// DIAGNÓSTICO
// ======================================================

export function diagnosticoStormglass() {

    return {

        apiConfigurada:
            Boolean(API_KEY),

        tamanhoChave:
            API_KEY
                ? API_KEY.length
                : 0,

        parametros:
            PARAMS,

        mare:
            "Stormglass Tide Extremes"

    };

}


// ======================================================

console.log(
    "🌊 Stormglass 5.0 carregado."
);