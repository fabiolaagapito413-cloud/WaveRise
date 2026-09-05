// ======================================================
// WAVERISE - ANÁLISE DE VÍDEO
// ======================================================

// Elementos da página
const videoInput = document.getElementById("videoInput");
const videoPreview = document.getElementById("videoPreview");
const fileName = document.getElementById("fileName");
const analisarBtn = document.getElementById("analisarVideoBtn");
const resultado = document.getElementById("resultado");

// ======================================================
// ENDEREÇO DO BACKEND
// ======================================================
//
// No celular, "localhost" aponta para o próprio celular.
// Por isso usamos o IP do computador na rede.
//
// Computador:
// 192.168.0.9
//
// Backend:
// porta 3000
// ======================================================

const API_URL = "http://192.168.0.9:3000";

// ======================================================
// FUNÇÃO AUXILIAR
// ======================================================

function preencherElemento(id, texto) {

    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = texto;
    }

}

// ======================================================
// SELECIONAR VÍDEO
// ======================================================

videoInput.addEventListener("change", () => {

    const arquivo = videoInput.files?.[0];

    if (!arquivo) {
        return;
    }

    console.log("🎥 Vídeo selecionado:", arquivo.name);
    console.log("📦 Tamanho:", arquivo.size);

    // Mostrar nome do arquivo

    if (fileName) {
        fileName.textContent = `🎬 ${arquivo.name}`;
    }

    // Criar preview

    const url = URL.createObjectURL(arquivo);

    if (videoPreview) {

        videoPreview.src = url;

        videoPreview.style.display = "block";

        videoPreview.load();

    }

    // Liberar botão

    if (analisarBtn) {
        analisarBtn.disabled = false;
    }

});

// ======================================================
// ANALISAR VÍDEO
// ======================================================

