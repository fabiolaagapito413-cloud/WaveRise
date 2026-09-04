// =====================================
// PREVISÃO - WaveRise
// =====================================

import { calcularSurfScore } from "./score.js";


// =====================================
// BUSCAR PREVISÃO
// =====================================

export async function buscarPrevisao(latitude, longitude) {

    const container =
        document.getElementById("previsao7dias");

    try {

        if (
            !Number.isFinite(Number(latitude)) ||
            !Number.isFinite(Number(longitude))
        ) {

            throw new Error(
                "Latitude ou longitude inválida."
            );

        }


        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${encodeURIComponent(latitude)}` +
            `&longitude=${encodeURIComponent(longitude)}` +
            `&daily=` +
            `temperature_2m_max,` +
            `temperature_2m_min,` +
            `precipitation_probability_max,` +
            `wind_speed_10m_max` +
            `&timezone=auto`;


        const resposta =
            await fetch(url);


        if (!resposta.ok) {

            throw new Error(
                `Open-Meteo ${resposta.status}`
            );

        }


        const dados =
            await resposta.json();


        if (
            !dados.daily ||
            !dados.daily.time
        ) {

            throw new Error(
                "Previsão diária não encontrada."
            );

        }


        mostrarPrevisao(
            dados.daily
        );


        console.log(
            "📅 Previsão de 7 dias carregada."
        );


        return dados;


    }

    catch (erro) {

        console.error(
            "❌ Erro na previsão:",
            erro
        );


        if (container) {

            container.innerHTML = `
                <p>
                    Não foi possível carregar
                    a previsão.
                </p>
            `;

        }


        return null;

    }

}


// =====================================
// MOSTRAR PREVISÃO
// =====================================

function mostrarPrevisao(daily) {

    const container =
        document.getElementById(
            "previsao7dias"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const totalDias =
        daily.time.length;


    for (
        let i = 0;
        i < totalDias;
        i++
    ) {

        const data =
            formatarData(
                daily.time[i]
            );


        const max =
            numero(
                daily.temperature_2m_max?.[i]
            );


        const min =
            numero(
                daily.temperature_2m_min?.[i]
            );


        const chuva =
            numero(
                daily.precipitation_probability_max?.[i]
            );


        const vento =
            numero(
                daily.wind_speed_10m_max?.[i]
            );


        const score =
            calcularScore(
                vento,
                chuva
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "diaPrevisao";


        card.innerHTML = `

            <h3>
                ${data}
            </h3>

            <p>
                🌡
                <strong>
                    ${max}° / ${min}°
                </strong>
            </p>

            <p>
                💨
                ${vento} km/h
            </p>

            <p>
                🌧
                ${chuva}%
            </p>

            <p>
                ⭐ Surf Score:
                <strong>
                    ${score}
                </strong>
            </p>

        `;


        container.appendChild(
            card
        );

    }

}


// =====================================
// SCORE DA PREVISÃO
// =====================================
//
// Aqui usamos a mesma lógica-base
// do WaveRise, mas como a previsão
// diária do Open-Meteo não fornece
// onda/swell, usamos apenas os dados
// disponíveis: vento e chuva.
//
// O Score real do Mar continua vindo
// da Stormglass.
// =====================================

function calcularScore(
    ventoKmH,
    chuva
) {

    let nota = 100;


    // Vento forte reduz a nota.

    nota -=
        ventoKmH * 2;


    // Chuva tem peso menor.

    nota -=
        chuva * 0.3;


    // Mantém entre 20 e 100.

    nota =
        Math.max(
            20,
            Math.min(
                100,
                Math.round(nota)
            )
        );


    return nota;

}


// =====================================
// CONVERTER NÚMERO
// =====================================

function numero(valor) {

    const resultado =
        Number(valor);


    if (
        Number.isFinite(resultado)
    ) {

        return resultado;

    }


    return 0;

}


// =====================================
// FORMATAR DATA
// =====================================

function formatarData(dataISO) {

    if (!dataISO) {

        return "--";

    }


    // O Open-Meteo devolve YYYY-MM-DD.
    // Usamos a data como local para evitar
    // problemas de mudança de dia por UTC.

    const partes =
        dataISO.split("-");


    if (
        partes.length !== 3
    ) {

        return dataISO;

    }


    const ano =
        Number(partes[0]);

    const mes =
        Number(partes[1]);

    const dia =
        Number(partes[2]);


    const data =
        new Date(
            ano,
            mes - 1,
            dia
        );


    return data.toLocaleDateString(
        "pt-BR",
        {
            weekday: "short",
            day: "2-digit",
            month: "2-digit"
        }
    );

}


// =====================================
// SOL
// =====================================

export async function buscarSol(
    latitude,
    longitude
) {

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${encodeURIComponent(latitude)}` +
        `&longitude=${encodeURIComponent(longitude)}` +
        `&daily=sunrise,sunset` +
        `&timezone=auto`;


    try {

        const resposta =
            await fetch(url);


        if (!resposta.ok) {

            throw new Error(
                `Open-Meteo ${resposta.status}`
            );

        }


        const dados =
            await resposta.json();


        if (
            !dados.daily ||
            !dados.daily.sunrise ||
            !dados.daily.sunset
        ) {

            throw new Error(
                "Dados de Sol não encontrados."
            );

        }


        return {

            nascer:
                formatarHora(
                    dados.daily.sunrise[0]
                ),

            por:
                formatarHora(
                    dados.daily.sunset[0]
                )

        };


    }

    catch (erro) {

        console.error(
            "❌ Erro ao buscar Sol:",
            erro
        );


        throw erro;

    }

}


// =====================================
// FORMATAR HORA
// =====================================

function formatarHora(data) {

    if (!data) {

        return "--:--";

    }


    const resultado =
        new Date(data);


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


// =====================================

console.log(
    "📅 Previsão WaveRise carregada."
);