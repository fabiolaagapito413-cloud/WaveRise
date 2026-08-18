// ======================================================
// WaveRise 3.0
// Home Premium
// ======================================================

console.log("🌊 WaveRise iniciado");

// ======================================================
// ELEMENTOS
// ======================================================

const saudacao = document.getElementById("saudacao");
const fraseDia = document.getElementById("fraseDia");

const homeScore = document.getElementById("homeScore");
const scoreTexto = document.getElementById("scoreTexto");

const homeOnda = document.getElementById("homeOnda");
const homeVento = document.getElementById("homeVento");
const homePraia = document.getElementById("homePraia");

const nivelHome = document.getElementById("nivelHome");
const barraXP = document.getElementById("barraXP");
const xpTexto = document.getElementById("xpTexto");

const homeCoach = document.getElementById("homeCoach");

const ultimaPraia = document.getElementById("ultimaPraia");
const ultimaPrancha = document.getElementById("ultimaPrancha");
const ultimaNota = document.getElementById("ultimaNota");
const ultimaData = document.getElementById("ultimaData");

const favoritosHome = document.getElementById("favoritosHome");

const totalSessoes = document.getElementById("totalSessoes");
const totalOndas = document.getElementById("totalOndas");
const tempoTotal = document.getElementById("tempoTotal");
const totalConquistas = document.getElementById("totalConquistas");

const condOnda = document.getElementById("condOnda");
const condVento = document.getElementById("condVento");
const condAgua = document.getElementById("condAgua");
const condScore = document.getElementById("condScore");

const praiaDestaque = document.getElementById("praiaDestaque");
const condicaoPraia = document.getElementById("condicaoPraia");
const praiaScore = document.getElementById("praiaScore");

// ======================================================
// DADOS
// ======================================================

const perfil =
    JSON.parse(localStorage.getItem("perfilWaveRise")) || {};

const historico =
    JSON.parse(localStorage.getItem("historicoSurfWaveRise")) || [];

const favoritos =
    JSON.parse(localStorage.getItem("praiasFavoritasWaveRise")) || [];

const marHoje =
    JSON.parse(localStorage.getItem("marHojeWaveRise")) || null;

const nome = perfil.nome || "Surfista";

// ======================================================
// SAUDAÇÃO
// ======================================================

const hora = new Date().getHours();

let saudacaoTexto = "Olá";

if (hora >= 5 && hora < 12) {
    saudacaoTexto = "Bom dia";
} else if (hora >= 12 && hora < 18) {
    saudacaoTexto = "Boa tarde";
} else {
    saudacaoTexto = "Boa noite";
}

if (saudacao) {
    saudacao.textContent =
        `${saudacaoTexto}, ${nome}! 👋`;
}

// ======================================================
// FRASE DO DIA
// ======================================================

const frases = [
    "🌊 O mar recompensa quem nunca desiste.",
    "🏄 Toda onda é uma oportunidade para evoluir.",
    "🔥 Grandes surfistas treinam todos os dias.",
    "💙 Respeite o mar e ele sempre ensinará algo novo.",
    "🌅 Cada sessão é um novo começo."
];

if (fraseDia) {
    fraseDia.textContent =
        frases[Math.floor(Math.random() * frases.length)];
}

// ======================================================
// ESTATÍSTICAS
// ======================================================

let xp = 0;
let ondas = 0;
let horas = 0;
let melhorNota = 0;

historico.forEach(sessao => {

    const qtdOndas = Number(sessao.ondas) || 0;
    const tempo = parseFloat(sessao.tempo) || 0;
    const nota = Number(sessao.nota) || 0;

    ondas += qtdOndas;
    horas += tempo;

    xp += 50;
    xp += qtdOndas * 5;
    xp += tempo * 20;

    if (nota > melhorNota) {
        melhorNota = nota;
    }
});

// ======================================================
// NÍVEL
// ======================================================

let nivel = 1;

