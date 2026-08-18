// ===========================================
// WAVERISE COACH IA 5.0
// ===========================================

// Backend
const API = "http://192.168.0.10:3000";

// ===========================================
// ELEMENTOS
// ===========================================

// Coach
const coachTexto = document.getElementById("coachTexto");
const notaGrande = document.getElementById("notaGrande");
const condicaoMar = document.getElementById("condicaoMar");
const relatorioIA = document.getElementById("relatorioIA");

// Foto
const fotoInput = document.getElementById("fotoSurf");
const btnFoto = document.getElementById("analisarFoto");
const resultadoFoto = document.getElementById("resultadoFoto");

// Vídeo
const videoInput = document.getElementById("videoSurf");
const btnVideo = document.getElementById("analisarVideo");
const resultadoVideo = document.getElementById("resultadoVideo");

// ===========================================
// VARIÁVEIS
// ===========================================

let fotoSelecionada = null;
let videoSelecionado = null;

// ===========================================
// INICIAR
// ===========================================

window.addEventListener("DOMContentLoaded", iniciarCoach);

function iniciarCoach() {

    console.log("🤖 WaveRise Coach IA iniciado");

    configurarFoto();
    configurarVideo();
    atualizarMensagemInicial();
    atualizarNivel();

}

// ===========================================

function atualizarMensagemInicial() {

    if (!coachTexto) return;

    coachTexto.innerHTML = `
        👋 <strong>Bem-vindo ao WaveRise Coach IA</strong>

        <br><br>

        Envie uma foto ou um vídeo da sua sessão.

        <br><br>

        A IA fará uma análise completa da sua técnica.
    `;

}

// ===========================================

export function atualizarCoach(dados) {

    if (!coachTexto) return;

    coachTexto.innerHTML = gerarCoach(dados);

}

// ===========================================

function gerarCoach(d) {

    let texto = "";

    if (d.nota >= 9) {

        texto += "🔥 Excelente dia para surfar.<br><br>";

    } else if (d.nota >= 7) {

        texto += "🌊 Boas condições para uma sessão.<br><br>";

    } else if (d.nota >= 5) {

        texto += "🙂 Mar surfável.<br><br>";

    } else {

        texto += "⚠️ Condições fracas.<br><br>";

    }

    texto += `
        🌊 Onda: <strong>${d.onda.toFixed(1)} m</strong><br>
        🌊 Swell: <strong>${d.swell.toFixed(1)} m</strong><br>
        💨 Vento: <strong>${(d.vento * 3.6).toFixed(0)} km/h</strong><br>
        🏄 Prancha: <strong>${d.prancha}</strong><br>
    `;

    return texto;

}

// ===========================================

export function atualizarNota(dados) {

    if (notaGrande) {
        notaGrande.textContent = Math.round(dados.nota * 10);
    }

    if (condicaoMar) {
        condicaoMar.textContent = dados.condicao;
    }

}
// ===========================================
// FOTO IA
// ===========================================

function configurarFoto() {

    if (!fotoInput || !btnFoto) return;

    fotoInput.addEventListener("change", selecionarFoto);
    btnFoto.addEventListener("click", enviarFoto);

}

// ===========================================

function selecionarFoto() {

    if (!fotoInput.files.length) return;

    fotoSelecionada = fotoInput.files[0];

    mostrarPreviewFoto();

}

// ===========================================

function mostrarPreviewFoto() {

    if (!fotoSelecionada) return;

    const tamanho = (fotoSelecionada.size / 1024 / 1024).toFixed(2);

    const leitor = new FileReader();

    leitor.onload = (e) => {

        resultadoFoto.innerHTML = `
            <img
                src="${e.target.result}"
                class="previewFoto">

            <br><br>

            <strong>${fotoSelecionada.name}</strong>

            <br>

            ${tamanho} MB

            <br><br>

            Clique novamente em

            <strong>🤖 Analisar Foto</strong>
        `;

    };

    leitor.readAsDataURL(fotoSelecionada);

}

// ===========================================

async function enviarFoto() {

    alert(API);

    if (!fotoSelecionada) {

        fotoInput.click();
        return;

    }

    mostrarCarregamentoFoto();

    const formData = new FormData();

    formData.append("foto", fotoSelecionada);

    try {

        const resposta = await fetch(`${API}/coach/foto`, {
            method: "POST",
            body: formData
        });

        const dados = await resposta.json();

        if (!dados.sucesso) {
            throw new Error(dados.erro);
        }

        mostrarResultadoFoto(dados);

    } catch (erro) {

        console.error(erro);

        resultadoFoto.innerHTML = `
            ❌ Erro

            <br><br>

            ${erro.message}
        `;

    }

}

// ===========================================

function mostrarCarregamentoFoto() {

    resultadoFoto.innerHTML = `
        🤖 Enviando foto...

        <br><br>

        <div class="barraUpload">
            <div class="barraUploadInterna"></div>
        </div>

        <br>

        Aguarde alguns segundos...
    `;

}

