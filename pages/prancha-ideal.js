// =====================================================
// WAVERISE — PRANCHA IDEAL
// =====================================================

const perfil = JSON.parse(
    localStorage.getItem("perfilWaveRise") || "{}"
);

const historico = JSON.parse(
    localStorage.getItem("historicoSurfWaveRise") || "[]"
);


// =====================================================
// ELEMENTOS
// =====================================================

const nivelEl = document.getElementById("nivel");
const objetivoEl = document.getElementById("objetivo");
const alturaEl = document.getElementById("altura");
const pesoEl = document.getElementById("peso");

const tipoOndaEl = document.getElementById("tipoOnda");
const focoEl = document.getElementById("foco");
const estiloEl = document.getElementById("estilo");

const btnRecomendar = document.getElementById("btnRecomendar");

const resultadoEl = document.getElementById("resultado");
const alternativasEl = document.getElementById("alternativas");
const listaAlternativasEl = document.getElementById("listaAlternativas");


// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function primeiroValor(...valores) {

    for (const valor of valores) {

        if (
            valor !== undefined &&
            valor !== null &&
            String(valor).trim() !== ""
        ) {
            return valor;
        }
    }

    return null;
}


function normalizar(valor) {

    if (!valor) {
        return "";
    }

    return String(valor)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


function numero(valor) {

    if (valor === null || valor === undefined) {
        return null;
    }

    const texto = String(valor)
        .replace(",", ".")
        .replace(/[^\d.]/g, "");

    const resultado = parseFloat(texto);

    return Number.isFinite(resultado)
        ? resultado
        : null;
}


// =====================================================
// CARREGAR PERFIL
// =====================================================

function carregarPerfil() {

    const nivel = primeiroValor(
        perfil.nivel,
        perfil.nivelSurf,
        perfil.experiencia,
        perfil.categoria
    );

    const objetivo = primeiroValor(
        perfil.objetivo,
        perfil.objetivoSurf,
        perfil.meta
    );

    const altura = primeiroValor(
        perfil.altura,
        perfil.alturaCm,
        perfil.alturaPessoa
    );

    const peso = primeiroValor(
        perfil.peso,
        perfil.pesoKg,
        perfil.pesoPessoa
    );


    if (nivelEl) {
        nivelEl.textContent = nivel || "Não informado";
    }

    if (objetivoEl) {
        objetivoEl.textContent = objetivo || "Não informado";
    }

    if (alturaEl) {
        alturaEl.textContent = altura
            ? `${altura} cm`
            : "Não informado";
    }

    if (pesoEl) {
        pesoEl.textContent = peso
            ? `${peso} kg`
            : "Não informado";
    }
}


// =====================================================
// DETECTAR NÍVEL
// =====================================================

function detectarNivel() {

    const nivelPerfil = normalizar(
        primeiroValor(
            perfil.nivel,
            perfil.nivelSurf,
            perfil.experiencia,
            perfil.categoria
        )
    );

    if (
        nivelPerfil.includes("inic") ||
        nivelPerfil.includes("beginner") ||
        nivelPerfil.includes("basico")
    ) {
        return "iniciante";
    }

    if (
        nivelPerfil.includes("inter") ||
        nivelPerfil.includes("medio")
    ) {
        return "intermediario";
    }

    if (
        nivelPerfil.includes("avan") ||
        nivelPerfil.includes("pro")
    ) {
        return "avancado";
    }


    // Caso o perfil não tenha nível,
    // usamos o histórico como referência.

    if (historico.length === 0) {
        return "iniciante";
    }

    if (historico.length < 15) {
        return "iniciante";
    }

    if (historico.length < 40) {
        return "intermediario";
    }

    return "avancado";
}


// =====================================================
// CALCULAR VOLUME
// =====================================================

function calcularVolume(peso, nivel, categoria) {

    if (!peso) {
        return "Definir com avaliação";
    }

    let fator = 0.50;

    if (nivel === "iniciante") {
        fator = 0.65;
    }

    if (nivel === "intermediario") {
        fator = 0.52;
    }

    if (nivel === "avancado") {
        fator = 0.40;
    }

    if (categoria === "Funboard") {
        fator += 0.05;
    }

    if (categoria === "Longboard") {
        fator += 0.08;
    }

    const volume = peso * fator;

    return `${Math.round(volume)} L`;
}


// =====================================================
// ESCOLHER PRANCHA
// =====================================================

function recomendarPrancha() {

    const nivel = detectarNivel();

    const tipoOnda = normalizar(tipoOndaEl?.value);
    const foco = normalizar(focoEl?.value);
    const estilo = normalizar(estiloEl?.value);


    let categoria = "Funboard";
    let nome = "Funboard All Around";
    let descricao =
        "Uma opção equilibrada para ganhar estabilidade, remada e confiança nas ondas.";
    let tamanho = "7'0\" – 7'6\"";
    let modelo = "Funboard";
    let motivo =
        "A combinação de estabilidade e facilidade de remada favorece uma evolução consistente.";


    // =================================================
    // INICIANTE
    // =================================================

    if (nivel === "iniciante") {

        categoria = "Funboard";
        nome = "Funboard Evolution";
        modelo = "Funboard";
        tamanho = "7'0\" – 8'0\"";

        descricao =
            "Prancha estável, com boa remada e bastante área de contato com a água.";

        motivo =
            "Para quem está construindo base, a prioridade é estabilidade, facilidade de remada e segurança para pegar mais ondas.";


        if (tipoOnda === "pequena") {

            categoria = "Longboard";
            nome = "Longboard Classic";
            modelo = "Longboard";
            tamanho = "8'0\" – 9'0\"";

            descricao =
                "Grande área de contato e excelente capacidade de pegar ondas pequenas.";

            motivo =
                "Em ondas pequenas, o maior volume ajuda a gerar velocidade e facilita a entrada nas ondas.";
        }
    }


    // =================================================
    // INTERMEDIÁRIO
    // =================================================

    if (nivel === "intermediario") {

        categoria = "Hybrid";
        nome = "Hybrid Performance";
        modelo = "Hybrid";
        tamanho = "6'2\" – 6'8\"";

        descricao =
            "Prancha versátil que combina estabilidade, velocidade e capacidade de manobra.";

        motivo =
            "O objetivo nesta fase é reduzir gradualmente o volume sem perder muita estabilidade.";

        if (foco === "velocidade") {

            categoria = "Fish";
            nome = "Performance Fish";
            modelo = "Fish";
            tamanho = "5'8\" – 6'2\"";

            descricao =
                "Prancha rápida e solta, especialmente interessante para ondas menores e mais fracas.";

            motivo =
                "O outline mais largo e o rocker reduzido ajudam a gerar velocidade em ondas com pouca força.";
        }

        if (
            foco === "manobras" ||
            foco === "performance" ||
            estilo === "competicao"
        ) {

            categoria = "Shortboard";
            nome = "Performance Shortboard";
            modelo = "Shortboard";
            tamanho = "5'10\" – 6'4\"";

            descricao =
                "Modelo direcionado para evolução de manobras, controle e resposta rápida.";

            motivo =
                "Uma prancha mais responsiva permite trabalhar curvas, pressão e velocidade nas manobras.";
        }
    }


    // =================================================
    // AVANÇADO
    // =================================================

    if (nivel === "avancado") {

        categoria = "Shortboard";
        nome = "High Performance Shortboard";
        modelo = "Shortboard";
        tamanho = "5'6\" – 6'2\"";

        descricao =
            "Prancha responsiva para alta performance, curvas e manobras mais agressivas.";

        motivo =
            "Com maior domínio técnico, é possível priorizar resposta, controle e performance.";

        if (tipoOnda === "grande" || tipoOnda === "forte") {

            categoria = "Step Up";
            nome = "Step Up";
            modelo = "Step Up";
            tamanho = "6'2\" – 7'0\"";

            descricao =
                "Modelo com mais comprimento e controle para ondas maiores e mais potentes.";

            motivo =
                "Em ondas fortes, comprimento e controle adicionais ajudam na remada, entrada e segurança.";
        }

        if (foco === "velocidade") {

            categoria = "Fish Performance";
            nome = "Performance Fish";
            modelo = "Fish";
            tamanho = "5'6\" – 6'0\"";

            descricao =
                "Modelo rápido e solto para gerar velocidade e trabalhar linhas mais abertas.";

            motivo =
                "A proposta é aproveitar a velocidade da prancha sem comprometer a capacidade de manobra.";
        }
    }


    // =================================================
    // AJUSTES PELO FOCO
    // =================================================

    if (
        nivel === "iniciante" &&
        foco === "estabilidade"
    ) {

        categoria = "Longboard";
        nome = "Longboard Progression";
        modelo = "Longboard";
        tamanho = "8'0\" – 9'0\"";

        descricao =
            "Máxima estabilidade e facilidade para desenvolver posicionamento e leitura de ondas.";

        motivo =
            "Como estabilidade é a prioridade, uma prancha maior oferece uma plataforma mais previsível.";
    }


    if (
        nivel === "intermediario" &&
        foco === "estabilidade"
    ) {

        categoria = "Funboard";
        nome = "Funboard Performance";
        modelo = "Funboard";
        tamanho = "6'8\" – 7'4\"";

        descricao =
            "Uma opção intermediária para manter estabilidade enquanto você evolui tecnicamente.";

        motivo =
            "Permite continuar pegando muitas ondas enquanto prepara a transição para pranchas menores.";
    }


    // =================================================
    // PESO
    // =================================================

    const peso = numero(
        primeiroValor(
            perfil.peso,
            perfil.pesoKg,
            perfil.pesoPessoa
        )
    );


    const volume = calcularVolume(
        peso,
        nivel,
        categoria
    );


    // =================================================
    // COMPATIBILIDADE
    // =================================================

    let compatibilidade = 75;


    if (nivel === "iniciante") {
        compatibilidade += 8;
    }

    if (nivel === "intermediario") {
        compatibilidade += 5;
    }

    if (nivel === "avancado") {
        compatibilidade += 3;
    }

    if (foco === "estabilidade" && categoria === "Longboard") {
        compatibilidade += 8;
    }

    if (foco === "velocidade" && categoria.includes("Fish")) {
        compatibilidade += 8;
    }

    if (
        foco === "performance" &&
        categoria === "Shortboard"
    ) {
        compatibilidade += 8;
    }

    if (
        (tipoOnda === "grande" || tipoOnda === "forte") &&
        categoria === "Step Up"
    ) {
        compatibilidade += 8;
    }


    compatibilidade = Math.min(
        98,
        Math.max(70, compatibilidade)
    );


    // =================================================
    // COACH
    // =================================================

    let coachMensagem =
        `Pelo seu perfil, o WaveRise indica uma ${nome} como ponto de partida. `;

    if (nivel === "iniciante") {

        coachMensagem +=
            "Neste momento, priorize estabilidade e quantidade de ondas. Quanto mais ondas você pega, mais rápido consegue desenvolver leitura e posicionamento.";
    }

    if (nivel === "intermediario") {

        coachMensagem +=
            "Você já pode buscar uma prancha mais responsiva, mas sem sacrificar totalmente a facilidade para pegar ondas.";
    }

    if (nivel === "avancado") {

        coachMensagem +=
            "Sua prancha pode ser mais específica para performance. O ajuste fino deve considerar seu estilo de surf e as características das ondas que você costuma surfar.";
    }


    // =================================================
    // MOSTRAR RESULTADO
    // =================================================

    document.getElementById("categoria").textContent = categoria;

    document.getElementById("nomePrancha").textContent = nome;

    document.getElementById("descricaoPrancha").textContent =
        descricao;

    document.getElementById("tamanho").textContent =
        tamanho;

    document.getElementById("volume").textContent =
        volume;

    document.getElementById("modelo").textContent =
        modelo;

    document.getElementById("compatibilidadeValor").textContent =
        `${compatibilidade}%`;

    document.getElementById("barraCompatibilidade").style.width =
        `${compatibilidade}%`;

    document.getElementById("motivo").textContent =
        motivo;

    document.getElementById("coachMensagem").textContent =
        coachMensagem;


    resultadoEl.style.display = "block";

    criarAlternativas(
        nivel,
        tipoOnda,
        foco,
        categoria
    );


    resultadoEl.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// =====================================================
// ALTERNATIVAS
// =====================================================

function criarAlternativas(
    nivel,
    tipoOnda,
    foco,
    principal
) {

    const alternativas = [];


    if (principal !== "Funboard") {

        alternativas.push({
            nome: "Funboard All Around",
            tipo: "Funboard",
            descricao:
                "Mais estabilidade e facilidade para pegar ondas."
        });
    }


    if (principal !== "Hybrid") {

        alternativas.push({
            nome: "Hybrid All Around",
            tipo: "Hybrid",
            descricao:
                "Boa combinação entre estabilidade, velocidade e manobrabilidade."
        });
    }


    if (
        principal !== "Shortboard" &&
        nivel !== "iniciante"
    ) {

        alternativas.push({
            nome: "Performance Shortboard",
            tipo: "Shortboard",
            descricao:
                "Opção mais responsiva para evolução das manobras."
        });
    }


    if (
        principal !== "Longboard" &&
        tipoOnda === "pequena"
    ) {

        alternativas.push({
            nome: "Longboard Classic",
            tipo: "Longboard",
            descricao:
                "Excelente alternativa para ondas pequenas e sessões de linha."
        });
    }


    if (
        principal !== "Fish" &&
        foco === "velocidade"
    ) {

        alternativas.push({
            nome: "Performance Fish",
            tipo: "Fish",
            descricao:
                "Alternativa rápida para gerar velocidade em ondas menores."
        });
    }


    listaAlternativasEl.innerHTML = "";


    alternativas.slice(0, 3).forEach(prancha => {

        const div = document.createElement("div");

        div.className = "alternativa";

        div.innerHTML = `
            <div class="alternativa-topo">
                <h3>${prancha.nome}</h3>
                <span class="tag">${prancha.tipo}</span>
            </div>

            <p>${prancha.descricao}</p>
        `;

        listaAlternativasEl.appendChild(div);
    });


    if (alternativas.length > 0) {

        alternativasEl.style.display = "block";

    } else {

        alternativasEl.style.display = "none";
    }
}


// =====================================================
// EVENTO
// =====================================================

if (btnRecomendar) {

    btnRecomendar.addEventListener(
        "click",
        recomendarPrancha
    );
}


// =====================================================
// INICIALIZAÇÃO
// =====================================================

carregarPerfil();