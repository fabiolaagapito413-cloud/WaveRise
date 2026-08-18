// =====================================
// SURF SCORE PREMIUM
// WaveRise 3.0
// =====================================

export function calcularSurfScore(dados){

    let score = 50;

    // -----------------------------
    // Altura da onda
    // -----------------------------

    if(dados.onda>=0.8 && dados.onda<=2.0)
        score+=20;

    else if(dados.onda>=0.5)
        score+=10;

    // -----------------------------
    // Período
    // -----------------------------

    if(dados.periodo>=12)
        score+=18;

    else if(dados.periodo>=10)
        score+=12;

    // -----------------------------
    // Vento
    // -----------------------------

    if(dados.vento<4)
        score+=12;

    else if(dados.vento<6)
        score+=8;

    // -----------------------------
    // Tipo do vento
    // -----------------------------

    if(dados.tipoVento.includes("Terral"))
        score+=10;

    if(dados.tipoVento.includes("Maral"))
        score-=10;

    // -----------------------------
    // Swell
    // -----------------------------

    if(dados.swell>=1)
        score+=8;

    // -----------------------------

    score=Math.max(0,Math.min(score,100));

    return{

        score,

        estrelas:estrelas(score),

        nivel:nivel(score),

        cor:cor(score)

    };

}

// =====================================

function estrelas(score){

    if(score>=90) return "★★★★★";

    if(score>=75) return "★★★★☆";

    if(score>=60) return "★★★☆☆";

    if(score>=45) return "★★☆☆☆";

    return "★☆☆☆☆";

}

// =====================================

function nivel(score){

    if(score>=90) return "Excelente";

    if(score>=75) return "Muito Bom";

    if(score>=60) return "Bom";

    if(score>=45) return "Regular";

    return "Ruim";

}

// =====================================

function cor(score){

    if(score>=90) return "#00D26A";

    if(score>=75) return "#FFD54A";

    if(score>=60) return "#FF9800";

    return "#FF5A5A";

}