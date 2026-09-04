// ======================================================
// WaveRise PRO — Análise de Foto
// ======================================================

const fotoInput = document.getElementById("fotoInput");
const preview = document.getElementById("preview");
const analisarBtn = document.getElementById("analisarBtn");
const resultado = document.getElementById("resultado");
const textoResultado = document.getElementById("textoResultado");

// ======================================================
// SELECIONAR FOTO
// ======================================================

fotoInput.addEventListener("change", () => {

    const arquivo = fotoInput.files[0];

    if (!arquivo) {
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function(evento) {

        preview.src = evento.target.result;
        preview.style.display = "block";

        analisarBtn.style.display = "block";

        resultado.style.display = "none";
    };

    leitor.readAsDataURL(arquivo);
});

// ======================================================
// ANALISAR FOTO
// ======================================================

analisarBtn.addEventListener("click", async () => {

    const arquivo = fotoInput.files[0];

    if (!arquivo) {
        alert("📸 Escolha uma foto primeiro.");
        return;
    }

    analisarBtn.disabled = true;
    analisarBtn.textContent = "🤖 Analisando sua técnica...";

    resultado.style.display = "block";

    textoResultado.innerHTML = `
        <strong>🏄 Analisando sua sessão...</strong>
        <br><br>
        O WaveRise está avaliando sua postura,
        equilíbrio e posicionamento sobre a prancha.
    `;

    try {

        // ==================================================
        // CONVERSÃO DA FOTO
        // ==================================================

        const base64 = await arquivoParaBase64(arquivo);

        console.log("📸 Foto preparada para análise.");

        // ==================================================
        // POR ENQUANTO — TESTE DA FUNÇÃO
        // ==================================================

        await new Promise(resolve => setTimeout(resolve, 1500));

        textoResultado.innerHTML = `
            <strong>🏄 Análise concluída!</strong>

            <br><br>

            📐 <strong>Postura:</strong><br>
            Sua postura será avaliada em relação
            ao posicionamento ideal sobre a prancha.

            <br><br>

            ⚖️ <strong>Equilíbrio:</strong><br>
            O WaveRise analisará a distribuição
            do seu peso entre os pés.

            <br><br>

            🦵 <strong>Posição das pernas:</strong><br>
            Será observada a flexão dos joelhos
            e a estabilidade durante a onda.

            <br><br>

            🏄 <strong>Técnica:</strong><br>
            A análise identificará pontos fortes
            e aspectos que podem ser aprimorados.

            <br><br>

            ⭐ <strong>Próximo passo:</strong><br>
            conectar esta tela à inteligência artificial
            para realizar a análise real da sua foto.
        `;

        console.log("Foto:", base64.substring(0, 50) + "...");

    } catch (erro) {

        console.error("Erro na análise:", erro);

        textoResultado.innerHTML = `
            ❌ Não foi possível analisar a foto.
            <br><br>
            Tente novamente.
        `;

    } finally {

        analisarBtn.disabled = false;
        analisarBtn.textContent = "🤖 Analisar minha técnica";

    }

});

// ======================================================
// CONVERTER ARQUIVO PARA BASE64
// ======================================================

function arquivoParaBase64(arquivo) {

    return new Promise((resolve, reject) => {

        const leitor = new FileReader();

        leitor.onload = () => resolve(leitor.result);

        leitor.onerror = () =>
            reject(new Error("Não foi possível ler a foto."));

        leitor.readAsDataURL(arquivo);

    });

}