// =====================================
// TIMELINE PREMIUM
// WaveRise 3.0
// =====================================

export function atualizarTimeline(hours = []) {

    const container = document.getElementById("timelineSurf");

    if (!container) return;

    container.innerHTML = "";

    if (!hours.length) {

        container.innerHTML =
            "<p>Nenhuma previsão disponível.</p>";

        return;

    }

    hours.slice(0, 12).forEach(hora => {

        const onda = valor(hora.waveHeight);

        const swell = valor(hora.swellHeight);

        const vento = valor(hora.windSpeed);

        const periodo = valor(hora.wavePeriod);

        const horario = new Date(hora.time);

        const score = calcularScore(

            onda,

            periodo,

            vento

        );

        const card = document.createElement("div");

        card.className = "timelineCard";

        card.innerHTML = `

<div class="timelineHora">

${horario.toLocaleTimeString("pt-BR",{

hour:"2-digit",

minute:"2-digit"

})}

</div>

<div class="timelineIcon">

🌊

</div>

<div class="timelineOnda">

${onda.toFixed(1)} m

</div>

<div class="timelineSwell">

Swell ${swell.toFixed(1)} m

</div>

<div class="timelinePeriodo">

⏱ ${periodo.toFixed(0)} s

</div>

<div class="timelineVento">

💨 ${(vento*3.6).toFixed(0)} km/h

</div>

<div class="timelineScore ${classe(score)}">

⭐ ${score}

</div>

`;

        container.appendChild(card);

    });

}

// =====================================

function valor(obj){

    if(!obj) return 0;

    const ordem=[

        "sg",

        "noaa",

        "icon",

        "dwd",

        "meteo",

        "smhi"

    ];

    for(const fonte of ordem){

        if(obj[fonte]!=null)

            return obj[fonte];

    }

    return Object.values(obj)[0] ?? 0;

}

// =====================================

function calcularScore(

onda,

periodo,

vento

){

let score=60;

if(onda>=0.8 && onda<=2.2)
score+=15;

if(periodo>=10)
score+=15;

if(vento<5)
score+=10;

return Math.min(score,100);

}

// =====================================

function classe(score){

if(score>=90)
return "excelente";

if(score>=75)
return "bom";

return "regular";

}