// =====================================
// LUA - WaveRise
// =====================================

export function calcularLua(data = new Date()) {

    let ano = data.getFullYear();
    let mes = data.getMonth() + 1;
    const dia = data.getDate();

    let c = 0;
    let e = 0;
    let jd = 0;
    let fase = 0;

    if (mes < 3) {
        ano--;
        mes += 12;
    }

    mes++;

    c = Math.floor(365.25 * ano);
    e = Math.floor(30.6 * mes);

    jd = c + e + dia - 694039.09;
    jd /= 29.5305882;

    fase = Math.floor(jd);

    jd -= fase;

    fase = Math.round(jd * 8);

    if (fase >= 8) fase = 0;

    const fases = [
        "🌑 Lua Nova",
        "🌒 Lua Crescente",
        "🌓 Quarto Crescente",
        "🌔 Gibosa Crescente",
        "🌕 Lua Cheia",
        "🌖 Gibosa Minguante",
        "🌗 Quarto Minguante",
        "🌘 Lua Minguante"
    ];

    return fases[fase];

}

console.log("🌙 Lua carregada.");