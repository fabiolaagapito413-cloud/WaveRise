/* =========================================
   WAVERISE — COMPARAR PRAIAS
========================================= */

const btnComparar =
    document.getElementById("btnComparar");

const btnLocalizacao =
    document.getElementById("btnLocalizacao");

const praia1Input =
    document.getElementById("praia1");

const praia2Input =
    document.getElementById("praia2");

const resultado =
    document.getElementById("resultado");

let localizacaoAtual = null;


/* =========================================
   LOCALIZAÇÃO
========================================= */

btnLocalizacao.addEventListener(
    "click",
    obterLocalizacao
);


function obterLocalizacao() {

    if (!navigator.geolocation) {

        alert(
            "Seu dispositivo não suporta geolocalização."
        );

        return;
    }


    btnLocalizacao.textContent =
        "📍 Obtendo localização...";


    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            localizacaoAtual = {
                latitude,
                longitude
            };


            localStorage.setItem(
                "localizacaoWaveRise",
                JSON.stringify(localizacaoAtual)
            );


            document.getElementById(
                "statusPraia1"
            ).textContent =
                "Sua localização foi encontrada";


            document.getElementById(
                "coordPraia1"
            ).textContent =
                `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;


            btnLocalizacao.textContent =
                "📍 Localização encontrada";

        },

        error => {

            console.error(error);

            btnLocalizacao.textContent =
                "📍 Tentar novamente";

            alert(
                "Não conseguimos acessar sua localização. Verifique a permissão do navegador/celular."
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
        }
    );
}


/* =========================================
   GEOCODIFICAÇÃO
========================================= */

async function encontrarCoordenadas(
    nome
) {

    const url =
        "https://nominatim.openstreetmap.org/search" +
        `?q=${encodeURIComponent(nome + ", Brasil")}` +
        "&format=json" +
        "&limit=1";


    const resposta =
        await fetch(url);


    if (!resposta.ok) {

        throw new Error(
            "Erro ao localizar praia."
        );
    }


    const dados =
        await resposta.json();


    if (!dados.length) {

        throw new Error(
            `Não encontramos "${nome}".`
        );
    }


    return {

        latitude:
            Number(dados[0].lat),

        longitude:
            Number(dados[0].lon)

    };
}


/* =========================================
   PREVISÃO
========================================= */

async function buscarPrevisao(
    latitude,
    longitude
) {

    const dataAtual =
        new Date();


    const data =
        dataAtual
            .toISOString()
            .split("T")[0];


    const url =
        "https://marine-api.open-meteo.com/v1/marine" +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&hourly=wave_height,wave_period,wave_direction` +
        "&timezone=auto" +
        `&start_date=${data}` +
        `&end_date=${data}`;


    const resposta =
        await fetch(url);


    if (!resposta.ok) {

        throw new Error(
            "Erro ao consultar previsão."
        );
    }


    return await resposta.json();
}


/* =========================================
   CALCULAR SCORE
========================================= */

function calcularScore(
    altura,
    periodo
) {

    let scoreAltura = 0;


    if (
        altura >= 0.7 &&
        altura <= 1.8
    ) {

        scoreAltura = 55;

    } else if (
        altura >= 0.5 &&
        altura < 0.7
    ) {

        scoreAltura = 42;

    } else if (
        altura > 1.8 &&
        altura <= 2.5
    ) {

        scoreAltura = 45;

    } else if (
        altura > 2.5
    ) {

        scoreAltura = 32;

    } else {

        scoreAltura = 20;
    }


    let scorePeriodo = 0;


    if (periodo >= 12) {

        scorePeriodo = 45;

    } else if (periodo >= 10) {

        scorePeriodo = 38;

    } else if (periodo >= 8) {

        scorePeriodo = 30;

    } else if (periodo >= 6) {

        scorePeriodo = 22;

    } else {

        scorePeriodo = 12;
    }


    return Math.min(
        100,
        Math.round(
            (scoreAltura + scorePeriodo) / 2
        )
    );
}


/* =========================================
   MELHOR HORÁRIO
========================================= */

function analisarPrevisao(
    dados
) {

    if (
        !dados.hourly ||
        !dados.hourly.time
    ) {

        throw new Error(
            "Dados marítimos indisponíveis."
        );
    }


    const horarios = [];


    for (
        let i = 0;
        i < dados.hourly.time.length;
        i++
    ) {

        const data =
            new Date(
                dados.hourly.time[i]
            );


        const hora =
            data.getHours();


        if (
            hora < 6 ||
            hora > 18
        ) {
            continue;
        }


        const altura =
            Number(
                dados.hourly.wave_height[i] || 0
            );


        const periodo =
            Number(
                dados.hourly.wave_period[i] || 0
            );


        const direcao =
            Number(
                dados.hourly.wave_direction[i] || 0
            );


        const score =
            calcularScore(
                altura,
                periodo
            );


        horarios.push({

            data,

            altura,

            periodo,

            direcao,

            score

        });
    }


    horarios.sort(
        (a, b) =>
            b.score - a.score
    );


    if (!horarios.length) {

        throw new Error(
            "Nenhum horário disponível."
        );
    }


    return horarios[0];
}


