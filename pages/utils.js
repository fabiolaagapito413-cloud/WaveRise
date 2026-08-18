// =====================================
// UTILIDADES - WaveRise 2.0
// =====================================

// -------------------------------------
// VENTO
// -------------------------------------

export function classificarVento(direcao) {

    if (direcao == null) return "🌬 Sem dados";

    direcao = ((direcao % 360) + 360) % 360;

    if (direcao >= 225 && direcao <= 315)
        return "🌬 Terral";

    if (direcao >= 45 && direcao <= 135)
        return "🌬 Maral";

    return "🌬 Lateral";

}

// -------------------------------------
// SURF SCORE
// -------------------------------------

export function calcularNota(onda, periodo, vento, tipo) {

    let nota = 0;

    // Onda
    if (onda >= 0.8 && onda <= 1.5)
        nota += 3;
    else if (onda > 1.5 && onda <= 2.5)
        nota += 2.5;
    else if (onda >= 0.5)
        nota += 1;

    // Período
    if (periodo >= 14)
        nota += 3;
    else if (periodo >= 11)
        nota += 2;
    else if (periodo >= 8)
        nota += 1;

    // Vento
    if (vento < 3)
        nota += 2;
    else if (vento < 6)
        nota += 1;

    // Tipo de vento
    if (tipo.includes("Terral"))
        nota += 2;
    else if (tipo.includes("Lateral"))
        nota += 1;
    else
        nota -= 1;

    nota = Math.max(0, Math.min(10, nota));

    return Number(nota.toFixed(1));

}

// -------------------------------------
// CONDIÇÃO
// -------------------------------------

export function gerarCondicao(nota) {

    if (nota >= 9)
        return "🔥 Excelente para surfar";

    if (nota >= 8)
        return "🟢 Condições muito boas";

    if (nota >= 6)
        return "🌊 Boas condições";

    if (nota >= 4)
        return "🟡 Condições regulares";

    return "🔴 Condições ruins";

}

// -------------------------------------
// PRANCHA
// -------------------------------------

export function recomendarPrancha(onda) {

    if (onda < 0.6)
        return "🏄 Longboard";

    if (onda < 1.2)
        return "🏄 Funboard";

    if (onda < 2.0)
        return "🏄 Shortboard";

    if (onda < 3.0)
        return "🏄 Step-up";

    return "🏄 Gun";

}

// -------------------------------------
// HORÁRIO
// -------------------------------------

export function analisarHorario(nota, vento, tipo) {

    if (nota >= 9)
        return "🌅 Nas primeiras horas da manhã";

    if (tipo.includes("Terral") && vento < 5)
        return "🌅 Manhã";

    if (tipo.includes("Lateral"))
        return "🌤 Início da manhã";

    if (tipo.includes("Maral"))
        return "🌇 Final da tarde";

    return "⏰ Acompanhe a mudança do vento";

}

// -------------------------------------
// FORMATADORES
// -------------------------------------

export function formatarTemperatura(valor) {

    if (valor == null) return "--";

    return `${valor.toFixed(1)} °C`;

}

export function formatarOnda(valor) {

    if (valor == null) return "--";

    return `${valor.toFixed(1)} m`;

}

export function formatarPeriodo(valor) {

    if (valor == null) return "--";

    return `${valor.toFixed(0)} s`;

}

export function formatarVento(valor) {

    if (valor == null) return "--";

    return `${(valor * 3.6).toFixed(1)} km/h`;

}