if (xp >= 500) nivel = 2;
if (xp >= 1200) nivel = 3;
if (xp >= 2200) nivel = 4;
if (xp >= 3500) nivel = 5;
if (xp >= 5000) nivel = 6;
if (xp >= 7000) nivel = 7;
if (xp >= 9000) nivel = 8;
if (xp >= 12000) nivel = 9;
if (xp >= 15000) nivel = 10;

if (nivelHome) {
    nivelHome.textContent = nivel;
}

// ======================================================
// XP
// ======================================================

const xpNivel = 15000;

const porcentagem =
    Math.min((xp / xpNivel) * 100, 100);

if (barraXP) {

    barraXP.style.width =
        porcentagem + "%";

    if (porcentagem < 30) {

        barraXP.style.background =
            "linear-gradient(90deg,#29b6f6,#4fc3f7)";

    } else if (porcentagem < 70) {

        barraXP.style.background =
            "linear-gradient(90deg,#43a047,#66bb6a)";

    } else {

        barraXP.style.background =
            "linear-gradient(90deg,#ffb300,#ffd54f)";
    }
}

if (xpTexto) {
    xpTexto.textContent =
        `${Math.round(xp)} / ${xpNivel} XP`;
}

// ======================================================
// ESTATÍSTICAS
// ======================================================

if (totalSessoes) {
    totalSessoes.textContent =
        historico.length;
}

if (totalOndas) {
    totalOndas.textContent =
        ondas;
}

if (tempoTotal) {
    tempoTotal.textContent =
        horas.toFixed(1) + " h";
}

if (totalConquistas) {

    let conquistas = 0;

    if (historico.length >= 10) conquistas++;
    if (historico.length >= 25) conquistas++;
    if (historico.length >= 50) conquistas++;
    if (xp >= 5000) conquistas++;

    totalConquistas.textContent =
        conquistas;
}

// ======================================================
// ÚLTIMA SESSÃO
// ======================================================

if (historico.length) {

    const ultima =
        historico[historico.length - 1];

    if (ultimaPraia) {
        ultimaPraia.textContent =
            ultima.praia || "--";
    }

    if (ultimaPrancha) {
        ultimaPrancha.textContent =
            ultima.prancha || "--";
    }

    if (ultimaNota) {
        ultimaNota.textContent =
            ultima.nota || "--";
    }

    if (ultimaData) {
        ultimaData.textContent =
            ultima.data || "--";
    }

} else {

    if (ultimaPraia) {
        ultimaPraia.textContent =
            "Nenhuma sessão registrada";
    }
}

// ======================================================
// FAVORITOS
// ======================================================

if (favoritosHome) {

    if (!favoritos.length) {

        favoritosHome.innerHTML =
            "<p>❤️ Nenhuma praia favoritada.</p>";

    } else {

        favoritosHome.innerHTML = "";

        favoritos.forEach(praia => {

            favoritosHome.innerHTML += `
                <div class="favoritoHome">
                    🌊 ${praia.nome}
                </div>
            `;
        });
    }
}

// ======================================================
// MAR DE HOJE
// ======================================================

