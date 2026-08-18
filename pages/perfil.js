// ======================================================
// WaveRise 3.0
// Perfil Premium
// ======================================================

console.log("Perfil carregado");

// ======================================================
// ELEMENTOS
// ======================================================

const fotoPerfil = document.getElementById("fotoPerfil");
const inputFoto = document.getElementById("inputFoto");

const nomePerfil = document.getElementById("nomePerfil");
const nivelPerfil = document.getElementById("nivelPerfil");

const barraXP = document.getElementById("barraXPPerfil");
const xpPerfil = document.getElementById("xpPerfil");

const pranchaFavorita =
    document.getElementById("pranchaFavorita");

const praiaFavorita =
    document.getElementById("praiaFavorita");

const editarPerfil =
    document.getElementById("editarPerfil");

const perfilSessoes =
    document.getElementById("perfilSessoes");

const perfilOndas =
    document.getElementById("perfilOndas");

const perfilHoras =
    document.getElementById("perfilHoras");

const perfilNota =
    document.getElementById("perfilNota");


// ======================================================
// DADOS
// ======================================================

let perfil =
    JSON.parse(
        localStorage.getItem("perfilWaveRise")
    ) || {};

const historico =
    JSON.parse(
        localStorage.getItem("historicoSurfWaveRise")
    ) || [];


// ======================================================
// NOME
// ======================================================

if (nomePerfil) {

    nomePerfil.textContent =
        perfil.nome || "Surfista";

}


// ======================================================
// ESTATISTICAS
// ======================================================

let xp = 0;
let ondas = 0;
let horas = 0;
let melhorNota = 0;

historico.forEach((sessao) => {

    const qtdOndas =
        Number(sessao.ondas) || 0;

    const tempo =
        parseFloat(sessao.tempo) || 0;

    const nota =
        Number(sessao.nota) || 0;

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
// NIVEL
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

if (nivelPerfil) {

    nivelPerfil.textContent =
        "Nivel " + nivel;

}


// ======================================================
// XP
// ======================================================

const xpMaximo = 15000;

const porcentagem =
    Math.min(
        (xp / xpMaximo) * 100,
        100
    );

if (barraXP) {

    barraXP.style.width =
        porcentagem + "%";

}

if (xpPerfil) {

    xpPerfil.textContent =
        Math.round(xp) +
        " / " +
        xpMaximo +
        " XP";

}


// ======================================================
// ESTATISTICAS NA TELA
// ======================================================

if (perfilSessoes) {

    perfilSessoes.textContent =
        historico.length;

}

if (perfilOndas) {

    perfilOndas.textContent =
        ondas;

}

if (perfilHoras) {

    perfilHoras.textContent =
        horas.toFixed(1) + " h";

}

if (perfilNota) {

    perfilNota.textContent =
        melhorNota.toFixed(1);

}


// ======================================================
// PRANCHA FAVORITA
// ======================================================

function carregarPranchaFavorita() {

    if (
        perfil.prancha &&
        perfil.prancha.trim()
    ) {

        if (pranchaFavorita) {

            pranchaFavorita.textContent =
                perfil.prancha;

        }

        return;

    }


    const pranchas =
        JSON.parse(
            localStorage.getItem(
                "pranchasWaveRise"
            )
        ) || [];


    if (
        pranchas.length &&
        pranchaFavorita
    ) {

        pranchaFavorita.textContent =
            pranchas[0].nome ||
            "Minha Prancha";

    } else if (pranchaFavorita) {

        pranchaFavorita.textContent =
            "--";

    }

}


// ======================================================
// PRAIA FAVORITA
// ======================================================

function carregarPraiaFavorita() {

    if (
        perfil.praia &&
        perfil.praia.trim()
    ) {

        if (praiaFavorita) {

            praiaFavorita.textContent =
                perfil.praia;

        }

        return;

    }


    const favoritos =
        JSON.parse(
            localStorage.getItem(
                "praiasFavoritasWaveRise"
            )
        ) || [];


    if (
        favoritos.length &&
        praiaFavorita
    ) {

        praiaFavorita.textContent =
            favoritos[0].nome || "--";

    } else if (praiaFavorita) {

        praiaFavorita.textContent =
            "--";

    }

}

carregarPranchaFavorita();

carregarPraiaFavorita();


// ======================================================
// FOTO DO PERFIL
// ======================================================

function carregarFotoPerfil() {

    const perfilAtual =
        JSON.parse(
            localStorage.getItem(
                "perfilWaveRise"
            )
        ) || {};


    if (
        perfilAtual.foto &&
        fotoPerfil
    ) {

        fotoPerfil.src =
            perfilAtual.foto;

    }

}


// ======================================================
// CONFIGURAR FOTO
// ======================================================

function configurarFotoPerfil() {

    if (
        !inputFoto ||
        !fotoPerfil
    ) {

        return;

    }


    inputFoto.addEventListener(
        "change",
        (evento) => {

            const arquivo =
                evento.target.files[0];


            if (!arquivo) {

                return;

            }


            if (
                !arquivo.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Escolha uma imagem valida."
                );

                inputFoto.value = "";

                return;

            }


            const tamanhoMaximo =
                10 * 1024 * 1024;


            if (
                arquivo.size >
                tamanhoMaximo
            ) {

                alert(
                    "A imagem e muito grande. " +
                    "Escolha uma foto de ate 10 MB."
                );

                inputFoto.value = "";

                return;

            }


            const leitor =
                new FileReader();


            leitor.onload = () => {

                const imagemBase64 =
                    leitor.result;


                fotoPerfil.src =
                    imagemBase64;


                const perfilAtual =
                    JSON.parse(
                        localStorage.getItem(
                            "perfilWaveRise"
                        )
                    ) || {};


                perfilAtual.foto =
                    imagemBase64;


                localStorage.setItem(
                    "perfilWaveRise",
                    JSON.stringify(
                        perfilAtual
                    )
                );


                perfil =
                    perfilAtual;


                console.log(
                    "Foto do perfil salva."
                );


                inputFoto.value = "";

            };


            leitor.onerror = () => {

                alert(
                    "Nao foi possivel carregar a imagem."
                );

                inputFoto.value = "";

            };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


// ======================================================
// INICIALIZAR FOTO
// ======================================================

carregarFotoPerfil();

configurarFotoPerfil();


// ======================================================
// MEDALHAS
// ======================================================

const medalhas =
    document.querySelectorAll(
        "#medalhasPerfil .infoCard"
    );


if (medalhas.length >= 4) {

    medalhas[0].style.opacity =
        historico.length >= 10
            ? "1"
            : ".35";


    medalhas[1].style.opacity =
        historico.length >= 25
            ? "1"
            : ".35";


    medalhas[2].style.opacity =
        historico.length >= 50
            ? "1"
            : ".35";


    medalhas[3].style.opacity =
        xp >= 10000
            ? "1"
            : ".35";

}


// ======================================================
// EDITAR PERFIL
// ======================================================

if (editarPerfil) {

    editarPerfil.addEventListener(
        "click",
        () => {

            window.location.href =
                "editar-perfil.html";

        }
    );

}


// ======================================================
// FIM
// ======================================================

console.log(
    "Perfil Premium carregado."
);