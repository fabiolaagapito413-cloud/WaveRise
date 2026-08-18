console.log("🌊 WaveRise Mar Premium");

//===========================
// ELEMENTOS
//===========================

const praiaInput = document.getElementById("praiaInput");
const buscar = document.getElementById("buscarMar");

const localMar = document.getElementById("localMar");
const ondasMar = document.getElementById("ondasMar");
const swellMar = document.getElementById("swellMar");
const periodoMar = document.getElementById("periodoMar");
const direcaoMar = document.getElementById("direcaoMar");
const ventoMar = document.getElementById("ventoMar");
const aguaMar = document.getElementById("aguaMar");
const mareMar = document.getElementById("mareMar");
const tipoVento = document.getElementById("tipoVento");
const notaSurf = document.getElementById("notaSurf");
const condicaoMar = document.getElementById("condicaoMar");
const coachTexto = document.getElementById("coachTexto");

//===========================
// BUSCAR PRAIA
//===========================

buscar.addEventListener("click", buscarPraia);

async function buscarPraia() {

    const nome = praiaInput.value.trim();

    if (!nome) {
        alert("Digite uma praia.");
        return;
    }

    localMar.textContent = "🔎 Procurando localização...";

    try {

        //-------------------------------------------------
        // OPEN STREET MAP
        //-------------------------------------------------

        const geo = await fetch(

            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nome)}`

        );

        const lugares = await geo.json();

        if (lugares.length === 0) {

            alert("Praia não encontrada.");

            return;

        }

        const praia = lugares[0];

        const latitude = Number(praia.lat);
        const longitude = Number(praia.lon);

        localMar.textContent =
            praia.display_name;

        carregarDados(latitude, longitude);

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao localizar praia.");

    }

}

//===========================
// DADOS REAIS
//===========================

async function carregarDados(lat, lon) {

    try {

        //-----------------------------------------
        // MAR
        //-----------------------------------------

        const apiMar =

`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_direction,wave_period&timezone=auto`;

        //-----------------------------------------
        // CLIMA
        //-----------------------------------------

        const apiTempo =

`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m`;

        const respostaMar = await fetch(apiMar);

        const respostaTempo = await fetch(apiTempo);

        const mar = await respostaMar.json();

        const clima = await respostaTempo.json();

        mostrarDados(mar, clima);

    }

    catch (erro) {

        console.log(erro);

        alert("Erro ao consultar APIs.");

    }

}

//===========================
// MOSTRAR
//===========================

function mostrarDados(mar, clima) {

    const onda =
        mar.hourly.wave_height[0];

    const periodo =
        mar.hourly.wave_period[0];

    const direcao =
        mar.hourly.wave_direction[0];

    const vento =
        clima.current.wind_speed_10m;

    const direcaoVento =
        clima.current.wind_direction_10m;

    ondasMar.textContent =
        onda.toFixed(1) + " m";

    swellMar.textContent =
        onda.toFixed(1) + " m";

    periodoMar.textContent =
        periodo.toFixed(1) + " s";

    direcaoMar.textContent =
        direcao + "°";

    ventoMar.textContent =
        vento.toFixed(1) + " km/h";

    aguaMar.textContent =
        "--";

    mareMar.textContent =
        "--";

    //------------------------------------
    // VENTO
    //------------------------------------

    let tipo = "Lateral";

    if (direcaoVento > 45 && direcaoVento < 135)
        tipo = "Maral";

    if (direcaoVento > 225 && direcaoVento < 315)
        tipo = "Terral";

    tipoVento.textContent = tipo;

    //------------------------------------
    // NOTA
    //------------------------------------

    let nota = 5;

    if (onda >= 0.8 && onda <= 2)
        nota += 2;

    if (vento < 12)
        nota += 2;

    if (tipo === "Terral")
        nota += 1;

    if (nota > 10)
        nota = 10;

    notaSurf.textContent =
        nota + "/10";

    //------------------------------------
    // TEXTO
    //------------------------------------

    if (nota >= 9) {

        condicaoMar.textContent =
            "Excelente para surfar.";

        coachTexto.textContent =
            "🏄 Hoje é um ótimo dia para entrar no mar.";

    }

    else if (nota >= 7) {

        condicaoMar.textContent =
            "Boas condições.";

        coachTexto.textContent =
            "🌊 Vale a pena treinar manobras.";

    }

    else {

        condicaoMar.textContent =
            "Condições limitadas.";

        coachTexto.textContent =
            "🤖 Melhor usar a sessão para treinar remada.";

    }

}
//==================================================
// PARTE 2
// MAPA + GRÁFICO + PREVISÃO
//==================================================

let mapa;
let marcador;
let grafico;

//------------------------------------
// Atualiza mapa
//------------------------------------

function atualizarMapa(lat, lon, nome) {

    if (!document.getElementById("mapa"))
        return;

    if (!mapa) {

        mapa = L.map("mapa").setView([lat, lon], 11);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                "&copy; OpenStreetMap"
            }
        ).addTo(mapa);

    } else {

        mapa.setView([lat, lon], 11);

    }

    if (marcador)
        marcador.remove();

    marcador = L.marker([lat, lon])
        .addTo(mapa)
        .bindPopup(nome)
        .openPopup();

}

//------------------------------------
// Atualiza gráfico
//------------------------------------

function atualizarGrafico(mar) {

    const canvas =
        document.getElementById("graficoMar");

    if (!canvas)
        return;

    const horas =
        mar.hourly.time.slice(0,24);

    const ondas =
        mar.hourly.wave_height.slice(0,24);

    const labels = horas.map(h=>{

        return h.substring(11,16);

    });

    if(grafico){

        grafico.destroy();

    }

    grafico = new Chart(canvas,{

        type:"line",

        data:{

            labels:labels,

            datasets:[{

                label:"Altura das Ondas (m)",

                data:ondas,

                borderWidth:3,

                tension:0.35,

                fill:false

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:true

                }

            }

        }

    });

}

//------------------------------------
// Próximos dias
//------------------------------------

async function carregarPrevisao(lat,lon){

    try{

        const url=

`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&daily=wave_height_max,wave_period_max&timezone=auto`;

        const resposta=
        await fetch(url);

        const dados=
        await resposta.json();

        mostrarPrevisao(dados);

    }

    catch(e){

        console.log(e);

    }

}

//------------------------------------
// Mostrar previsão
//------------------------------------

function mostrarPrevisao(dados){

    let card=
    document.getElementById("previsao7dias");

    if(!card)
        return;

    card.innerHTML="";

    for(let i=0;i<dados.daily.time.length;i++){

        card.innerHTML+=`

<div class="diaPrevisao">

<b>${dados.daily.time[i]}</b>

<br>

🌊 ${dados.daily.wave_height_max[i].toFixed(1)} m

<br>

⏱ ${dados.daily.wave_period_max[i].toFixed(1)} s

</div>

`;

    }

}

//------------------------------------
// Nascer do sol
//------------------------------------

async function carregarSol(lat,lon){

    try{

        const url=

`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto`;

        const resposta=
        await fetch(url);

        const dados=
        await resposta.json();

        if(document.getElementById("nascerSol")){

            document.getElementById("nascerSol").textContent=

            dados.daily.sunrise[0].substring(11,16);

        }

        if(document.getElementById("porSol")){

            document.getElementById("porSol").textContent=

            dados.daily.sunset[0].substring(11,16);

        }

    }

    catch(e){

        console.log(e);

    }

}
//==================================================
// PARTE 3
// FAVORITOS + GPS + COACH IA PREMIUM
//==================================================

// -----------------------------
// FAVORITOS
// -----------------------------

const botaoFavoritar =
document.getElementById("favoritar");

const favoritosHTML =
document.getElementById("favoritos");

let praiaAtual = "";

botaoFavoritar?.addEventListener("click", () => {

    if (!praiaAtual) {

        alert("Pesquise uma praia primeiro.");

        return;

    }

    let favoritos =
    JSON.parse(localStorage.getItem("favoritosWaveRise")) || [];

    if (!favoritos.includes(praiaAtual)) {

        favoritos.push(praiaAtual);

        localStorage.setItem(
            "favoritosWaveRise",
            JSON.stringify(favoritos)
        );

    }

    carregarFavoritos();

});

function carregarFavoritos() {

    if (!favoritosHTML)
        return;

    favoritosHTML.innerHTML = "";

    const favoritos =
    JSON.parse(localStorage.getItem("favoritosWaveRise")) || [];

    favoritos.forEach(nome => {

        favoritosHTML.innerHTML += `
        <button class="btnFavorito">
            🌊 ${nome}
        </button>
        `;

    });

}

carregarFavoritos();


// -----------------------------
// HISTÓRICO
// -----------------------------

function salvarHistorico(nome){

    let historico =
    JSON.parse(localStorage.getItem("historicoPraias")) || [];

    historico.unshift(nome);

    historico =
    [...new Set(historico)];

    historico =
    historico.slice(0,15);

    localStorage.setItem(
        "historicoPraias",
        JSON.stringify(historico)
    );

}


// -----------------------------
// GPS
// -----------------------------

const gps =
document.getElementById("gps");

gps?.addEventListener("click",()=>{

    navigator.geolocation.getCurrentPosition(

        async(pos)=>{

            const lat =
            pos.coords.latitude;

            const lon =
            pos.coords.longitude;

            carregarDados(lat,lon);

            atualizarMapa(
                lat,
                lon,
                "Minha localização"
            );

        },

        ()=>{

            alert("Não foi possível obter sua localização.");

        }

    );

});


// -----------------------------
// VENTO TERRAL / MARAL
// -----------------------------

function classificarVento(
    direcaoPraia,
    direcaoVento
){

    let diferenca =
    Math.abs(direcaoPraia - direcaoVento);

    if(diferenca>180){

        diferenca =
        360-diferenca;

    }

    if(diferenca<45){

        return "🌬 Maral";

    }

    if(diferenca>135){

        return "🌬 Terral";

    }

    return "🌬 Lateral";

}


// -----------------------------
// COACH IA
// -----------------------------

function gerarCoach(
    onda,
    periodo,
    vento,
    nota
){

    if(nota>=9){

        return `
🏄 Excelente dia!

Hoje o mar está muito bom.

Treine:

✔ Bottom Turn

✔ Cutback

✔ Velocidade

`;

    }

    if(nota>=7){

        return `

🌊 Boas condições.

Hoje vale focar em:

✔ Remada

✔ Leitura da onda

✔ Posicionamento

`;

    }

    return `

⚠ Condições difíceis.

Treine:

✔ Equilíbrio

✔ Entrada na onda

✔ Condicionamento físico

`;

}


// -----------------------------
// MELHORAR NOTA
// -----------------------------

function calcularNota(

    onda,
    periodo,
    vento,
    tipo

){

    let nota = 5;

    if(onda>=0.8 && onda<=2.0)
        nota+=2;

    if(periodo>=10)
        nota+=2;

    if(vento<=12)
        nota+=1;

    if(tipo.includes("Terral"))
        nota+=1;

    return Math.min(nota,10);

}