analisarBtn.addEventListener("click", async () => {

    const arquivo = videoInput.files?.[0];

    // ----------------------------------------------
    // VERIFICAR VÍDEO
    // ----------------------------------------------

    if (!arquivo) {

        alert("Escolha um vídeo primeiro.");

        return;

    }

    console.log("======================================");
    console.log("🎥 INICIANDO ANÁLISE DO VÍDEO");
    console.log("======================================");

    console.log("📄 Arquivo:", arquivo.name);
    console.log("📦 Tamanho:", arquivo.size);
    console.log("🎞️ Tipo:", arquivo.type);

    // ----------------------------------------------
    // BLOQUEAR BOTÃO
    // ----------------------------------------------

    analisarBtn.disabled = true;

    analisarBtn.textContent =
        "🤖 Analisando vídeo...";

    // ----------------------------------------------
    // MOSTRAR RESULTADO
    // ----------------------------------------------

    resultado.style.display = "block";

    preencherElemento(
        "avaliacao",
        "🎥 Enviando seu vídeo para o Coach IA..."
    );

    preencherElemento(
        "pontosFortes",
        "A inteligência artificial está analisando sua sessão."
    );

    preencherElemento(
        "melhorar",
        "Aguarde enquanto identificamos os pontos técnicos."
    );

    preencherElemento(
        "tecnica",
        "Analisando postura, equilíbrio, pernas, braços e posicionamento."
    );

    preencherElemento(
        "treino",
        "Preparando recomendações personalizadas."
    );

    resultado.scrollIntoView({
        behavior: "smooth"
    });

    try {

        // ------------------------------------------
        // CRIAR FORM DATA
        // ------------------------------------------

        const formData = new FormData();

        formData.append(
            "video",
            arquivo
        );

        console.log("📤 Enviando vídeo para:");
        console.log(`${API_URL}/coach/video`);

        // ------------------------------------------
        // ENVIAR PARA BACKEND
        // ------------------------------------------

        const resposta = await fetch(
            `${API_URL}/coach/video`,
            {
                method: "POST",
                body: formData
            }
        );

        console.log(
            "📡 Status do servidor:",
            resposta.status
        );

        // ------------------------------------------
        // LER RESPOSTA
        // ------------------------------------------

        let dados;

        try {

            dados = await resposta.json();

        } catch (erroJSON) {

            throw new Error(
                "O servidor não retornou uma resposta válida."
            );

        }

        console.log("🤖 RESPOSTA DO BACKEND:");
        console.log(dados);

        // ------------------------------------------
        // VERIFICAR ERRO
        // ------------------------------------------

        if (!resposta.ok || !dados.sucesso) {

            throw new Error(
                dados.erro ||
                "Não foi possível analisar o vídeo."
            );

        }

        // ------------------------------------------
        // PEGAR ANÁLISE
        // ------------------------------------------

        const analise = dados.analise;

        if (!analise) {

            throw new Error(
                "A IA não retornou uma análise."
            );

        }

        console.log("======================================");
        console.log("✅ ANÁLISE RECEBIDA");
        console.log("======================================");

        console.log(analise);

        // ==================================================
        // AVALIAÇÃO
        // ==================================================

        let textoAvaliacao =
            `⭐ Nota: ${analise.nota ?? "--"}/100`;

        if (analise.resumo) {

            textoAvaliacao +=
                `\n\n${analise.resumo}`;

        }

        if (analise.manobra) {

            textoAvaliacao +=
                `\n\n🏄 Manobra: ${analise.manobra}`;

        }

        preencherElemento(
            "avaliacao",
            textoAvaliacao
        );

        // ==================================================
        // PONTOS FORTES
        // ==================================================

        if (
            Array.isArray(analise.pontosFortes) &&
            analise.pontosFortes.length > 0
        ) {

            preencherElemento(
                "pontosFortes",
                analise.pontosFortes
                    .map(item => `• ${item}`)
                    .join("\n")
            );

        } else {

            preencherElemento(
                "pontosFortes",
                "Nenhum ponto forte específico pôde ser identificado."
            );

        }

        // ==================================================
        // MELHORIAS
        // ==================================================

        if (
            Array.isArray(analise.melhorias) &&
            analise.melhorias.length > 0
        ) {

            preencherElemento(
                "melhorar",
                analise.melhorias
                    .map(item => `• ${item}`)
                    .join("\n")
            );

        } else {

            preencherElemento(
                "melhorar",
                "Nenhuma melhoria específica foi identificada."
            );

        }

        // ==================================================
        // TÉCNICA
        // ==================================================

        if (analise.tecnica) {

            const tecnica = analise.tecnica;

            const textoTecnica = [

                `🧍 Postura: ${tecnica.postura || "Não avaliada"}`,

                `⚖️ Equilíbrio: ${tecnica.equilibrio || "Não avaliado"}`,

                `🦵 Pernas: ${tecnica.pernas || "Não avaliadas"}`,

                `💪 Braços: ${tecnica.bracos || "Não avaliados"}`,

                `🏄 Posição na prancha: ${
                    tecnica.posicaoNaPrancha ||
                    "Não avaliada"
                }`

            ].join("\n\n");

            preencherElemento(
                "tecnica",
                textoTecnica
            );

        } else {

            preencherElemento(
                "tecnica",
                "Não foi possível detalhar a técnica."
            );

        }

        // ==================================================
        // TREINO
        // ==================================================

        preencherElemento(
            "treino",
            analise.treino ||
            "O Coach IA não encontrou um treino específico para esta sessão."
        );

        // ==================================================
        // PRÓXIMO OBJETIVO
        // ==================================================

        if (analise.proximoObjetivo) {

            preencherElemento(
                "proximoObjetivo",
                `🎯 ${analise.proximoObjetivo}`
            );

        }

        // ==================================================
        // FINALIZAR
        // ==================================================

        analisarBtn.disabled = false;

        analisarBtn.textContent =
            "🤖 Analisar outro vídeo";

        console.log(
            "✅ Análise do vídeo concluída."
        );

    } catch (erro) {

        console.error(
            "❌ ERRO AO ANALISAR VÍDEO:"
        );

        console.error(erro);

        // ----------------------------------------------
        // MOSTRAR ERRO NA TELA
        // ----------------------------------------------

        preencherElemento(
            "avaliacao",
            `❌ Não foi possível analisar o vídeo.\n\n${erro.message}`
        );

        preencherElemento(
            "pontosFortes",
            "A análise não foi concluída."
        );

        preencherElemento(
            "melhorar",
            "Verifique se o servidor do WaveRise está funcionando."
        );

        preencherElemento(
            "tecnica",
            "Não foi possível obter os dados técnicos."
        );

        preencherElemento(
            "treino",
            "Tente novamente após verificar a conexão com o servidor."
        );

        // ----------------------------------------------
        // LIBERAR BOTÃO
        // ----------------------------------------------

        analisarBtn.disabled = false;

        analisarBtn.textContent =
            "🤖 Tentar novamente";

    }

});