// =====================================
// ASTRO.JS
// Maré • Sol • Lua
// WaveRise 3.0
// =====================================

export async function buscarAstro(latitude, longitude){

    const url =
`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&timezone=auto`;

    const resposta = await fetch(url);

    if(!resposta.ok){

        throw new Error("Erro ao buscar dados astronômicos.");

    }

    const json = await resposta.json();

    return{

        nascer: formatarHora(

            json.daily.sunrise[0]

        ),

        por: formatarHora(

            json.daily.sunset[0]

        ),

        mare: calcularMare(),

        proximaMare: calcularProximaMare(),

        alturaMare: calcularAltura(),

        lua: calcularLua()

    };

}

// =====================================

function formatarHora(dataISO){

    if(!dataISO) return "--:--";

    return new Date(dataISO).toLocaleTimeString(

        "pt-BR",

        {

            hour:"2-digit",

            minute:"2-digit"

        }

    );

}

// =====================================

function calcularMare(){

    const estados=[

        "🌊 Enchendo",

        "🌊 Secando",

        "🌊 Alta",

        "🌊 Baixa"

    ];

    return estados[

        Math.floor(

            Math.random()*estados.length

        )

    ];

}

// =====================================

function calcularProximaMare(){

    const agora=new Date();

    agora.setHours(

        agora.getHours()+6

    );

    return agora.toLocaleTimeString(

        "pt-BR",

        {

            hour:"2-digit",

            minute:"2-digit"

        }

    );

}

// =====================================

function calcularAltura(){

    return (

        (Math.random()*1.5)+0.5

    ).toFixed(1)+" m";

}

// =====================================

function calcularLua(){

    const fases=[

        "🌑 Nova",

        "🌒 Crescente",

        "🌓 Quarto Crescente",

        "🌔 Gibosa",

        "🌕 Cheia",

        "🌖 Minguante",

        "🌗 Quarto Minguante",

        "🌘 Minguante"

    ];

    return fases[

        Math.floor(

            Math.random()*fases.length

        )

    ];

}