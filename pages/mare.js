// =====================================
// MARÉ - WaveRise 4.0
// =====================================

export async function buscarMare(latitude, longitude) {

    try {

        if (latitude == null || longitude == null) {

            throw new Error("Localização inválida.");

        }

        // Open-Meteo Marine
        const url =
`https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height&timezone=auto`;

        const resposta = await fetch(url);

        if (!resposta.ok) {

            throw new Error(`Erro ${resposta.status}`);

        }

        const dados = await resposta.json();

        // A Open-Meteo Marine não fornece maré astronômica.
        // Enquanto não integrar uma API específica de marés,
        // retornamos um texto informativo.

        return {

            altura: "--",

            estado: "Indisponível",

            proxima: "--"

        };

    }

    catch (erro) {

        console.error("Erro ao buscar maré:", erro);

        return {

            altura: "--",

            estado: "Indisponível",

            proxima: "--"

        };

    }

}

console.log("🌊 Módulo de maré carregado.");