if (marHoje) {

    if (homePraia) {
        homePraia.textContent =
            marHoje.praia || "--";
    }

    if (homeOnda) {
        homeOnda.textContent =
            `${Number(marHoje.onda || 0).toFixed(1)} m`;
    }

    if (homeVento) {
        homeVento.textContent =
            `${(Number(marHoje.vento || 0) * 3.6).toFixed(0)} km/h`;
    }

    if (homeScore) {
        homeScore.textContent =
            marHoje.score ?? "--";
    }

    if (scoreTexto) {
        scoreTexto.textContent =
            marHoje.condicao || "Condições disponíveis";
    }

    if (condOnda) {
        condOnda.textContent =
            `${Number(marHoje.onda || 0).toFixed(1)} m`;
    }

    if (condVento) {
        condVento.textContent =
            `${(Number(marHoje.vento || 0) * 3.6).toFixed(0)} km/h`;
    }

    if (condAgua) {
        condAgua.textContent =
            `${Number(marHoje.agua || 0).toFixed(1)} °C`;
    }

    if (condScore) {
        condScore.textContent =
            marHoje.score ?? "--";
    }

    if (praiaDestaque) {
        praiaDestaque.textContent =
            marHoje.praia || "--";
    }

    if (condicaoPraia) {
        condicaoPraia.textContent =
            marHoje.condicao || "--";
    }

    if (praiaScore) {
        praiaScore.textContent =
            marHoje.score ?? "--";
    }

    // ==================================================
    // COACH IA
    // ==================================================

    if (homeCoach) {

        const score =
            Number(marHoje.score) || 0;

        if (score >= 90) {

            homeCoach.innerHTML = `
                🌊 <strong>Condições excelentes!</strong><br><br>
                🏄 Praia: ${marHoje.praia}<br>
                ⭐ Surf Score: ${score}<br>
                🕒 ${marHoje.horario || "--"}<br><br>
                Aproveite o mar hoje!
            `;

        } else if (score >= 70) {

            homeCoach.innerHTML = `
                🏄 <strong>Boas condições para o surf.</strong><br><br>
                🌊 Praia: ${marHoje.praia}<br>
                ⭐ Surf Score: ${score}<br><br>
                Vale a pena entrar no mar.
            `;

        } else {

            homeCoach.innerHTML = `
                💨 <strong>Condições fracas hoje.</strong><br><br>
                ⭐ Surf Score: ${score}<br><br>
                Talvez seja um bom dia para treinar técnica ou preparar os equipamentos.
            `;
        }
    }

} else {

    if (homePraia) {
        homePraia.textContent =
            "Pesquise uma praia";
    }

    if (homeOnda) {
        homeOnda.textContent =
            "--";
    }

    if (homeVento) {
        homeVento.textContent =
            "--";
    }

    if (homeScore) {
        homeScore.textContent =
            "--";
    }

    if (scoreTexto) {
        scoreTexto.textContent =
            "Abra o Mar Premium e pesquise uma praia.";
    }

    if (homeCoach) {

        homeCoach.innerHTML = `
            👋 Bem-vindo ao WaveRise!<br><br>
            Pesquise uma praia no Mar Premium para receber recomendações do Coach IA.
        `;
    }
}

console.log("✅ Home Premium carregada.");

// ======================================================
// NAVEGAÇÃO
// ======================================================

function abrirPagina(caminho) {
    window.location.href = caminho;
}

// ======================================================
// BOTÕES DA HOME
// ======================================================

document
    .getElementById("abrirMar")
    ?.addEventListener("click", () => {
        abrirPagina("pages/mar.html");
    });

document
    .getElementById("abrirDiario")
    ?.addEventListener("click", () => {
        abrirPagina("pages/diario.html");
    });

document
    .getElementById("abrirCoach")
    ?.addEventListener("click", () => {
        abrirPagina("pages/coach.html");
    });

document
    .getElementById("abrirPerfil")
    ?.addEventListener("click", () => {
        abrirPagina("pages/perfil.html");
    });

document
    .getElementById("abrirConquistas")
    ?.addEventListener("click", () => {
        abrirPagina("pages/conquistas.html");
    });

document
    .getElementById("abrirEvolucao")
    ?.addEventListener("click", () => {
        abrirPagina("pages/evolucao.html");
    });

// ======================================================
// ATALHOS
// ======================================================

document
    .getElementById("btnMar")
    ?.addEventListener("click", () => {
        abrirPagina("pages/mar.html");
    });

document
    .getElementById("btnDiario")
    ?.addEventListener("click", () => {
        abrirPagina("pages/diario.html");
    });

document
    .getElementById("btnPranchas")
    ?.addEventListener("click", () => {
        abrirPagina("pages/pranchas.html");
    });

document
    .getElementById("btnCoach")
    ?.addEventListener("click", () => {
        abrirPagina("pages/coach.html");
    });

document
    .getElementById("btnPerfil")
    ?.addEventListener("click", () => {
        abrirPagina("pages/perfil.html");
    });