// ===========================================

function mostrarResultadoFoto(dados) {

    resultadoFoto.innerHTML = `
        ✅ Foto analisada.
    `;

    atualizarRelatorioIA(dados.analise);

    salvarHistorico(dados.analise);

    atualizarNivel();

}
// ===========================================
// VÍDEO IA
// ===========================================

function configurarVideo() {

    if (!videoInput || !btnVideo) return;

    videoInput.addEventListener("change", selecionarVideo);
    btnVideo.addEventListener("click", enviarVideo);

}

// ===========================================

function selecionarVideo() {

    if (!videoInput.files.length) return;

    videoSelecionado = videoInput.files[0];

    mostrarPreviewVideo();

}

// ===========================================

function mostrarPreviewVideo() {

    if (!videoSelecionado) return;

    const tamanho = (videoSelecionado.size / 1024 / 1024).toFixed(2);

    const url = URL.createObjectURL(videoSelecionado);

    resultadoVideo.innerHTML = `
        <video controls class="previewVideo">
            <source src="${url}">
        </video>

        <br><br>

        <strong>${videoSelecionado.name}</strong>

        <br>

        ${tamanho} MB

        <br><br>

        Clique novamente em

        <strong>🎥 Analisar Vídeo</strong>
    `;

}

// ===========================================

async function enviarVideo() {

    if (!videoSelecionado) {

        videoInput.click();
        return;

    }

    mostrarCarregamentoVideo();

    const formData = new FormData();

    formData.append("video", videoSelecionado);

    try {

        const resposta = await fetch(`${API}/coach/video`, {
            method: "POST",
            body: formData
        });

        const dados = await resposta.json();

        if (!dados.sucesso) {
            throw new Error(dados.erro);
        }

        mostrarResultadoVideo(dados);

    } catch (erro) {

        console.error(erro);

        resultadoVideo.innerHTML = `
            ❌ Erro

            <br><br>

            ${erro.message}
        `;

    }

}

// ===========================================

function mostrarCarregamentoVideo() {

    resultadoVideo.innerHTML = `
        🎥 Enviando vídeo...

        <br><br>

        <div class="barraUpload">
            <div class="barraUploadInterna"></div>
        </div>

        <br>

        Aguarde alguns segundos...
    `;

}

// ===========================================

function mostrarResultadoVideo(dados) {

    resultadoVideo.innerHTML = `
        ✅ Vídeo analisado.
    `;

    atualizarRelatorioIA(dados.analise);

    salvarHistorico(dados.analise);

    atualizarNivel();

}
// ===========================================
// RELATÓRIO IA
// ===========================================

function atualizarRelatorioIA(analise) {

    if (!relatorioIA || !analise) return;

    relatorioIA.innerHTML = `

        <div class="cardIA">

            <h2>🤖 Coach IA</h2>

            <br>

            <div class="notaIA">
                ⭐ ${analise.nota ?? "--"}/100
            </div>

            <br>

            <h2>🏄 ${analise.manobra ?? "Manobra não identificada"}</h2>

            <br>

            <h3>✅ Pontos Fortes</h3>

            <ul>
                ${(analise.pontosFortes || [])
                    .map(item => `<li>${item}</li>`)
                    .join("")}
            </ul>

            <br>

            <h3>⚠️ Pontos para Melhorar</h3>

            <ul>
                ${(analise.melhorias || [])
                    .map(item => `<li>${item}</li>`)
                    .join("")}
            </ul>

            <br>

            <h3>🎯 Próximo Treino</h3>

            <p>
                ${analise.treino || "Continue treinando regularmente."}
            </p>

        </div>

    `;

}

// ===========================================
// HISTÓRICO
// ===========================================

function salvarHistorico(analise) {

    if (!analise) return;

    let historico =
        JSON.parse(localStorage.getItem("historicoCoach")) || [];

    historico.unshift({

        data: new Date().toLocaleString(),

        analise

    });

    if (historico.length > 30) {

        historico.pop();

    }

    localStorage.setItem(

        "historicoCoach",

        JSON.stringify(historico)

    );

}

// ===========================================
// XP / NÍVEL
// ===========================================

function atualizarNivel() {

    const historico =
        JSON.parse(localStorage.getItem("historicoCoach")) || [];

    const xp = historico.length * 25;

    const nivel = Math.floor(xp / 100) + 1;

    const nivelCoach = document.getElementById("nivelCoach");
    const xpCoach = document.getElementById("xpCoach");

    if (nivelCoach) {

        nivelCoach.textContent = nivel;

    }

    if (xpCoach) {

        xpCoach.textContent = xp;

    }

}

// ===========================================
// INICIALIZAÇÃO
// ===========================================

atualizarNivel();
// ===========================================
// FIM
// ===========================================

atualizarNivel();