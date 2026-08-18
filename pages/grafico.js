// =====================================
// GRÁFICO - WaveRise 2.0
// =====================================

let grafico = null;

import {
    calcularNota,
    classificarVento
} from "./utils.js";

// =====================================

export function criarGrafico(canvasId = "graficoMar") {

    const canvas = document.getElementById(canvasId);

    if (!canvas) return;

    if (grafico) {

        grafico.destroy();

    }

    grafico = new Chart(canvas, {

        type: "line",

        data: {

            labels: [],

            datasets: [

                {
                    label: "🌊 Ondas",

                    data: [],

                    borderColor: "#4FC3F7",

                    backgroundColor:
                        "rgba(79,195,247,.20)",

                    borderWidth: 3,

                    fill: true,

                    tension: .35

                },

                {
                    label: "💨 Vento",

                    data: [],

                    borderColor: "#4CAF50",

                    backgroundColor:
                        "rgba(76,175,80,.10)",

                    borderWidth: 2,

                    fill: false,

                    tension: .35

                },

                {
                    label: "⭐ Surf Score",

                    data: [],

                    borderColor: "#FFC107",

                    backgroundColor:
                        "rgba(255,193,7,.10)",

                    borderWidth: 2,

                    fill: false,

                    tension: .35,

                    yAxisID: "y1"

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

                mode: "index",

                intersect: false

            },

            plugins: {

                legend: {

                    display: true,

                    position: "bottom"

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    title: {

                        display: true,

                        text: "Ondas (m)"

                    }

                },

                y1: {

                    position: "right",

                    min: 0,

                    max: 100,

                    grid: {

                        drawOnChartArea: false

                    },

                    title: {

                        display: true,

                        text: "Surf Score"

                    }

                }

            }

        }

    });

}

// =====================================

export function atualizarGrafico(hours) {

    if (!grafico) return;

    const labels = [];

    const ondas = [];

    const ventos = [];

    const notas = [];

    hours.slice(0, 12).forEach(hora => {

        const data = new Date(hora.time);

        const onda =
            obterValor(hora.waveHeight);

        const vento =
            obterValor(hora.windSpeed);

        const periodo =
            obterValor(hora.wavePeriod);

        const direcao =
            obterValor(hora.windDirection);

        const tipo =
            classificarVento(direcao);

        const nota =
            Math.round(

                calcularNota(

                    onda,

                    periodo,

                    vento,

                    tipo

                ) * 10

            );

        labels.push(

            data.toLocaleTimeString(

                "pt-BR",

                {

                    hour: "2-digit",

                    minute: "2-digit"

                }

            )

        );

        ondas.push(onda);

        ventos.push(

            (vento * 3.6).toFixed(1)

        );

        notas.push(nota);

    });

    grafico.data.labels = labels;

    grafico.data.datasets[0].data = ondas;

    grafico.data.datasets[1].data = ventos;

    grafico.data.datasets[2].data = notas;

    grafico.update();

}

// =====================================

function obterValor(obj) {

    if (!obj) return 0;

    const prioridade = [

        "sg",

        "noaa",

        "icon",

        "dwd",

        "meteo",

        "smhi"

    ];

    for (const fonte of prioridade) {

        if (obj[fonte] != null)

            return obj[fonte];

    }

    return Object.values(obj)[0] ?? 0;

}

// =====================================

export function destruirGrafico() {

    if (grafico) {

        grafico.destroy();

        grafico = null;

    }

}

console.log("📈 Gráfico WaveRise carregado.");