/* =========================================
   COMPARAR
========================================= */

btnComparar.addEventListener(
    "click",
    compararPraias
);


async function compararPraias() {

    const nome1 =
        praia1Input.value.trim();

    const nome2 =
        praia2Input.value.trim();


    if (!nome1 || !nome2) {

        alert(
            "Digite o nome das duas praias."
        );

        return;
    }


    btnComparar.disabled = true;

    btnComparar.textContent =
        "🌊 Analisando praias...";


    try {

        const [
            coordenadas1,
            coordenadas2
        ] = await Promise.all([

            encontrarCoordenadas(nome1),

            encontrarCoordenadas(nome2)

        ]);


        const [
            previsao1,
            previsao2
        ] = await Promise.all([

            buscarPrevisao(
                coordenadas1.latitude,
                coordenadas1.longitude
            ),

            buscarPrevisao(
                coordenadas2.latitude,
                coordenadas2.longitude
            )

        ]);


        const melhor1 =
            analisarPrevisao(
                previsao1
            );


        const melhor2 =
            analisarPrevisao(
                previsao2
            );


        mostrarResultado(
            nome1,
            melhor1,
            nome2,
            melhor2
        );


    } catch (erro) {

        console.error(erro);

        alert(
            erro.message ||
            "Não foi possível comparar as praias."
        );

    } finally {

        btnComparar.disabled = false;

        btnComparar.textContent =
            "🌊 Comparar praias";
    }
}


/* =========================================
   MOSTRAR RESULTADO
========================================= */

function mostrarResultado(
    nome1,
    dados1,
    nome2,
    dados2
) {

    resultado.style.display =
        "block";


    document.getElementById(
        "nomeResultado1"
    ).textContent =
        nome1;


    document.getElementById(
        "nomeResultado2"
    ).textContent =
        nome2;


    preencherPraia(
        "1",
        dados1
    );


    preencherPraia(
        "2",
        dados2
    );


    const primeiraVencedora =
        dados1.score >= dados2.score;


    const vencedora =
        primeiraVencedora
            ? nome1
            : nome2;


    const dadosVencedora =
        primeiraVencedora
            ? dados1
            : dados2;


    document.getElementById(
        "praiaVencedora"
    ).textContent =
        vencedora;


    document.getElementById(
        "motivoVencedora"
    ).textContent =
        `Score ${dadosVencedora.score}/100 · ondas ${dadosVencedora.altura.toFixed(1)} m · período ${dadosVencedora.periodo.toFixed(0)} s.`;


    document.getElementById(
        "coachMensagem"
    ).textContent =
        gerarMensagemCoach(
            vencedora,
            dadosVencedora,
            primeiraVencedora
                ? dados2
                : dados1
        );


    document.getElementById(
        "resultadoPraia1"
    ).classList.toggle(
        "vencedoraCard",
        primeiraVencedora
    );


    document.getElementById(
        "resultadoPraia2"
    ).classList.toggle(
        "vencedoraCard",
        !primeiraVencedora
    );


    resultado.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================
   PREENCHER PRAIA
========================================= */

function preencherPraia(
    numero,
    dados
) {

    document.getElementById(
        `score${numero}`
    ).textContent =
        dados.score;


    document.getElementById(
        `ondas${numero}`
    ).textContent =
        `${dados.altura.toFixed(1)} m`;


    document.getElementById(
        `periodo${numero}`
    ).textContent =
        `${dados.periodo.toFixed(0)} s`;


    /*
     * Vento e maré não são inventados.
     */

    document.getElementById(
        `vento${numero}`
    ).textContent =
        "--";


    document.getElementById(
        `mare${numero}`
    ).textContent =
        "--";
}


/* =========================================
   COACH
========================================= */

function gerarMensagemCoach(
    vencedora,
    melhor,
    outra
) {

    const diferenca =
        Math.abs(
            melhor.score -
            outra.score
        );


    if (diferenca < 5) {

        return `As duas praias estão muito próximas. Eu escolheria ${vencedora} pela pequena vantagem no conjunto de ondas e período, mas vale conferir as condições reais antes de entrar.`;
    }


    if (melhor.score >= 80) {

        return `${vencedora} apresenta a melhor combinação entre altura e período entre as praias analisadas. É a opção que eu priorizaria para sua sessão.`;
    }


    if (melhor.score >= 65) {

        return `${vencedora} aparece na frente da comparação. A janela parece interessante, mas confira vento, maré e condições locais antes de entrar.`;
    }


    return `${vencedora} ficou à frente, mas nenhuma das duas apresenta uma pontuação muito alta. Eu acompanharia a previsão antes de decidir.`;
}