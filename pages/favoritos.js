// =====================================
// FAVORITOS - WaveRise 2.0
// =====================================

const CHAVE = "praiasFavoritasWaveRise";

// =====================================

export function carregarFavoritos() {

    return JSON.parse(
        localStorage.getItem(CHAVE) || "[]"
    );

}

// =====================================

export function salvarFavorito(nome, latitude, longitude) {

    if (!nome) return;

    nome = nome.trim();

    let favoritos = carregarFavoritos();

    const existe = favoritos.some(

        praia => praia.nome.toLowerCase() === nome.toLowerCase()

    );

    if (existe) {

        alert("Esta praia já está nos favoritos.");

        return;

    }

    favoritos.push({

        nome,
        latitude,
        longitude,
        criadoEm: Date.now()

    });

    favoritos.sort(

        (a, b) => a.nome.localeCompare(b.nome)

    );

    localStorage.setItem(

        CHAVE,

        JSON.stringify(favoritos)

    );

    mostrarFavoritos();

}

// =====================================

export function removerFavorito(nome) {

    if (!confirm(`Remover "${nome}" dos favoritos?`))
        return;

    const favoritos = carregarFavoritos().filter(

        praia => praia.nome !== nome

    );

    localStorage.setItem(

        CHAVE,

        JSON.stringify(favoritos)

    );

    mostrarFavoritos();

}

// =====================================

export function mostrarFavoritos(callback = null) {

    const container =
        document.getElementById("favoritos");

    if (!container) return;

    const favoritos = carregarFavoritos();

    container.innerHTML = "";

    if (favoritos.length === 0) {

        container.innerHTML = `
            <p>Nenhuma praia favorita salva.</p>
        `;

        return;

    }

    const titulo = document.createElement("h3");

    titulo.textContent =
        `⭐ Favoritos (${favoritos.length})`;

    container.appendChild(titulo);

    favoritos.forEach((praia, indice) => {

        const card = document.createElement("div");

        card.className = "favoritoCard";

        card.innerHTML = `

            <div>

                <strong>

                    ${indice === 0 ? "⭐ " : ""}${praia.nome}

                </strong>

            </div>

            <div class="acoesFavorito">

                <button class="abrir">

                    🌊 Abrir

                </button>

                <button class="excluir">

                    🗑

                </button>

            </div>

        `;

        card.querySelector(".abrir").onclick = () => {

            if (callback) {

                callback(praia);

            }

        };

        card.querySelector(".excluir").onclick = () => {

            removerFavorito(praia.nome);

        };

        container.appendChild(card);

    });

}

// =====================================

export function limparFavoritos() {

    if (!confirm("Deseja remover todas as praias favoritas?"))
        return;

    localStorage.removeItem(CHAVE);

    mostrarFavoritos();

}

console.log("⭐ Favoritos carregados.");