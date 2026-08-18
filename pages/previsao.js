// =====================================
// PREVISÃO - WaveRise 2.0
// =====================================

export async function buscarPrevisao(latitude, longitude) {

    try {

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

        const resposta = await fetch(url);

        if (!resposta.ok) {

            throw new Error("Erro ao buscar previsão.");

        }

        const dados = await resposta.json();

        mostrarPrevisao(dados.daily);

    }

    catch (erro) {

        console.error(erro);

        const container =
            document.getElementById("previsao7dias");

        if (container) {

            container.innerHTML =
                "<p>Não foi possível carregar a previsão.</p>";

        }

    }

}

// =====================================

function mostrarPrevisao(daily) {

    const container =
        document.getElementById("previsao7dias");

    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < daily.time.length; i++) {

        const data = formatarData(daily.time[i]);

        const max =
            Math.round(daily.temperature_2m_max[i]);

        const min =
            Math.round(daily.temperature_2m_min[i]);

        const chuva =
            daily.precipitation_probability_max[i];

        const vento =
            Math.round(daily.wind_speed_10m_max[i]);

        const score =
            calcularScore(vento, chuva);

        const card =
            document.createElement("div");

        card.className = "diaPrevisao";

        card.innerHTML = `

            <h3>${data}</h3>

            <p>🌡 <strong>${max}° / ${min}°</strong></p>

            <p>💨 ${vento} km/h</p>

            <p>🌧 ${chuva}%</p>

            <p>⭐ Surf Score: ${score}</p>

        `;

        container.appendChild(card);

    }

}

// =====================================

function calcularScore(vento, chuva) {

    let nota = 100;

    nota -= vento * 2;

    nota -= chuva * 0.3;

    nota = Math.max(20, Math.min(100, Math.round(nota)));

    return nota;

}

// =====================================

function formatarData(dataISO) {

    const data = new Date(dataISO);

    return data.toLocaleDateString("pt-BR", {

        weekday: "short",

        day: "2-digit",

        month: "2-digit"

    });

}

console.log("📅 Previsão carregada.");
// =====================================
// SOL
// =====================================

export async function buscarSol(latitude, longitude){

    const url =
`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&timezone=auto`;

    const resposta = await fetch(url);

    if(!resposta.ok){

        throw new Error("Erro ao buscar nascer e pôr do sol.");

    }

    const dados = await resposta.json();

    return{

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

// =====================================

function formatarHora(data){

    return new Date(data)

    .toLocaleTimeString(

        "pt-BR",

        {

            hour:"2-digit",

            minute:"2-digit"

        }

    );

}