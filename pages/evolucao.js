console.log("📈 Minha Evolução — WaveRise 🌊");


// =====================================================
// ELEMENTOS DA PÁGINA
// =====================================================

const totalSessoes = document.getElementById("totalSessoes");
const totalOndasElemento = document.getElementById("totalOndas");
const mediaNota = document.getElementById("mediaNota");
const xpElemento = document.getElementById("xp");
const mensagem = document.getElementById("mensagem");
const grafico = document.getElementById("graficoSurf");


// =====================================================
// HISTÓRICO
// =====================================================

let historico = [];

try {

    historico = JSON.parse(
        localStorage.getItem("historicoSurfWaveRise")
    ) || [];

} catch (erro) {

    console.error("❌ Erro ao carregar histórico:", erro);

    historico = [];

}


if (!Array.isArray(historico)) {
    historico = [];
}


// =====================================================
// CÁLCULOS
// =====================================================

let quantidadeOndas = 0;
let somaNotas = 0;
let totalXP = 0;


historico.forEach((sessao) => {

    const ondasSessao = Number(sessao.ondas || 0);
    const notaSessao = Number(sessao.nota || 0);

    quantidadeOndas += ondasSessao;

    somaNotas += notaSessao;


    if (sessao.xp !== undefined) {

        totalXP += Number(sessao.xp || 0);

    } else {

        totalXP += 100;

    }

});


// =====================================================
// MÉDIA
// =====================================================

let media = 0;

if (historico.length > 0) {

    media = somaNotas / historico.length;

}


// =====================================================
// ATUALIZAR RESUMO
// =====================================================

if (totalSessoes) {

    totalSessoes.textContent = historico.length;

}


if (totalOndasElemento) {

    totalOndasElemento.textContent = quantidadeOndas;

}


if (mediaNota) {

    mediaNota.textContent =
        media > 0
            ? media.toFixed(1)
            : "0";

}


if (xpElemento) {

    xpElemento.textContent = totalXP;

}


// =====================================================
// NÍVEL
// =====================================================

let nivel = 1;


if (totalXP >= 5000) {

    nivel = 6;

} else if (totalXP >= 3000) {

    nivel = 5;

} else if (totalXP >= 1500) {

    nivel = 4;

} else if (totalXP >= 500) {

    nivel = 3;

} else if (totalXP >= 200) {

    nivel = 2;

}


// =====================================================
// PRÓXIMA META
// =====================================================

let proximaMeta = "";
let progressoMeta = 0;


if (totalXP < 200) {

    proximaMeta =
        "Alcance 200 XP para chegar ao nível 2.";

    progressoMeta =
        (totalXP / 200) * 100;


} else if (totalXP < 500) {

    proximaMeta =
        "Alcance 500 XP para chegar ao nível 3.";

    progressoMeta =
        (totalXP / 500) * 100;


} else if (totalXP < 1500) {

    proximaMeta =
        "Alcance 1.500 XP para chegar ao nível 4.";

    progressoMeta =
        (totalXP / 1500) * 100;


} else if (totalXP < 3000) {

    proximaMeta =
        "Alcance 3.000 XP para chegar ao nível 5.";

    progressoMeta =
        (totalXP / 3000) * 100;


} else if (totalXP < 5000) {

    proximaMeta =
        "Alcance 5.000 XP para chegar ao nível 6.";

    progressoMeta =
        (totalXP / 5000) * 100;


} else {

    proximaMeta =
        "Você atingiu um nível de elite. Continue evoluindo!";

    progressoMeta = 100;

}


progressoMeta = Math.min(
    100,
    Math.max(0, progressoMeta)
);


// =====================================================
// MENSAGEM DE EVOLUÇÃO
// =====================================================

if (mensagem) {

    if (historico.length === 0) {

        mensagem.textContent =
            "🏄 Registre sua primeira sessão para começar a acompanhar sua evolução.";


    } else if (media >= 8.5) {

        mensagem.textContent =
            `🔥 Excelente desempenho! Sua média está em ${media.toFixed(1)}. Continue buscando consistência.`;


    } else if (media >= 7) {

        mensagem.textContent =
            `🌊 Boa evolução! Sua média atual é ${media.toFixed(1)}. Agora o foco é ganhar consistência.`;


    } else if (media >= 5) {

        mensagem.textContent =
            `💪 Você está evoluindo. Sua média é ${media.toFixed(1)}. Continue treinando e registrando suas sessões.`;


    } else {

        mensagem.textContent =
            "🏄 Cada sessão é uma oportunidade de melhorar. Continue surfando!";

    }

}


// =====================================================
// GRÁFICO
// =====================================================

if (grafico && typeof Chart !== "undefined") {


    if (historico.length === 0) {

        console.log(
            "📊 Ainda não existem sessões suficientes para montar o gráfico."
        );


    } else {


        const labels = historico.map((sessao, index) => {

            return `Sessão ${index + 1}`;

        });


        const notas = historico.map((sessao) => {

            return Number(sessao.nota || 0);

        });


        new Chart(grafico, {

            type: "line",


            data: {

                labels: labels,


                datasets: [

                    {

                        label: "Nota da sessão",

                        data: notas,

                        tension: 0.35,

                        fill: false,

                        borderWidth: 3,

                        pointRadius: 4,

                        pointHoverRadius: 6

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                plugins: {

                    legend: {

                        display: true

                    }

                },


                scales: {

                    y: {

                        beginAtZero: true,

                        min: 0,

                        max: 10,

                        ticks: {

                            stepSize: 1

                        }

                    }

                }

            }

        });

    }

}


// =====================================================
// INFORMAÇÕES PARA DEBUG
// =====================================================

console.log("📊 Estatísticas WaveRise");

console.log("Sessões:", historico.length);

console.log("Ondas:", quantidadeOndas);

console.log("Média:", media.toFixed(1));

console.log("XP:", totalXP);

console.log("Nível:", nivel);

console.log("Próxima meta:", proximaMeta);

console.log(
    "Progresso da meta:",
    progressoMeta.toFixed(0) + "%"
);