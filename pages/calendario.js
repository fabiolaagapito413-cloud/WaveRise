console.log("Calendário WaveRise 📅");

const calendario = document.getElementById("calendario");
const tituloMes = document.getElementById("tituloMes");

const totalMes = document.getElementById("totalMes");
const ondasMes = document.getElementById("ondasMes");
const mediaMes = document.getElementById("mediaMes");

const detalhes = document.getElementById("detalhes");

const btnAnterior = document.getElementById("mesAnterior");
const btnProximo = document.getElementById("proximoMes");

const meses = [
    "Janeiro","Fevereiro","Março","Abril",
    "Maio","Junho","Julho","Agosto",
    "Setembro","Outubro","Novembro","Dezembro"
];

let dataAtual = new Date();

let historico = JSON.parse(
    localStorage.getItem("historicoSurfWaveRise")
) || [];

desenharCalendario();

btnAnterior.addEventListener("click", () => {

    dataAtual.setMonth(dataAtual.getMonth() - 1);

    desenharCalendario();

});

btnProximo.addEventListener("click", () => {

    dataAtual.setMonth(dataAtual.getMonth() + 1);

    desenharCalendario();

});

function desenharCalendario() {

    calendario.innerHTML = "";

    detalhes.innerHTML =
    "<p>Toque em um dia com 🌊.</p>";

    const ano = dataAtual.getFullYear();

    const mes = dataAtual.getMonth();

    tituloMes.textContent =
        meses[mes] + " " + ano;

    const primeiroDia =
        new Date(ano, mes, 1).getDay();

    const ultimoDia =
        new Date(ano, mes + 1, 0).getDate();

    let sessoesMes = 0;
    let ondas = 0;
    let notas = 0;

    for(let i = 0; i < primeiroDia; i++){

        const vazio = document.createElement("div");

        vazio.className = "dia vazio";

        calendario.appendChild(vazio);

    }

    for(let dia = 1; dia <= ultimoDia; dia++){

        const bloco = document.createElement("div");

        bloco.className = "dia";

        bloco.innerHTML =
        `<strong>${dia}</strong>`;

        const dataTexto =
            `${ano}-${String(mes+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;

        const sessao =
            historico.find(item => item.data === dataTexto);

        if(sessao){

            bloco.classList.add("surf");

            bloco.innerHTML += "<br>🌊";

            sessoesMes++;

            ondas += Number(sessao.ondas || 0);

            notas += Number(sessao.nota || 0);

            bloco.addEventListener("click", () => {

                detalhes.innerHTML = `

                <h3>${sessao.data}</h3>

                <p><strong>Praia:</strong> ${sessao.praia}</p>

                <p><strong>Tempo:</strong> ${sessao.tempo}</p>

                <p><strong>Ondas:</strong> ${sessao.ondas}</p>

                <p><strong>Nota:</strong> ${sessao.nota}</p>

                <p><strong>Observações:</strong></p>

                <p>${sessao.observacoes}</p>

                `;

            });

        }

        const hoje = new Date();

        if(
            dia === hoje.getDate() &&
            mes === hoje.getMonth() &&
            ano === hoje.getFullYear()
        ){

            bloco.classList.add("hoje");

        }

        calendario.appendChild(bloco);

    }

    totalMes.textContent = sessoesMes;

    ondasMes.textContent = ondas;

    mediaMes.textContent =
        sessoesMes > 0
        ? (notas/sessoesMes).toFixed(1)
        : "0";

}