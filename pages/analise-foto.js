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

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = (evento) => {

        preview.src = evento.target.result;
        preview.style.display = "block";

        analisarBtn.style.display = "block";

        resultado.style.display = "none";
    };

    leitor.readAsDataURL(arquivo);
});

// ======================================================
// ANALISAR FOTO COM IA
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
        equilíbrio, posicionamento e técnica.
    `;

    try {

        // ==================================================
        // ENVIAR FOTO PARA O BACKEND
        // ==================================================

        const formulario = new FormData();

        formulario.append("foto", arquivo);

        console.log("📸 Enviando foto para o WaveRise...");

        const resposta = await fetch(
            "http://localhost:3000/coach/foto",
            {
                method: "POST",
                body: formulario
            }
        );

        if (!resposta.ok) {

            const erro = await resposta.json().catch(() => ({}));

            throw new Error(
                erro.erro || `Erro do servidor: ${resposta.status}`
            );
        }

        const dados = await resposta.json();

        console.log("🤖 Resposta da IA:", dados);

        if (!dados.sucesso || !dados.analise) {
            throw new Error("A IA não retornou uma análise válida.");
        }

        mostrarResultado(dados.analise);

    } catch (erro) {

        console.error("❌ Erro na análise:", erro);

        textoResultado.innerHTML = `
            <strong>❌ Não foi possível analisar a foto.</strong>
            <br><br>
            ${erro.message}
            <br><br>
            Verifique se o servidor do WaveRise está funcionando.
        `;

    } finally {

        analisarBtn.disabled = false;
        analisarBtn.textContent = "🤖 Analisar minha técnica";

    }

});

// ======================================================
// MOSTRAR RESULTADO
// ======================================================

function mostrarResultado(analise) {

    const pontosFortes = Array.isArray(analise.pontosFortes)
        ? analise.pontosFortes
        : [];

    const melhorias = Array.isArray(analise.melhorias)
        ? analise.melhorias
        : [];

    textoResultado.innerHTML = `

        <div>

            <strong>🏄 Análise concluída!</strong>

            <br><br>

            ⭐ <strong>Nota:</strong>
            ${analise.nota ?? "--"}/100

            <br><br>

            🏄 <strong>Manobra:</strong>
            ${analise.manobra || "Não identificada"}

            <br><br>

            💪 <strong>Pontos fortes:</strong>

            <ul>
                ${pontosFortes.length
                    ? pontosFortes.map(item => `<li>${item}</li>`).join("")
                    : "<li>Nenhum ponto identificado.</li>"
                }
            </ul>

            <br>

            🎯 <strong>O que melhorar:</strong>

            <ul>
                ${melhorias.length
                    ? melhorias.map(item => `<li>${item}</li>`).join("")
                    : "<li>Nenhuma melhoria identificada.</li>"
                }
            </ul>

            <br>

            🏋️ <strong>Treino recomendado:</strong>

            <br><br>

            ${analise.treino || "Nenhum treino recomendado."}

        </div>

    `;
}